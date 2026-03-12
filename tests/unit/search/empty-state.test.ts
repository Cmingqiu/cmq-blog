import { describe, expect, it } from 'vitest'

describe('empty result state', () => {
  it('is empty when list length is 0', () => {
    expect([].length === 0).toBe(true)
  })
})

