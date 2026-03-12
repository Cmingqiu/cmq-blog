import { openDb } from '@/server/db'
import { CommentRepo } from '@/server/repos/commentRepo'
import { AppError } from '@/lib/validation/errors'
import { auth } from '@/server/auth/auth'
import { createComment } from '@/server/comments/service'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const postId = url.searchParams.get('postId') || ''
  if (!postId) return Response.json({ ok: true, comments: [] })

  const db = openDb()
  const comments = new CommentRepo(db).listForPost(postId)
  return Response.json({ ok: true, comments })
}

export async function POST(req: Request) {
  const session = await auth()
  const body = (await req.json().catch(() => null)) as
    | { postId?: string; body?: unknown }
    | null

  if (!body?.postId) {
    return Response.json(
      { ok: false, error: { code: 'VALIDATION_REQUIRED_BODY', message: 'postId is required' } },
      { status: 400 },
    )
  }

  const db = openDb()
  try {
    const comment = createComment(db, {
      postId: body.postId,
      body: body.body,
      sessionUserEmail: session?.user?.email ?? null,
      sessionUserName: session?.user?.name ?? null,
      sessionUserImage: session?.user?.image ?? null,
    })
    return Response.json({ ok: true, comment })
  } catch (e) {
    if (e instanceof AppError) {
      return Response.json({ ok: false, error: e.toShape() }, { status: 400 })
    }
    return Response.json(
      { ok: false, error: { code: 'INTERNAL_ERROR', message: 'Internal error' } },
      { status: 500 },
    )
  }
}

