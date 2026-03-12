'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function TagFilter({ tags }: { tags: string[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get('tag') || ''

  function setTag(tag: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (tag) params.set('tag', tag)
    else params.delete('tag')
    router.push(`/?${params.toString()}`)
  }

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <button type="button" onClick={() => setTag('')} disabled={!current}>
        全部
      </button>
      {tags.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setTag(t)}
          disabled={current === t}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

