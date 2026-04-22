import { Router } from 'express'
import { z } from 'zod'
import { createHabit, getUserHabits, updateHabit } from '../controllers/habitController.ts'
import { authenticateToken } from '../middleware/auth.ts'
import { validateBody } from '../middleware/validation.ts'

const createHabitSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  frequency: z.string(),
  targetCount: z.number(),
  tagIds: z.array(z.string()).optional(),
})

export const habitsRouter = Router()

habitsRouter.use(authenticateToken)

habitsRouter.get('/', getUserHabits)

habitsRouter.get('/:id', (_req, res) => {
  // TODO implement
  res.json({ message: 'Got 1 habit' })
})

habitsRouter.post('/', validateBody(createHabitSchema), createHabit)

habitsRouter.patch('/:id', updateHabit)

habitsRouter.delete('/:id', (_req, res) => {
  // TODO implement
  res.json({ message: 'Deleted habit' })
})

habitsRouter.post('/:id/complete', (_req, res) => {
  // TODO implement
  res.status(201).json({ message: 'Completed habit' })
})

habitsRouter.get('/tag/:tagId', (_req, res) => {
  // TODO implement
  res.json({ message: 'Got habits by tag' })
})

habitsRouter.post('/:id/tags', (_req, res) => {
  // TODO implement
  res.json({ message: 'Added tags to habit' })
})

habitsRouter.delete('/:id/tags/:tagId', (_req, res) => {
  // TODO implement
  res.json({ message: 'Removed tag from habit' })
})
