import { createSecretKey } from 'node:crypto'
import { type JWTPayload, jwtVerify, SignJWT } from 'jose'
import { env } from '../../env.ts'

export interface AuthenticatedUser extends JWTPayload {
  id: string
  email: string
  username: string
}

export const generateToken = async (payload: AuthenticatedUser) => {
  const secretKey = createSecretKey(env.JWT_SECRET, 'utf-8')

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN)
    .sign(secretKey)
}

export const verifyToken = async (token: string): Promise<AuthenticatedUser> => {
  const secretKey = createSecretKey(env.JWT_SECRET, 'utf-8')
  const { payload } = await jwtVerify<AuthenticatedUser>(token, secretKey)
  return payload
}
