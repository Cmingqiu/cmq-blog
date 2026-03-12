import { describe, expect, it } from 'vitest'
import Database from 'better-sqlite3'
import { migrate } from '@/server/db/migrate'

describe('db migrate', () => {
  it('applies schema and records migration version', () => {
    const db = new Database(':memory:')
    migrate(db)

    const row = db
      .prepare('SELECT version FROM migrations ORDER BY version DESC LIMIT 1')
      .get() as { version: number } | undefined
    expect(row?.version).toBe(1)
  })
})

