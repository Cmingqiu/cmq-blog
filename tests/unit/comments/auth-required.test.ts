import { describe, expect, it } from 'vitest'
import Database from 'better-sqlite3'
import { migrate } from '@/server/db/migrate'
import { createComment } from '@/server/comments/service'
import { AppError } from '@/lib/validation/errors'

describe('comment auth required', () => {
  it('rejects when no session user', () => {
    const db = new Database(':memory:')
    migrate(db)
    expect(() =>
      createComment(db, { postId: 'p1', body: 'hi', sessionUserEmail: null }),
    ).toThrowError(AppError)
  })
})

