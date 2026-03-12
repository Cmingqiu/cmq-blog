import type Database from 'better-sqlite3'
import { newId } from '@/server/id'
import type { Tag } from '@/server/domain/types'

function nowIso() {
  return new Date().toISOString()
}

type DbTagRow = {
  id: string
  name: string
  created_at: string
}

function mapTag(row: DbTagRow): Tag {
  return { id: row.id, name: row.name, createdAt: row.created_at }
}

export class TagRepo {
  constructor(private readonly db: Database.Database) {}

  getOrCreateByName(name: string): Tag {
    const existing = this.db
      .prepare('SELECT id, name, created_at FROM tags WHERE name = ?')
      .get(name) as DbTagRow | undefined
    if (existing) return mapTag(existing)

    const id = newId()
    const ts = nowIso()
    this.db
      .prepare('INSERT INTO tags (id, name, created_at) VALUES (?, ?, ?)')
      .run(id, name, ts)
    return { id, name, createdAt: ts }
  }

  listAll(): Tag[] {
    const rows = this.db
      .prepare('SELECT id, name, created_at FROM tags ORDER BY name ASC')
      .all() as DbTagRow[]
    return rows.map(mapTag)
  }

  setPostTags(postId: string, tagNames: string[]) {
    const tx = this.db.transaction(() => {
      this.db.prepare('DELETE FROM post_tags WHERE post_id = ?').run(postId)
      const insert = this.db.prepare(
        'INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)',
      )
      for (const raw of tagNames) {
        const name = raw.trim()
        if (!name) continue
        const tag = this.getOrCreateByName(name)
        insert.run(postId, tag.id)
      }
    })
    tx()
  }

  listTagsForPost(postId: string): Tag[] {
    const rows = this.db
      .prepare(
        `
        SELECT t.id, t.name, t.created_at
        FROM tags t
        JOIN post_tags pt ON pt.tag_id = t.id
        WHERE pt.post_id = ?
        ORDER BY t.name ASC
        `,
      )
      .all(postId) as DbTagRow[]
    return rows.map(mapTag)
  }
}

