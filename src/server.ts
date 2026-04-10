import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { isTestEnv } from '../env.ts'
import { errorHandler } from './middleware/errorHandler.ts'
import { authRouter } from './routes/authRoutes.ts'
import { habitRouter } from './routes/habitRoutes.ts'
import { userRouter } from './routes/userRoutes.ts'

export const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(cors())
app.use(morgan('dev', { skip: isTestEnv }))

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

app.use(errorHandler)
