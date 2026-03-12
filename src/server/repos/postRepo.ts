import type Database from 'better-sqlite3'
import { newId } from '@/server/id'
import type { Post, PostStatus } from '@/server/domain/types'

function nowIso() {
  return new Date().toISOString()
}

type DbPostRow = {
  id: string
  title: string
  body_markdown: string
  status: PostStatus
  published_at: string | null
  created_at: string
  updated_at: string
}

function mapPost(row: DbPostRow): Post {
  return {
    id: row.id,
    title: row.title,
    bodyMarkdown: row.body_markdown,
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export class PostRepo {
  constructor(private readonly db: Database.Database) {}

  createDraft(input: { title: string; bodyMarkdown: string }): Post {
    const id = newId()
    const ts = nowIso()
    this.db
      .prepare(
        `
        INSERT INTO posts (id, title, body_markdown, status, published_at, created_at, updated_at)
        VALUES (?, ?, ?, 'draft', NULL, ?, ?)
        `,
      )
      .run(id, input.title, input.bodyMarkdown, ts, ts)
    return this.getByIdOrThrow(id)
  }

  updateDraft(id: string, input: { title: string; bodyMarkdown: string }): Post {
    const ts = nowIso()
    const info = this.db
      .prepare(
        `
        UPDATE posts
        SET title = ?, body_markdown = ?, status = 'draft', updated_at = ?
        WHERE id = ?
        `,
      )
      .run(input.title, input.bodyMarkdown, ts, id)
    if (info.changes === 0) throw new Error('Post not found')
    return this.getByIdOrThrow(id)
  }

  publish(id: string, input: { title: string; bodyMarkdown: string }): Post {
    const ts = nowIso()
    const info = this.db
      .prepare(
        `
        UPDATE posts
        SET title = ?, body_markdown = ?, status = 'published', published_at = COALESCE(published_at, ?), updated_at = ?
        WHERE id = ?
        `,
      )
      .run(input.title, input.bodyMarkdown, ts, ts, id)
    if (info.changes === 0) throw new Error('Post not found')
    return this.getByIdOrThrow(id)
  }

  getById(id: string): Post | null {
    const row = this.db
      .prepare(
        `
        SELECT id, title, body_markdown, status, published_at, created_at, updated_at
        FROM posts
        WHERE id = ?
        `,
      )
      .get(id) as DbPostRow | undefined
    return row ? mapPost(row) : null
  }

  getByIdOrThrow(id: string): Post {
    const post = this.getById(id)
    if (!post) throw new Error('Post not found')
    return post
  }

  listPublished(): Post[] {
    const rows = this.db
      .prepare(
        `
        SELECT id, title, body_markdown, status, published_at, created_at, updated_at
        FROM posts
        WHERE status = 'published'
        ORDER BY published_at DESC, updated_at DESC
        `,
      )
      .all() as DbPostRow[]
    return rows.map(mapPost)
  }
}

