'use client'

import { useEffect, useState } from 'react'
import { normalizeThemePreference, serializeThemeCookie, type ThemePreference } from '@/lib/theme/preference'

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>('light')

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)theme=([^;]+)/)
    setTheme(normalizeThemePreference(match?.[1]))
  }, [])

  function toggle() {
    const next: ThemePreference = theme === 'dark' ? 'light' : 'dark'
    document.cookie = serializeThemeCookie(next)
    setTheme(next)
    window.location.reload()
  }

  return (
    <button type="button" onClick={toggle}>
      {theme === 'dark' ? '切换到明亮' : '切换到暗黑'}
    </button>
  )
}

