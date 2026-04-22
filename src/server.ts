import cors from 'cors'
import express, { type Request, type Response } from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import morgan from 'morgan'
import { env, isTestEnv } from '../env.ts'
import { errorHandler } from './middleware/errorHandler.ts'
import { authRouter } from './routes/authRoutes.ts'
import { habitsRouter } from './routes/habitRoutes.ts'
import { usersRouter } from './routes/userRoutes.ts'

export const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(cors({ origin: env.CORS_ORIGINS, credentials: true }))
app.use(
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)
app.use(morgan('dev', { skip: isTestEnv }))

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Habit tracker API',
  })
})

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/habits', habitsRouter)

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl })
})

app.use(errorHandler)
