import { env as loadEnv } from 'custom-env'
import { z } from 'zod'

process.env.APP_STAGE = process.env.APP_STAGE || 'dev'

const _isProduction = process.env.APP_STAGE === 'production'
const isDevelopment = process.env.APP_STAGE === 'dev'
const isTesting = process.env.APP_STAGE === 'test'

if (isDevelopment) loadEnv()
if (isTesting) loadEnv('test')

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_STAGE: z.enum(['dev', 'test', 'production']).default('dev'),

  PORT: z.coerce.number().positive().default(3000),
  DATABASE_URL: z.string().startsWith('postgresql://'),
  JWT_SECRET: z.string().min(32, 'Must be at least 32 chars long'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_ROUNDS: z.coerce.number().min(10).max(20).default(12),
})

export type Env = z.infer<typeof envSchema>
let env: Env

try {
  env = envSchema.parse(process.env)
} catch (error) {
  if (error instanceof z.ZodError) {
    console.log('Invalid env var')

    error.issues.forEach(({ path, message }) => {
      console.log(`${path.join('.')}: ${message}`)
    })

    process.exit(1)
  }

  throw error
}

export const isProdEnv = () => env.APP_STAGE === 'production'
export const isDevEnv = () => env.APP_STAGE === 'dev'
export const isTestEnv = () => env.APP_STAGE === 'test'

export { env }
