import { eq } from 'drizzle-orm'
import type { Request, Response } from 'express'
import { db } from '../db/connection.ts'
import { type NewUser, users } from '../db/schema.ts'
import { generateToken } from '../utils/jwt.ts'
import { comparePasswords, hashPassword } from '../utils/passwords.ts'

type RegisterBody = Pick<NewUser, 'email' | 'password' | 'firstName' | 'lastName' | 'username'>

interface LoginBody {
  email: string
  password: string
}

export const register = async (req: Request<unknown, unknown, RegisterBody>, res: Response) => {
  try {
    const hashedPassword = await hashPassword(req.body.password)

    const [user] = await db
      .insert(users)
      .values({ ...req.body, password: hashedPassword })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
      })

    const token = await generateToken({ id: user.id, email: user.email, username: user.username })

    res.status(201).json({ message: 'User created successfully', user, token })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Failed to create user' })
  }
}

export const login = async (req: Request<unknown, unknown, LoginBody>, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await db.query.users.findFirst({ where: eq(users.email, email) })

    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const isValidPassword = await comparePasswords(password, user.password)

    // TODO limit number or retries
    if (!isValidPassword) res.status(401).json({ error: 'Invalid credentials' })

    const token = await generateToken({ id: user.id, email: user.email, username: user.username })

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Failed to login' })
  }
}
