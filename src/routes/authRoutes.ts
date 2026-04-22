import { Router } from 'express'
import { z } from 'zod'
import { login, register } from '../controllers/authController.ts'
import { insertUserSchema } from '../db/schema.ts'
import { validateBody } from '../middleware/validation.ts'

const loginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

export const authRouter = Router()

// TODO extend the insertUserSchema with additional checks
authRouter.post('/register', validateBody(insertUserSchema), register)

authRouter.post('/login', validateBody(loginSchema), login)
