import { Router } from 'express'
import { z } from 'zod'
import { login, register } from '../controllers/authController.ts'
import { insertUserSchema } from '../db/schema.ts'
import { validateBody } from '../middleware/validation.ts'

export const registerSchema = z.strictObject({
  email: z.email().max(255),
  username: z.string().trim().min(3).max(50),
  password: z
    .string()
    .min(8)
    .max(255)
    .regex(
      /^[a-z\d@$!%*?&]$/i,
      'Password must contain at least one letter, number, special character',
    ),
  firstName: z.string().trim().max(50).optional(),
  lastName: z.string().trim().max(50).optional(),
})

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

export const authRouter = Router()

authRouter.post('/register', validateBody(insertUserSchema), register)
authRouter.post('/login', validateBody(loginSchema), login)
