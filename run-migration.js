import { openDb } from './src/server/db/index.js'
try {
  const db = openDb()
  console.log('Migration successful')
  process.exit(0)
} catch (e) {
  console.error('Migration failed:', e)
  process.exit(1)
}
