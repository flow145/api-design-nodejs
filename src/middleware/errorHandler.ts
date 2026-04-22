import type { NextFunction, Request, Response } from 'express'
import { isDevEnv } from '../../env.ts'

export const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.log(error.stack) // use logger for prod

  // @ts-expect-error
  let status = error.status || 500
  let message = error.message || 'Internal server error'
  const { name } = error

  if (name === 'ValidationError') {
    status = 422
    message = 'Validation Error'
  }

  if (name === 'UnauthorizedError') {
    status = 401
    message = 'Unauthorized'
  }

  return res.status(status).json({
    error: message,
    ...(isDevEnv() && {
      stack: error.stack,
      details: error.message,
    }),
  })
}
