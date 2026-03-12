'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

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
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="搜索"
        style={{ flex: 1, padding: 8 }}
      />
      <button type="button" onClick={submit}>
        搜索
      </button>
    </div>
  )
}

