'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

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
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" onClick={() => setTag('')} disabled={!current}>
        全部
      </Button>
      {tags.map((t) => (
        <Button
          key={t}
          type="button"
          variant={current === t ? 'default' : 'outline'}
          onClick={() => setTag(t)}
          aria-pressed={current === t}
        >
          {t}
        </Button>
      ))}
    </div>
  )
}

