import express from 'express'
import { authRouter } from './routes/authRoutes.ts'
import { habitRouter } from './routes/habitRoutes.ts'
import { userRouter } from './routes/userRoutes.ts'

export const app = express()

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Habit tracker API',
  })
})

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/habits', habitRouter)
