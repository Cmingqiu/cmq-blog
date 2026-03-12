import type Database from 'better-sqlite3'
import { newId } from '@/server/id'
import type { Comment, CommentStatus } from '@/server/domain/types'

function nowIso() {
  return new Date().toISOString()
}

type DbCommentRow = {
  id: string
  post_id: string
  author_identity_id: string
  body: string
  status: CommentStatus
  created_at: string
}

function mapComment(row: DbCommentRow): Comment {
  return {
    id: row.id,
    postId: row.post_id,
    authorIdentityId: row.author_identity_id,
    body: row.body,
    status: row.status,
    createdAt: row.created_at,
  }
}

export class CommentRepo {
  constructor(private readonly db: Database.Database) {}

  create(input: {
    postId: string
    authorIdentityId: string
    body: string
    status?: CommentStatus
  }): Comment {
    const id = newId()
    const ts = nowIso()
    const status = input.status ?? 'published'
    this.db
      .prepare(
        `
        INSERT INTO comments (id, post_id, author_identity_id, body, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
      )
      .run(id, input.postId, input.authorIdentityId, input.body, status, ts)
    return this.getByIdOrThrow(id)
  }

  getById(id: string): Comment | null {
    const row = this.db
      .prepare(
        `
        SELECT id, post_id, author_identity_id, body, status, created_at
        FROM comments
        WHERE id = ?
        `,
      )
      .get(id) as DbCommentRow | undefined
    return row ? mapComment(row) : null
  }

  getByIdOrThrow(id: string): Comment {
    const c = this.getById(id)
    if (!c) throw new Error('Comment not found')
    return c
  }

  listForPost(postId: string): Comment[] {
    const rows = this.db
      .prepare(
        `
        SELECT id, post_id, author_identity_id, body, status, created_at
        FROM comments
        WHERE post_id = ? AND status = 'published'
        ORDER BY created_at ASC
        `,
      )
      .all(postId) as DbCommentRow[]
    return rows.map(mapComment)
  }
}

