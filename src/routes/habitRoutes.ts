import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.ts'

export const habitRouter = Router()

habitRouter.use(authenticateToken)

habitRouter.get('/', (_req, res) => {
  res.json({ message: 'Habits' })
})

habitRouter.get('/:id', (_req, res) => {
  res.json({ message: 'Got 1 habit' })
})

habitRouter.post('/', (_req, res) => {
  res.status(201).json({ message: 'Created habit' })
})

habitRouter.delete('/:id', (_req, res) => {
  res.json({ message: 'Deleted habit' })
})

habitRouter.post('/:id/complete', (_req, res) => {
  res.status(201).json({ message: 'Completed habit' })
})
