import request from 'supertest'
import { app } from '../src/server.ts'
import { cleanupDatabase, createHabit, createTestUser, deleteHabit } from './helpers/dbHelpers.ts'

describe('Habits endpoints', () => {
  afterEach(async () => {
    await cleanupDatabase()
  })

  describe('GET /api/habits', () => {
    it('should return only current user habits sorted by creation date descending', async () => {
      const { user, token } = await createTestUser()
      await createHabit(user.id, { name: 'Habit 1' })
      await createHabit(user.id, { name: 'Habit 2' })

      const { user: otherUser } = await createTestUser()
      await createHabit(otherUser.id, { name: 'Other user habit' })

      const res = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(res.body).toMatchObject({
        habits: [
          expect.objectContaining({ name: 'Habit 2', tags: [] }),
          expect.objectContaining({ name: 'Habit 1', tags: [] }),
        ],
      })
    })

    it('should return an empty array when no habits are found', async () => {
      const { token } = await createTestUser()

      const res = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(res.body).toHaveProperty('habits')
      expect(res.body.habits).toHaveLength(0)
    })

    it('should return 401 when no token is provided', async () => {
      const res = await request(app).get('/api/habits').expect(401)

      expect(res.body).toHaveProperty('error')
    })
  })

  describe('GET /api/habits/:id', () => {
    it('should return a current user habit by id', async () => {
      const { user, token } = await createTestUser()
      const { id } = await createHabit(user.id, { name: 'Habit 1' })
      await createHabit(user.id, { name: 'Habit 2' })

      const res = await request(app)
        .get(`/api/habits/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(res.body).toMatchObject({
        habit: {
          name: 'Habit 1',
          tags: [],
        },
      })
    })

    it('should return 404 when habit is missing', async () => {
      const { user, token } = await createTestUser()
      const { id } = await createHabit(user.id, { name: 'Habit' })
      await deleteHabit(id)

      const res = await request(app)
        .get(`/api/habits/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)

      expect(res.body).toMatchObject({
        error: expect.stringMatching(/not found/i),
      })
    })

    it('should return 401 when no token is provided', async () => {
      const { user } = await createTestUser()
      const { id } = await createHabit(user.id, { name: 'Habit' })

      const res = await request(app).get(`/api/habits/${id}`).expect(401)

      expect(res.body).toHaveProperty('error')
    })
  })

  describe('POST /api/habits', () => {
    it('should create a habit and return 201', async () => {
      const { token } = await createTestUser()

      const res = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Habit', description: 'Habit description', frequency: '1d', targetCount: 1 })
        .expect(201)

      expect(res.body).toMatchObject({
        message: expect.stringMatching(/created/i),
        habit: expect.objectContaining({
          name: 'Habit',
          description: 'Habit description',
          frequency: '1d',
          targetCount: 1,
        }),
      })
    })

    it('should return 401 when no token is provided', async () => {
      const res = await request(app).post('/api/habits').expect(401)

      expect(res.body).toHaveProperty('error')
    })
  })

  describe('PATCH /api/habits/:id', () => {
    it('should update a habit and return 200', async () => {
      const { user, token } = await createTestUser()
      const { id } = await createHabit(user.id, { name: 'Habit' })

      const res = await request(app)
        .patch(`/api/habits/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated habit' })
        .expect(200)

      expect(res.body).toMatchObject({
        message: expect.stringMatching(/updated/i),
        habit: expect.objectContaining({
          name: 'Updated habit',
        }),
      })
    })

    it('should return 404 when habit is missing', async () => {
      const { user, token } = await createTestUser()
      const { id } = await createHabit(user.id, { name: 'Habit' })
      await deleteHabit(id)

      const res = await request(app)
        .patch(`/api/habits/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated habit' })
        .expect(404)

      expect(res.body).toMatchObject({
        error: expect.stringMatching(/not found/i),
      })
    })

    it('should return 401 when no token is provided', async () => {
      const { user } = await createTestUser()
      const { id } = await createHabit(user.id, { name: 'Habit' })

      const res = await request(app)
        .patch(`/api/habits/${id}`)
        .send({ name: 'Updated habit' })
        .expect(401)

      expect(res.body).toHaveProperty('error')
    })
  })

  describe('DELETE /api/habits/:id', () => {
    it('should delete a habit and return 204', async () => {
      const { user, token } = await createTestUser()
      const { id } = await createHabit(user.id, { name: 'Habit' })

      await request(app)
        .delete(`/api/habits/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
    })

    it('should return 404 when habit is missing', async () => {
      const { user, token } = await createTestUser()
      const { id } = await createHabit(user.id, { name: 'Habit' })
      await deleteHabit(id)

      const res = await request(app)
        .delete(`/api/habits/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)

      expect(res.body).toMatchObject({
        error: expect.stringMatching(/not found/i),
      })
    })
  })
})
