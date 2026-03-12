'use client'

import { useEffect, useMemo, useState } from 'react'
import { MarkdownContent } from '@/lib/markdown/MarkdownContent'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type SaveResult =
  | { ok: true; post: { id: string; status: string } }
  | { ok: false; error: { message: string } }

export function Editor({ initialId }: { initialId?: string }) {
  const [title, setTitle] = useState('')
  const [bodyMarkdown, setBodyMarkdown] = useState('')
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [status, setStatus] = useState<string | null>(null)
  const [postId, setPostId] = useState<string | undefined>(initialId)
  const [dirty, setDirty] = useState(false)

  const canPublish = useMemo(() => title.trim().length > 0 && bodyMarkdown.trim().length > 0, [title, bodyMarkdown])

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
          预览与发布展示保持一致；发布前请填写标题与正文
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">编辑器</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant={mode === 'edit' ? 'default' : 'outline'}
              onClick={() => setMode('edit')}
              aria-pressed={mode === 'edit'}
            >
              编辑
            </Button>
            <Button
              type="button"
              variant={mode === 'preview' ? 'default' : 'outline'}
              onClick={() => setMode('preview')}
              aria-pressed={mode === 'preview'}
            >
              预览
            </Button>

            <div className="ml-auto flex items-center gap-2">
              <Button type="button" variant="secondary" onClick={() => save('draft')}>
                保存草稿
              </Button>
              <Button type="button" onClick={() => save('publish')} disabled={!canPublish}>
                发布
              </Button>
            </div>

            {status ? (
              <span className="text-sm text-muted-foreground" aria-live="polite">
                {status}
              </span>
            ) : null}
          </div>

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
          />

          {mode === 'edit' ? (
            <Textarea
              value={bodyMarkdown}
              onChange={(e) => {
                setBodyMarkdown(e.target.value)
                setDirty(true)
              }}
              name="bodyMarkdown"
              autoComplete="off"
              aria-label="Markdown 正文"
              placeholder="Markdown 正文…"
              className="min-h-[320px]"
            />
          ) : (
            <div className="rounded-lg border bg-card p-4">
              <MarkdownContent markdown={bodyMarkdown} />
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

