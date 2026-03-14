'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { TocItem } from '@/lib/markdown/toc'

export function ArticleToc({
  items,
  activeId,
  className,
}: {
  items: TocItem[]
  activeId?: string | null
  className?: string
}) {
  if (items.length === 0) return null

  return (
    <nav
      aria-label="文章目录"
      className={cn('space-y-1 overflow-y-auto', className)}
    >
      <ul className="space-y-0.5 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: (item.level - 1) * 0.75 + 'rem' }}
          >
            <a
              href={item.href}
              className={cn(
                'block rounded-md py-1 pr-2 transition-colors hover:bg-muted',
                activeId === item.id && 'font-medium text-foreground',
                activeId !== item.id && 'text-muted-foreground',
              )}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(item.id)?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                })
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
