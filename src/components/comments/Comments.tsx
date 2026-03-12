'use client'

import { useEffect, useState } from 'react'
import { SignInButtons } from '@/components/auth/SignInButtons'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
    setStatus('提交中…')
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
    <section className="mt-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">评论</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignInButtons />
          <div className="space-y-2">
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              name="comment"
              autoComplete="off"
              aria-label="评论内容"
              placeholder="写下你的评论（需登录）…"
              className="min-h-[96px]"
            />
            <div className="flex items-center gap-2">
              <Button type="button" onClick={submit}>
                发表评论
              </Button>
              {status ? (
                <span className="text-sm text-muted-foreground" aria-live="polite">
                  {status}
                </span>
              ) : null}
            </div>
          </div>

          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">暂无评论</p>
          ) : (
            <ul className="space-y-3">
              {comments.map((c) => (
                <li key={c.id} className="rounded-lg border bg-card p-3">
                  <div className="break-words text-sm">{c.body}</div>
                  <div className="mt-2 text-xs text-muted-foreground">{c.createdAt}</div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

