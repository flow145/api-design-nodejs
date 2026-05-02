import { and, desc, eq } from 'drizzle-orm'
import type { Response } from 'express'
import { db } from '../db/connection.ts'
import { entries, habits, habitTags, type NewHabit } from '../db/schema.ts'
import type { AuthenticatedRequest } from '../middleware/auth.ts'

interface NewHabitBody
  extends Pick<NewHabit, 'name' | 'description' | 'frequency' | 'targetCount' | 'isActive'> {
  tagIds?: string[]
}

interface UpdateHabitBody extends Partial<NewHabitBody> {}

export const createHabit = async (
  req: AuthenticatedRequest<unknown, unknown, NewHabitBody>,
  res: Response,
) => {
  try {
    const { name, description, frequency, targetCount, tagIds } = req.body
    const result = await db.transaction(async (tx) => {
      const [newHabit] = await tx
        .insert(habits)
        .values({
          userId: req.user!.id,
          name,
          description,
          frequency,
          targetCount,
        })
        .returning()

      if (tagIds && tagIds.length > 0) {
        const habitTagValues = tagIds.map((tagId) => ({ habitId: newHabit.id, tagId }))
        await tx.insert(habitTags).values(habitTagValues)
      }

      return newHabit
    })

    res.status(201).json({ message: 'Habit created successfully', habit: result })
  } catch (error) {
    console.error('Create habit error', error)
    res.status(500).json({ error: 'Failed to create habit' })
  }
}

export const getUserHabits = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userHabitsWithTags = await db.query.habits.findMany({
      where: eq(habits.userId, req.user!.id),
      with: {
        habitTags: {
          with: { tag: true },
        },
      },
      orderBy: [desc(habits.createdAt)],
    })

    // should be a transform fn on a database level instead of this:
    const habitsWithTags = userHabitsWithTags.map((habit) => ({
      ...habit,
      tags: habit.habitTags.map((ht) => ht.tag),
      habitTags: undefined,
    }))

    res.json({ habits: habitsWithTags })
  } catch (error) {
    console.error('Get habits error', error)
    res.status(500).json({ error: 'Failed to fetch habits' })
  }
}

export const getHabit = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params
    const habit = await db.query.habits.findFirst({
      where: eq(habits.id, id),
      with: {
        habitTags: {
          with: { tag: true },
        },
        entries: {
          orderBy: [desc(entries.completionDate)],
          limit: 10,
        },
      },
    })

    if (!habit) return res.status(404).json({ error: 'Habit not found' })

    const habitWithTags = {
      ...habit,
      tags: habit.habitTags.map((ht) => ht.tag),
      habitTags: undefined,
    }

    res.json({ habit: habitWithTags })
  } catch (error) {
    console.error('Get habit error', error)
    res.status(500).json({ error: 'Failed to fetch habit' })
  }
}

export const updateHabit = async (
  req: AuthenticatedRequest<{ id: string }, unknown, UpdateHabitBody>,
  res: Response,
) => {
  try {
    const { id } = req.params
    const { tagIds, ...updates } = req.body

    const result = await db.transaction(async (tx) => {
      const [updatedHabit] = await tx
        .update(habits)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(habits.id, id), eq(habits.userId, req.user!.id)))
        .returning()

      if (!updateHabit) return res.status(404).json({ error: 'Habit not found' })

      if (tagIds !== undefined) {
        await tx.delete(habitTags).where(eq(habitTags.habitId, id))

        if (tagIds.length > 0) {
          const habitTagValues = tagIds.map((tagId) => ({ habitId: id, tagId }))
          await tx.insert(habitTags).values(habitTagValues)
        }
      }

      return updatedHabit
    })

    res.json({ message: 'Habit updated successfully', habit: result })
  } catch (error) {
    console.error('Update habit error', error)
    res.status(500).json({ error: 'Failed to update habit' })
  }
}

export const deleteHabit = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params
    const [deletedHabit] = await db
      .delete(habits)
      .where(and(eq(habits.id, id), eq(habits.userId, req.user!.id)))
      .returning()

    if (!deletedHabit) return res.status(404).json({ error: 'Habit not found' })

    res.status(204).json({ message: 'Habit deleted successfully' })
  } catch (error) {
    console.error('Delete habit error:', error)
    res.status(500).json({ error: 'Failed to delete habit' })
  }
}
