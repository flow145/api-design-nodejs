import { Router } from 'express'
import z from 'zod'
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

export const habitRouter = Router()

habitRouter.use(authenticateToken)

habitRouter.get('/', getUserHabits)

habitRouter.get('/:id', (_req, res) => {
  res.json({ message: 'Got 1 habit' })
})

habitRouter.post('/', validateBody(createHabitSchema), createHabit)

habitRouter.patch('/:id', updateHabit)

habitRouter.delete('/:id', (_req, res) => {
  res.json({ message: 'Deleted habit' })
})

habitRouter.post('/:id/complete', (_req, res) => {
  res.status(201).json({ message: 'Completed habit' })
})
