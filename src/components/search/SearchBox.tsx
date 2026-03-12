'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function SearchBox() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') || '')

  function submit() {
    const params = new URLSearchParams(searchParams.toString())
    if (q.trim()) params.set('q', q.trim())
    else params.delete('q')
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex gap-2">
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        name="q"
        autoComplete="off"
        aria-label="搜索文章"
        placeholder="搜索文章…"
      />
      <Button type="button" variant="secondary" onClick={submit}>
        搜索
      </Button>
    </div>
  )
}

