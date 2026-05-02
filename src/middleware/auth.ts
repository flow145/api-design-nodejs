import type { NextFunction, Request, Response } from 'express'
import { type AuthenticatedUser, verifyToken } from '../utils/jwt.ts'

export interface AuthenticatedRequest<
  Params = Record<string, string>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Record<string, unknown>,
  Locals extends Record<string, unknown> = Record<string, unknown>,
> extends Request<Params, ResBody, ReqBody, ReqQuery, Locals> {
  user?: AuthenticatedUser
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ').at(1)

    if (!token) return res.status(401).json({ error: 'Bad request' })

    const payload = await verifyToken(token)
    req.user = payload
    next()
  } catch (_error) {
    return res.status(403).json({ error: 'Forbidden' })
  }
}
