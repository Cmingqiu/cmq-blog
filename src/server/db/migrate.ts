import type Database from 'better-sqlite3'
import { SCHEMA_SQL, SCHEMA_VERSION } from './schema'

function nowIso() {
  return new Date().toISOString()
}

export function migrate(db: Database.Database) {
  db.exec(SCHEMA_SQL)

  const applied = db
    .prepare('SELECT version FROM migrations ORDER BY version DESC LIMIT 1')
    .get() as { version: number } | undefined

  const current = applied?.version ?? 0
  if (current === SCHEMA_VERSION) return

  if (current > SCHEMA_VERSION) {
    throw new Error(
      `Database schema version ${current} is newer than app schema ${SCHEMA_VERSION}`,
    )
  }

  db.prepare('INSERT INTO migrations (version, applied_at) VALUES (?, ?)').run(
    SCHEMA_VERSION,
    nowIso(),
  )
}

