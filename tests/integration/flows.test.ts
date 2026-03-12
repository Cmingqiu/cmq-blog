import { describe, expect, it } from 'vitest'
import Database from 'better-sqlite3'
import { migrate } from '@/server/db/migrate'
import { PostRepo } from '@/server/repos/postRepo'
import { CommentRepo } from '@/server/repos/commentRepo'
import { UserIdentityRepo } from '@/server/repos/userIdentityRepo'

describe('integration flows (db + repos)', () => {
  it('publish -> listed on home', () => {
    const db = new Database(':memory:')
    migrate(db)
    const posts = new PostRepo(db)

    const draft = posts.createDraft({ title: 't', bodyMarkdown: 'm' })
    posts.publish(draft.id, { title: 't', bodyMarkdown: 'm' })

    const list = posts.listPublished()
    expect(list.map((p) => p.id)).toContain(draft.id)
  })

  it('comment create -> visible in list', () => {
    const db = new Database(':memory:')
    migrate(db)

    db.prepare(
      `INSERT INTO posts (id, title, body_markdown, status, published_at, created_at, updated_at)
       VALUES ('p1', 't', 'm', 'published', '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z')`,
    ).run()

    const idRepo = new UserIdentityRepo(db)
    const identity = idRepo.upsert({
      provider: 'other',
      providerAccountId: 'a@b.com',
      displayName: 'a',
    })

    const comments = new CommentRepo(db)
    const c = comments.create({ postId: 'p1', authorIdentityId: identity.id, body: 'hi' })
    const list = comments.listForPost('p1')
    expect(list.map((x) => x.id)).toContain(c.id)
  })
})

