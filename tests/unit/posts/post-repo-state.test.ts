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
    expect(draft.slug).toBe(draft.id)

    const pub = repo.publish(draft.id, { title: 't2', bodyMarkdown: 'm2' })
    expect(pub.status).toBe('published')
    expect(pub.publishedAt).toBeTruthy()
    expect(pub.title).toBe('t2')
  })

  it('listPublished returns only published posts', () => {
    const db = new Database(':memory:')
    migrate(db)
    const repo = new PostRepo(db)
    repo.createDraft({ title: 'd', bodyMarkdown: 'x' })
    const pub = repo.createDraft({ title: 'p', bodyMarkdown: 'y' })
    repo.publish(pub.id, { title: 'p', bodyMarkdown: 'y' })
    const list = repo.listPublished()
    expect(list).toHaveLength(1)
    expect(list[0].title).toBe('p')
    expect(list[0].status).toBe('published')
  })

  it('getBySlugOrId finds by id and by slug', () => {
    const db = new Database(':memory:')
    migrate(db)
    const repo = new PostRepo(db)
    const draft = repo.createDraft({
      title: 'Hi',
      bodyMarkdown: 'x',
      slug: 'hello-world',
    })
    repo.publish(draft.id, { title: 'Hi', bodyMarkdown: 'x', slug: 'hello-world' })
    expect(repo.getBySlugOrId(draft.id)?.title).toBe('Hi')
    expect(repo.getBySlugOrId('hello-world')?.id).toBe(draft.id)
    expect(repo.getBySlugOrId('nonexistent')).toBeNull()
  })
})

