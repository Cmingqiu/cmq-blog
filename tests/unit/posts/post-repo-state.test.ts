import { describe, expect, it } from 'vitest'
import Database from 'better-sqlite3'
import { migrate } from '@/server/db/migrate'
import { PostRepo } from '@/server/repos/postRepo'

describe('post repo state transitions', () => {
  it('supports draft -> publish', () => {
    const db = new Database(':memory:')
    migrate(db)
    const repo = new PostRepo(db)

    const draft = repo.createDraft({ title: 't', bodyMarkdown: 'm' })
    expect(draft.status).toBe('draft')
    expect(draft.publishedAt).toBeNull()

    const pub = repo.publish(draft.id, { title: 't2', bodyMarkdown: 'm2' })
    expect(pub.status).toBe('published')
    expect(pub.publishedAt).toBeTruthy()
    expect(pub.title).toBe('t2')
  })
})

