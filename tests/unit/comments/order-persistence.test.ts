import { describe, expect, it } from 'vitest'
import Database from 'better-sqlite3'
import { migrate } from '@/server/db/migrate'
import { CommentRepo } from '@/server/repos/commentRepo'

describe('comment ordering & persistence', () => {
  it('lists comments in created_at ascending', () => {
    const db = new Database(':memory:')
    migrate(db)
    const repo = new CommentRepo(db)

    db.prepare(
      `INSERT INTO posts (id, title, body_markdown, status, published_at, created_at, updated_at)
       VALUES ('p1', 't', 'm', 'published', '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z')`,
    ).run()

    // Insert with explicit created_at to control order
    db.prepare(
      `INSERT INTO user_identities (id, provider, provider_account_id, created_at)
       VALUES ('u1', 'other', 'x', '2026-01-01T00:00:00.000Z')`,
    ).run()

    db.prepare(
      `INSERT INTO comments (id, post_id, author_identity_id, body, status, created_at)
       VALUES ('c2', 'p1', 'u1', 'b', 'published', '2026-01-01T00:00:02.000Z')`,
    ).run()
    db.prepare(
      `INSERT INTO comments (id, post_id, author_identity_id, body, status, created_at)
       VALUES ('c1', 'p1', 'u1', 'a', 'published', '2026-01-01T00:00:01.000Z')`,
    ).run()

    const list = repo.listForPost('p1')
    expect(list.map((c) => c.id)).toEqual(['c1', 'c2'])
  })
})

