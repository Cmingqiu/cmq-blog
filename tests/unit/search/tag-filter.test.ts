import { describe, expect, it } from 'vitest'
import { normalizeTag } from '@/server/search/query'

describe('tag filter composition', () => {
  it('trims', () => {
    expect(normalizeTag('  tag  ')).toBe('tag')
  })

  it('non-string -> empty', () => {
    expect(normalizeTag(undefined)).toBe('')
  })
})

