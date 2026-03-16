import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Providers } from '@/components/auth/Providers'
import { normalizeThemePreference } from '@/lib/theme/preference'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'CMQ Blog - 纯粹的个人博客',
  description: '一个专注于内容与体验的纯粹个人博客平台',
  icons: {
    icon: '/favicon.svg',
    apple: '/logo.svg',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const theme = normalizeThemePreference((await cookies()).get('theme')?.value)
  return (
    <html lang="zh-CN" className={theme === 'dark' ? 'dark' : undefined}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          跳转到主要内容
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

