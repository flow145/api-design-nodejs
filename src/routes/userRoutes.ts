import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.ts'

export const usersRouter = Router()

usersRouter.use(authenticateToken)

usersRouter.get('/profile', (_req, res) => {
  // TODO implement
  res.json({ message: 'User profile' })
})

usersRouter.patch('/profile', (_req, res) => {
  // TODO implement
  res.json({ message: 'Updated user profile' })
})

usersRouter.put('/password', (_req, res) => {
  // TODO implement
  res.json({ message: 'Updated user password' })
})
