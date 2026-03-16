import type Database from 'better-sqlite3'
import { newId } from '@/server/id'
import type { Post, PostStatus } from '@/server/domain/types'

function nowIso() {
  return new Date().toISOString()
}

type DbPostRow = {
  id: string
  title: string
  slug: string | null
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
    slug: row.slug ?? row.id,
    bodyMarkdown: row.body_markdown,
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export class PostRepo {
  constructor(private readonly db: Database.Database) {}

  createDraft(input: {
    title: string
    bodyMarkdown: string
    slug?: string | null
  }): Post {
    const id = newId()
    const ts = nowIso()
    const slug = input.slug ?? id
    this.db
      .prepare(
        `
        INSERT INTO posts (id, title, slug, body_markdown, status, published_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'draft', NULL, ?, ?)
        `,
      )
      .run(id, input.title, slug, input.bodyMarkdown, ts, ts)
    return this.getByIdOrThrow(id)
  }

  updateDraft(
    id: string,
    input: { title: string; bodyMarkdown: string; slug?: string | null },
  ): Post {
    const ts = nowIso()
    const slug = input.slug ?? undefined
    const stmt = slug != null
      ? this.db.prepare(
          `UPDATE posts SET title = ?, slug = ?, body_markdown = ?, status = 'draft', updated_at = ? WHERE id = ?`,
        )
      : this.db.prepare(
          `UPDATE posts SET title = ?, body_markdown = ?, status = 'draft', updated_at = ? WHERE id = ?`,
        )
    const args = slug != null
      ? [input.title, slug, input.bodyMarkdown, ts, id]
      : [input.title, input.bodyMarkdown, ts, id]
    const info = stmt.run(...args)
    if (info.changes === 0) throw new Error('Post not found')
    return this.getByIdOrThrow(id)
  }

  publish(
    id: string,
    input: { title: string; bodyMarkdown: string; slug?: string | null },
  ): Post {
    const ts = nowIso()
    const slug = input.slug ?? undefined
    const stmt = slug != null
      ? this.db.prepare(
          `UPDATE posts SET title = ?, slug = ?, body_markdown = ?, status = 'published', published_at = COALESCE(published_at, ?), updated_at = ? WHERE id = ?`,
        )
      : this.db.prepare(
          `UPDATE posts SET title = ?, body_markdown = ?, status = 'published', published_at = COALESCE(published_at, ?), updated_at = ? WHERE id = ?`,
        )
    const args = slug != null
      ? [input.title, slug, input.bodyMarkdown, ts, ts, id]
      : [input.title, input.bodyMarkdown, ts, ts, id]
    const info = stmt.run(...args)
    if (info.changes === 0) throw new Error('Post not found')
    return this.getByIdOrThrow(id)
  }

  getById(id: string): Post | null {
    const row = this.db
      .prepare(
        `
        SELECT id, title, slug, body_markdown, status, published_at, created_at, updated_at
        FROM posts WHERE id = ?
        `,
      )
      .get(id) as DbPostRow | undefined
    return row ? mapPost(row) : null
  }

  getBySlug(slug: string): Post | null {
    const row = this.db
      .prepare(
        `
        SELECT id, title, slug, body_markdown, status, published_at, created_at, updated_at
        FROM posts WHERE slug = ?
        `,
      )
      .get(slug) as DbPostRow | undefined
    return row ? mapPost(row) : null
  }

  getBySlugOrId(slugOrId: string): Post | null {
    return this.getBySlug(slugOrId) ?? this.getById(slugOrId)
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
        SELECT id, title, slug, body_markdown, status, published_at, created_at, updated_at
        FROM posts
        WHERE status = 'published'
        ORDER BY published_at DESC, updated_at DESC
        `,
      )
      .all() as DbPostRow[]
    return rows.map(mapPost)
  }
}

