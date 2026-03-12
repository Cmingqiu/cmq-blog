import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Providers } from '@/components/auth/Providers'
import { normalizeThemePreference } from '@/lib/theme/preference'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'CMQ Blog',
  description: 'Personal blog CMS',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const theme = normalizeThemePreference((await cookies()).get('theme')?.value)
  return (
    <html lang="zh-CN" data-theme={theme}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

