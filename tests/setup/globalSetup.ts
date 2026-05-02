import { execSync } from 'node:child_process'
import { sql } from 'drizzle-orm'
import { db } from '../../src/db/connection.ts'
import { entries, habits, habitTags, tags, users } from '../../src/db/schema.ts'

export default async function setup() {
  console.log('🗄️ Setting up test database...')

  try {
    await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${habitTags} CASCADE`)

    console.log('🚀 Pushing schema using drizzle-kit...')
    execSync(
      `pnpm drizzle-kit push --url="${process.env.DATABASE_URL}" --schema="src/db/schema.ts" --dialect="postgresql"`,
      {
        stdio: 'inherit',
        cwd: process.cwd(),
      },
    )

    console.log('✅ Test database setup complete')
  } catch (error) {
    console.error('❌ Failed to setup test database', error)
    throw error
  }

  return async () => {
    console.log('🧹 Tearing down test database...')

    try {
      await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${habitTags} CASCADE`)

      console.log('✅ Test database teardown complete')
      process.exit(0)
    } catch (error) {
      console.error('❌ Failed to teardown test database:', error)
      throw error
    }
  }
}
