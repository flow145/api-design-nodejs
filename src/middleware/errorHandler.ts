import type { NextFunction, Request, Response } from 'express'
import { isDevEnv } from '../../env.ts'

export class CustomError extends Error {
  status: number
  name: string

  constructor(status: number, name: string, message: string) {
    super(message)
    this.status = status
    this.name = name
  }
}

export const errorHandler = (
  error: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.log(error.stack) // use logger for prod

  let status = error.status || 500
  let message = error.message || 'Internal server error'

  if (error.name === 'ValidationError') {
    status = 400
    message = 'Validation Error'
  }

  if (error.name === 'UnauthorizedError') {
    status = 401
    message = 'Unauthorized'
  }

  if (error.name === '23505') {
    // PostgreSQL unique violation
    status = 409
    message = 'Resource already exists'
  }

  if (error.name === '23503') {
    // PostgreSQL foreign key violation
    status = 400
    message = 'Invalid reference'
  }

  return res.status(status).json({
    error: message,
    ...(isDevEnv() && { stack: error.stack, details: error.message }),
  })
}
