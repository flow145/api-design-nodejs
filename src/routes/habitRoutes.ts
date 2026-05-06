import { Router } from 'express'
import { z } from 'zod'
import {
  createHabit,
  deleteHabit,
  getHabit,
  getUserHabits,
  updateHabit,
} from '../controllers/habitController.ts'
import { authenticateToken } from '../middleware/auth.ts'
import { validateBody, validateParams } from '../middleware/validation.ts'

const habitParamsSchema = z.object({
  id: z.uuidv4(),
})

const createHabitBodySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  frequency: z.string(),
  targetCount: z.number(),
  tagIds: z.array(z.string()).optional(),
})

const updateHabitBodySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  frequency: z.string().optional(),
  targetCount: z.number().optional(),
  isActive: z.boolean().optional(),
  tagIds: z.array(z.string()).optional(),
})

export const habitsRouter = Router()

habitsRouter.use(authenticateToken)

habitsRouter.get('/', getUserHabits)
habitsRouter.get('/:id', validateParams(habitParamsSchema), getHabit)
habitsRouter.post('/', validateBody(createHabitBodySchema), createHabit)
habitsRouter.patch(
  '/:id',
  validateParams(habitParamsSchema),
  validateBody(updateHabitBodySchema),
  updateHabit,
)
habitsRouter.delete('/:id', validateParams(habitParamsSchema), deleteHabit)

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
