'use client'

import React, { useEffect, useState } from 'react'
import { MarkdownContent } from '@/lib/markdown/MarkdownContent'
import { ArticleToc } from '@/components/ArticleToc'
import { Button } from '@/components/ui/button'
import type { TocItem } from '@/lib/markdown/toc'

const ROOT_MARGIN = '-80px 0% -60% 0%'

export function PostWithToc({
  markdown,
  tocItems,
}: {
  markdown: string
  tocItems: TocItem[]
}) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [mobileTocOpen, setMobileTocOpen] = useState(false)
  const headingIds = tocItems.map((t) => t.id)

  useEffect(() => {
    if (tocItems.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { root: null, rootMargin: ROOT_MARGIN, threshold: 0 },
    )
    const observed = new Set<Element>()
    const check = () => {
      tocItems.forEach((item) => {
        const el = document.getElementById(item.id)
        if (el && !observed.has(el)) {
          observed.add(el)
          observer.observe(el)
        }
      })
    }
    check()
    const t = requestAnimationFrame(check)
    const interval = window.setInterval(check, 500)
    return () => {
      cancelAnimationFrame(t)
      clearInterval(interval)
      observer.disconnect()
    }
  }, [tocItems])

  return (
    <>
      {tocItems.length > 0 && (
        <div className="lg:hidden border-b pb-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMobileTocOpen((o) => !o)}
            aria-expanded={mobileTocOpen}
            aria-controls="mobile-toc"
          >
            {mobileTocOpen ? '收起目录' : '目录'}
          </Button>
          {mobileTocOpen && (
            <div
              id="mobile-toc"
              className="mt-2 max-h-60 overflow-y-auto rounded-md border p-2"
            >
              <ArticleToc items={tocItems} activeId={activeId} />
            </div>
          )}
        </div>
      )}
      <div className="flex gap-6">
        <main className="min-w-0 flex-1">
          <article className="prose-md [&_h1,h2,h3,h4,h5,h6]:scroll-mt-24">
            <MarkdownContent markdown={markdown} headingIds={headingIds} />
          </article>
        </main>
        {tocItems.length > 0 && (
          <aside className="hidden w-52 shrink-0 lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-6rem)]">
              <ArticleToc items={tocItems} activeId={activeId} />
            </div>
          </aside>
        )}
      </div>
    </>
  )
}
