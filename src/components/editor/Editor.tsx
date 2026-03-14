'use client'

import { useEffect, useMemo, useState } from 'react'
import { MarkdownContent } from '@/lib/markdown/MarkdownContent'
import { buildTocFromMarkdown } from '@/lib/markdown/toc'
import { MarkdownEditor } from '@/components/MarkdownEditor'
import { ArticleToc } from '@/components/ArticleToc'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type SaveResult =
  | { ok: true; post: { id: string; status: string } }
  | { ok: false; error: { message: string } }

export function Editor({
  initialId,
  initialPost,
}: {
  initialId?: string
  initialPost?: { id: string; title: string; bodyMarkdown: string; status: string }
}) {
  const [title, setTitle] = useState(initialPost?.title ?? '')
  const [bodyMarkdown, setBodyMarkdown] = useState(initialPost?.bodyMarkdown ?? '')
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [status, setStatus] = useState<string | null>(null)
  const [postId, setPostId] = useState<string | undefined>(initialId ?? initialPost?.id)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title)
      setBodyMarkdown(initialPost.bodyMarkdown)
      setPostId(initialPost.id)
    }
  }, [initialPost])

  const canPublish = useMemo(
    () => title.trim().length > 0 && bodyMarkdown.trim().length > 0,
    [title, bodyMarkdown],
  )
  const tocItems = useMemo(() => buildTocFromMarkdown(bodyMarkdown), [bodyMarkdown])
  const headingIds = useMemo(() => tocItems.map((t) => t.id), [tocItems])

  async function save(action: 'draft' | 'publish') {
    setStatus(action === 'draft' ? '保存中…' : '发布中…')
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: postId, action, title, bodyMarkdown }),
    })
    const json = (await res.json()) as SaveResult
    if (!json.ok) {
      setStatus(json.error.message || '操作失败')
      return
    }
    setPostId(json.post.id)
    setStatus(action === 'draft' ? '草稿已保存' : '发布成功')
    setDirty(false)
  }

  useEffect(() => {
    if (!dirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  return (
    <main id="main-content" className="container-page space-y-6">
      <div className="space-y-1">
        <h1 className="text-pretty text-2xl font-semibold tracking-tight">写作</h1>
        <p className="text-sm text-muted-foreground">
          预览与阅读页展示一致；发布前请填写标题与正文
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <div className="min-w-0 flex-1">
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setDirty(true)
              }}
              name="title"
              autoComplete="off"
              aria-label="文章标题"
              placeholder="标题…"
              className="text-base font-medium"
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button type="button" variant="secondary" onClick={() => save('draft')}>
              保存草稿
            </Button>
            <Button
              type="button"
              onClick={() => save('publish')}
              disabled={!canPublish}
            >
              发布
            </Button>
            {status ? (
              <span className="text-sm text-muted-foreground" aria-live="polite">
                {status}
              </span>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
            <div className="min-w-0 flex-1">
              <CardTitle className="sr-only">编辑</CardTitle>
              <div className="lg:hidden flex gap-2 mb-2">
                <Button
                  type="button"
                  variant={mode === 'edit' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMode('edit')}
                  aria-pressed={mode === 'edit'}
                >
                  编辑
                </Button>
                <Button
                  type="button"
                  variant={mode === 'preview' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMode('preview')}
                  aria-pressed={mode === 'preview'}
                >
                  预览
                </Button>
              </div>
              <div className={mode === 'preview' ? 'hidden lg:block' : 'block'}>
                <MarkdownEditor
                  value={bodyMarkdown}
                  onChange={(v) => {
                    setBodyMarkdown(v)
                    setDirty(true)
                  }}
                  height={360}
                />
              </div>
              {mode === 'preview' && (
                <div className="lg:hidden rounded-lg border bg-muted/30 p-4 min-h-[360px]">
                  <MarkdownContent markdown={bodyMarkdown} />
                </div>
              )}
            </div>
            <div className="hidden lg:flex lg:w-full lg:min-w-0 lg:flex-1 lg:max-w-xl lg:gap-3">
              <div className="min-w-0 flex-1 rounded-lg border bg-muted/30 p-4 min-h-[360px] overflow-auto [&_h1,h2,h3,h4,h5,h6]:scroll-mt-24">
                <p className="text-xs font-medium text-muted-foreground mb-2">预览</p>
                <MarkdownContent markdown={bodyMarkdown} headingIds={headingIds} />
              </div>
              {tocItems.length > 0 && (
                <div className="w-40 shrink-0 overflow-y-auto">
                  <p className="text-xs font-medium text-muted-foreground mb-1">目录</p>
                  <ArticleToc items={tocItems} className="text-xs" />
                </div>
              )}
            </div>
            {mode === 'preview' && (
              <div className="lg:hidden rounded-lg border bg-muted/30 p-4">
                <MarkdownContent markdown={bodyMarkdown} headingIds={headingIds} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
