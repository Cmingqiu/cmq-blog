import { describe, expect, it } from 'vitest'
import { serializeSearchState } from '@/lib/search/state'

describe('search state serialization', () => {
  it('empty -> empty string', () => {
    expect(serializeSearchState({})).toBe('')
  })

  it('q only', () => {
    expect(serializeSearchState({ q: 'hi' })).toBe('?q=hi')
  })

  it('tag only', () => {
    expect(serializeSearchState({ tag: 't' })).toBe('?tag=t')
  })
})

