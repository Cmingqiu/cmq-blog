import { describe, expect, it } from 'vitest'
import { normalizeThemePreference, serializeThemeCookie } from '@/lib/theme/preference'

describe('theme preference', () => {
  it('normalizes unknown to light', () => {
    expect(normalizeThemePreference('nope')).toBe('light')
  })

  it('accepts dark', () => {
    expect(normalizeThemePreference('dark')).toBe('dark')
  })

  it('serializes cookie', () => {
    expect(serializeThemeCookie('dark')).toContain('theme=dark')
  })
})

