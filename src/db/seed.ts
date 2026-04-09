import { db } from './connection.ts'
import { entries, habits, habitTags, tags, users } from './schema.ts'

export const seed = async () => {
  console.log('🌱 Starting database seed...')

  try {
    console.log('Clearing existing data...')
    await db.delete(users)
    await db.delete(habits)
    await db.delete(tags)
    await db.delete(entries)
    await db.delete(habitTags)

    console.log('Creating demo users...')
    const [demoUser] = await db
      .insert(users)
      .values({
        email: 'demo@app.com',
        password: 'password',
        firstName: 'demo',
        lastName: 'person',
        username: 'demo',
      })
      .returning()

    console.log('Creating tags...')
    const [healthTag] = await db
      .insert(tags)
      .values({ name: 'Health', color: '#f0f0f0' })
      .returning()

    console.log('Creating habits...')
    const [exerciseHabit] = await db
      .insert(habits)
      .values({
        userId: demoUser.id,
        name: 'Exercise',
        description: 'Daily workout',
        frequency: 'daily',
        targetCounts: 1,
      })
      .returning()

    await db.insert(habitTags).values({ habitId: exerciseHabit.id, tagId: healthTag.id })

    console.log('Adding completion entries...')
    const today = new Date()
    today.setHours(12, 0, 0, 0)

    for (let i = 0; i < 7; i += 1) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      await db.insert(entries).values({
        habitId: exerciseHabit.id,
        completionDate: date,
      })
    }

    console.log('✅ DB seeded successfully')
    console.log('User credentials:')
    console.log(`email: ${demoUser.email}`)
    console.log(`username: ${demoUser.username}`)
    console.log(`password: ${demoUser.password}`)
  } catch (error) {
    console.error('❌ seed failed', error)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) seed().then(() => process.exit(0))
