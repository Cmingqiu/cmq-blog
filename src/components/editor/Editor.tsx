'use client'

import { useMemo, useState } from 'react'
import { MarkdownContent } from '@/lib/markdown/MarkdownContent'

type SaveResult =
  | { ok: true; post: { id: string; status: string } }
  | { ok: false; error: { message: string } }

export function Editor({ initialId }: { initialId?: string }) {
  const [title, setTitle] = useState('')
  const [bodyMarkdown, setBodyMarkdown] = useState('')
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [status, setStatus] = useState<string | null>(null)
  const [postId, setPostId] = useState<string | undefined>(initialId)

  const canPublish = useMemo(() => title.trim().length > 0 && bodyMarkdown.trim().length > 0, [title, bodyMarkdown])

  async function save(action: 'draft' | 'publish') {
    setStatus(action === 'draft' ? '保存中...' : '发布中...')
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
  }

  return (
    <main>
      <h1>写作</h1>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button type="button" onClick={() => setMode('edit')} disabled={mode === 'edit'}>
          编辑
        </button>
        <button type="button" onClick={() => setMode('preview')} disabled={mode === 'preview'}>
          预览
        </button>
        <button type="button" onClick={() => save('draft')}>
          保存草稿
        </button>
        <button type="button" onClick={() => save('publish')} disabled={!canPublish}>
          发布
        </button>
        {status ? <span>{status}</span> : null}
      </div>

      <div style={{ marginTop: 12 }}>
        <input
          placeholder="标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', padding: 8 }}
        />
      </div>

      {mode === 'edit' ? (
        <textarea
          value={bodyMarkdown}
          onChange={(e) => setBodyMarkdown(e.target.value)}
          placeholder="Markdown 正文"
          style={{ width: '100%', height: 320, marginTop: 12, padding: 8 }}
        />
      ) : (
        <div style={{ marginTop: 12 }}>
          <MarkdownContent markdown={bodyMarkdown} />
        </div>
      )}
    </main>
  )
}

