'use client'

import { useEffect, useState } from 'react'
import { SignInButtons } from '@/components/auth/SignInButtons'

type Comment = {
  id: string
  body: string
  createdAt: string
}

export function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  async function load() {
    const res = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}`)
    const json = (await res.json()) as { ok: boolean; comments?: Comment[] }
    if (json.ok && json.comments) setComments(json.comments)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  async function submit() {
    setStatus('提交中...')
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ postId, body }),
    })
    const json = (await res.json()) as
      | { ok: true; comment: Comment }
      | { ok: false; error: { message: string } }
    if (!json.ok) {
      setStatus(json.error.message || '提交失败')
      return
    }
    setBody('')
    setStatus(null)
    await load()
  }

  return (
    <section style={{ marginTop: 24 }}>
      <h2>评论</h2>
      <SignInButtons />
      <div style={{ marginTop: 12 }}>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="写下你的评论（需登录）"
          style={{ width: '100%', height: 100, padding: 8 }}
        />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="button" onClick={submit}>
            发表评论
          </button>
          {status ? <span>{status}</span> : null}
        </div>
      </div>

      <ul style={{ marginTop: 12 }}>
        {comments.map((c) => (
          <li key={c.id}>
            <div>{c.body}</div>
            <small>{c.createdAt}</small>
          </li>
        ))}
      </ul>
    </section>
  )
}

