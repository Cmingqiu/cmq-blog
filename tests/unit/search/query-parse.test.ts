import { describe, expect, it } from 'vitest'
import { normalizeQuery } from '@/server/search/query'

describe('search query parsing', () => {
  it('trims', () => {
    expect(normalizeQuery('  hi  ')).toBe('hi')
  })

  it('non-string -> empty', () => {
    expect(normalizeQuery(null)).toBe('')
  })
})

