import type { NextFunction, Request, Response } from 'express'
import { isDevEnv } from '../../env.ts'

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(error.stack) // use logger for prod

  let status = error.status || 500
  let message = error.message || 'Internal server error'
  const { name } = error

  if (name === 'ValidationError') {
    status = 400
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
