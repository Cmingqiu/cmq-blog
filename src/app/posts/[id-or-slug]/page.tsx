import Link from 'next/link'
import { MarkdownContent } from '@/lib/markdown/MarkdownContent'
import { openDb } from '@/server/db'
import { PostRepo } from '@/server/repos/postRepo'
import { Comments } from '@/components/comments/Comments'

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ 'id-or-slug': string }>
}) {
  const { 'id-or-slug': id } = await params
  const db = openDb()
  const post = new PostRepo(db).getByIdOrThrow(id)

  return (
    <main>
      <p>
        <Link href="/">返回首页</Link>
      </p>
      <h1>{post.title}</h1>
      <MarkdownContent markdown={post.bodyMarkdown} />
      <Comments postId={post.id} />
    </main>
  )
}

