import { cleanupDatabase, createTestUser } from './dbHelpers.ts'

describe('Test setup', () => {
  test('should connect to the test db', async () => {
    const { user } = await createTestUser()
    expect(user).toBeDefined()
    await cleanupDatabase()
  })
})
