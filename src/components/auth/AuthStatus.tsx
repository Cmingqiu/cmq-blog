'use client'

import * as React from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { LogOut, FileText } from 'lucide-react'

interface AuthStatusProps {
  session: {
    user?: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  } | null
}

export function AuthStatus({ session }: AuthStatusProps) {
  if (!session) {
    return (
      <Button asChild variant="ghost" size="sm" className="font-medium">
        <Link href="/api/auth/signin">登录</Link>
      </Button>
    )
  }

  const user = session.user
  const avatarUrl = user?.image
  const initials = user?.name?.slice(0, 2).toUpperCase() || 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="relative h-9 w-9 rounded-full border border-border bg-muted overflow-hidden hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1"
        >
          {avatarUrl ? (
            <Image src={avatarUrl} alt={user?.name || 'Avatar'} width={36} height={36} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-semibold">
              {initials}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <div className="flex items-center gap-2 px-2 py-1.5">
           <div className="flex flex-col space-y-0.5 text-left">
             <p className="text-sm font-medium leading-none">{user?.name}</p>
             <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
           </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/?filter=mine" className="flex w-full items-center">
            <FileText className="mr-2 h-4 w-4" />
            <span>我的文章</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive focus:text-destructive"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
