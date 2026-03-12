import { describe, expect, it } from 'vitest'
import { AppError } from '@/lib/validation/errors'
import { validatePublishInput } from '@/server/posts/validation'

describe('publish validation', () => {
  it('requires title', () => {
    expect(() =>
      validatePublishInput({ title: '   ', bodyMarkdown: 'x' }),
    ).toThrowError(AppError)
  })

  it('requires body', () => {
    expect(() => validatePublishInput({ title: 't', bodyMarkdown: '' })).toThrowError(
      AppError,
    )
  })

  it('trims title', () => {
    const out = validatePublishInput({ title: '  t  ', bodyMarkdown: 'x' })
    expect(out.title).toBe('t')
  })
})

