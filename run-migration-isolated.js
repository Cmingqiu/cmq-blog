import Database from 'better-sqlite3';
import { resolve } from 'path';

const dbPath = './data/app.db';
const db = new Database(dbPath);

console.log('Checking database version...');
db.exec(`
  CREATE TABLE IF NOT EXISTS migrations (
    version INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL
  );
`);

const row = db.prepare('SELECT version FROM migrations ORDER BY version DESC LIMIT 1').get();
const current = row ? row.version : 0;
console.log(`Current version: ${current}`);

if (current < 3) {
  console.log('Migrating to version 3 (adding slug)...');
  db.transaction(() => {
    try {
      db.exec('ALTER TABLE posts ADD COLUMN slug TEXT;');
      console.log('Added slug column.');
    } catch (e) {
      console.log('Slug column might already exist, skipping ALTER.');
    }
    db.exec('UPDATE posts SET slug = id WHERE slug IS NULL;');
    db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug) WHERE slug IS NOT NULL;');
    db.prepare('INSERT INTO migrations (version, applied_at) VALUES (?, ?)').run(3, new Date().toISOString());
  })();
  console.log('Migration to version 3 complete.');
} else {
  console.log('Already at version 3 or higher.');
}
db.close();
