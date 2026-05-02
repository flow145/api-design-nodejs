import request from 'supertest'
import { app } from '../src/server.ts'
import { cleanupDatabase, createTestUser } from './setup/dbHelpers.ts'

describe('Authentication endpoints', () => {
  afterEach(async () => {
    await cleanupDatabase()
  })

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        email: 'testemail@test.com',
        username: 'testuser',
        password: 'admin1234',
      }

      const res = await request(app).post('/api/auth/register').send(userData).expect(201)

      expect(res.body).toHaveProperty('user')
      expect(res.body).toHaveProperty('token')
      expect(res.body.user).not.toHaveProperty('password')
    })
  })

  describe('POST /api/auth/login', () => {
    it('should log in with valid credentials', async () => {
      const testUser = await createTestUser()
      const credentials = { email: testUser.user.email, password: testUser.rawPassword }

      const res = await request(app).post('/api/auth/login').send(credentials).expect(200)

      expect(res.body).toHaveProperty('message')
      expect(res.body).toHaveProperty('user')
      expect(res.body).toHaveProperty('token')
      expect(res.body.user).not.toHaveProperty('password')
    })
  })
})
