'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { normalizeThemePreference, serializeThemeCookie, type ThemePreference } from '@/lib/theme/preference'
import { Button } from '@/components/ui/button'

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
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggle}
      aria-label={theme === 'dark' ? '切换到明亮主题' : '切换到暗黑主题'}
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}

