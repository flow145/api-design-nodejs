import { Router } from 'express'
import { register } from '../controllers/authController.ts'
import { insertUserSchema } from '../db/schema.ts'
import { validateBody } from '../middleware/validation.ts'

export const authRouter = Router()

// TODO extend the insertUserSchema with additional checks
authRouter.post('/register', validateBody(insertUserSchema), register)

authRouter.post('/login', (_req, res) => {
  res.status(200).json({ message: 'User logged in' })
})
