import Link from 'next/link'
import { MarkdownContent } from '@/lib/markdown/MarkdownContent'
import { openDb } from '@/server/db'
import { PostRepo } from '@/server/repos/postRepo'
import { Comments } from '@/components/comments/Comments'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ 'id-or-slug': string }>
}) {
  const { 'id-or-slug': id } = await params
  const db = openDb()
  const post = new PostRepo(db).getByIdOrThrow(id)

  return (
    <main id="main-content" className="container-page space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Button asChild variant="ghost">
          <Link href="/">返回首页</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-pretty text-xl">{post.title}</CardTitle>
        </CardHeader>
        <CardContent className="prose-md">
          <MarkdownContent markdown={post.bodyMarkdown} />
        </CardContent>
      </Card>

      <Comments postId={post.id} />
    </main>
  )
}

