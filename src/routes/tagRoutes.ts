import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.ts'

export const tagsRouter = Router()

tagsRouter.use(authenticateToken)

tagsRouter.get('/', (_req, res) => {
  // TODO implement
  res.json({ message: 'Got tags' })
})

tagsRouter.get('/popular', (_req, res) => {
  // TODO implement
  res.json({ message: 'Got popular tags' })
})

tagsRouter.get('/:id', (_req, res) => {
  // TODO implement
  res.json({ message: 'Got tag' })
})

tagsRouter.post('/', (_req, res) => {
  // TODO implement
  res.json({ message: 'Created tag' })
})

tagsRouter.patch('/:id', (_req, res) => {
  // TODO implement
  res.json({ message: 'Updated tag' })
})

tagsRouter.delete('/:id', (_req, res) => {
  // TODO implement
  res.json({ message: 'Deleted tag' })
})

tagsRouter.get('/:id/habits', (_req, res) => {
  // TODO implement
  res.json({ message: 'Got habits by tag' })
})
