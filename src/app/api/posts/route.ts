import { openDb } from '@/server/db'
import { PostRepo } from '@/server/repos/postRepo'
import { TagRepo } from '@/server/repos/tagRepo'
import { AppError } from '@/lib/validation/errors'
import { validatePublishInput } from '@/server/posts/validation'
import { requireSession } from '@/server/auth/guards'

export async function GET() {
  const db = openDb()
  const posts = new PostRepo(db).listPublished()
  return Response.json({ ok: true, posts })
}

export async function POST(req: Request) {
  await requireSession()

  const body = (await req.json().catch(() => null)) as
    | {
        id?: string
        action: 'draft' | 'publish'
        title?: string
        bodyMarkdown?: string
        tags?: string[]
      }
    | null

  if (!body) {
    return Response.json(
      { ok: false, error: { code: 'VALIDATION_REQUIRED_BODY', message: 'Invalid JSON' } },
      { status: 400 },
    )
  }

  const db = openDb()
  const postRepo = new PostRepo(db)
  const tagRepo = new TagRepo(db)

  try {
    if (body.action === 'draft') {
      const title = (body.title ?? '').toString()
      const bodyMarkdown = (body.bodyMarkdown ?? '').toString()
      const post = body.id
        ? postRepo.updateDraft(body.id, { title, bodyMarkdown })
        : postRepo.createDraft({ title, bodyMarkdown })
      if (Array.isArray(body.tags)) tagRepo.setPostTags(post.id, body.tags)
      return Response.json({ ok: true, post })
    }

    const input = validatePublishInput({
      title: body.title,
      bodyMarkdown: body.bodyMarkdown,
    })

    const post = body.id
      ? postRepo.publish(body.id, input)
      : postRepo.publish(postRepo.createDraft(input).id, input)
    if (Array.isArray(body.tags)) tagRepo.setPostTags(post.id, body.tags)
    return Response.json({ ok: true, post })
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

