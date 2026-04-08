import { Router } from 'express'

export const userRouter = Router()

userRouter.get('/', (_req, res) => {
  res.json({ message: 'Users' })
})

userRouter.get('/:id', (_req, res) => {
  res.json({ message: 'Got user' })
})

userRouter.put('/:id', (_req, res) => {
  res.json({ message: 'User updated' })
})

userRouter.delete('/:id', (_req, res) => {
  res.json({ message: 'User deleted' })
})
