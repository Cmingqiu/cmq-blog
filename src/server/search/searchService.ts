import type Database from 'better-sqlite3'
import type { Post } from '@/server/domain/types'
import { normalizeQuery, normalizeTag } from './query'

type DbPostRow = {
  id: string
  title: string
  slug: string | null
  body_markdown: string
  status: 'draft' | 'published'
  published_at: string | null
  created_at: string
  updated_at: string
}

function mapPost(row: DbPostRow): Post {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    bodyMarkdown: row.body_markdown,
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export class SearchService {
  constructor(private readonly db: Database.Database) {}

  search(input: { q?: unknown; tag?: unknown }) {
    const q = normalizeQuery(input.q)
    const tag = normalizeTag(input.tag)

    const like = q ? `%${q}%` : null

    const rows = this.db
      .prepare(
        `
        SELECT p.id, p.title, p.slug, p.body_markdown, p.status, p.published_at, p.created_at, p.updated_at
        FROM posts p
        ${tag ? 'JOIN post_tags pt ON pt.post_id = p.id JOIN tags t ON t.id = pt.tag_id' : ''}
        WHERE p.status = 'published'
          ${like ? 'AND (p.title LIKE @like OR p.body_markdown LIKE @like)' : ''}
          ${tag ? 'AND t.name = @tag' : ''}
        ORDER BY p.published_at DESC, p.updated_at DESC
        `,
      )
      .all({ like, tag }) as DbPostRow[]

    return rows.map(mapPost)
  }
}

