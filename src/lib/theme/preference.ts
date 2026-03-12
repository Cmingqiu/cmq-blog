export type ThemePreference = 'light' | 'dark'

export const THEME_COOKIE_NAME = 'theme'

export function normalizeThemePreference(value: unknown): ThemePreference {
  return value === 'dark' ? 'dark' : 'light'
}

export function serializeThemeCookie(value: ThemePreference) {
  return `${THEME_COOKIE_NAME}=${value}; Path=/; SameSite=Lax`
}

