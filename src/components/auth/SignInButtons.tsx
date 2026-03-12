'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

export function SignInButtons() {
  const { data: session, status } = useSession()

  if (status === 'loading') return null

  if (session) {
    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span>{session.user?.name || session.user?.email}</span>
        <button type="button" onClick={() => signOut()}>
          退出
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button type="button" onClick={() => signIn('github')}>
        GitHub 登录
      </button>
      <button type="button" onClick={() => signIn('google')}>
        Google 登录
      </button>
    </div>
  )
}

