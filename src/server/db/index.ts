import Database from 'better-sqlite3'
import { migrate } from './migrate'
import fs from 'node:fs'
import path from 'node:path'

function resolveSqlitePath() {
  return process.env.SQLITE_PATH?.trim() || './data/app.db'
}

export function openDb() {
  const dbPath = resolveSqlitePath()
  const dir = path.dirname(dbPath)
  if (dir && dir !== '.' && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  const db = new Database(dbPath)

  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  migrate(db)
  return db
}

