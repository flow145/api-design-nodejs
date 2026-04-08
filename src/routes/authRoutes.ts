import { Router } from 'express'

export const authRouter = Router()

authRouter.post('/register', (_req, res) => {
  res.status(201).json({ message: 'User signed up' })
})

authRouter.post('/login', (_req, res) => {
  res.status(200).json({ message: 'User logged in' })
})
