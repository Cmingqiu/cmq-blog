'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function SignInButtons() {
  const { data: session, status } = useSession()

  if (status === 'loading') return null

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <span className="min-w-0 truncate text-sm text-muted-foreground">
          {session.user?.name || session.user?.email}
        </span>
        <Button type="button" variant="outline" onClick={() => signOut()}>
          退出
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" onClick={() => signIn('github')}>
        GitHub 登录
      </Button>
      <Button type="button" variant="outline" onClick={() => signIn('google')}>
        Google 登录
      </Button>
    </div>
  )
}

