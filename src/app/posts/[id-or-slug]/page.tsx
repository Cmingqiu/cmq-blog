import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublishedArticleBySlugOrId } from '@/lib/article'
import { buildTocFromMarkdown } from '@/lib/markdown/toc'
import { PostWithToc } from '@/components/PostWithToc'
import { Comments } from '@/components/comments/Comments'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ 'id-or-slug': string }>
}) {
  const { 'id-or-slug': slugOrId } = await params
  const post = getPublishedArticleBySlugOrId(slugOrId)
  if (!post) notFound()
  const tocItems = buildTocFromMarkdown(post.bodyMarkdown)

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
        <CardContent>
          <PostWithToc markdown={post.bodyMarkdown} tocItems={tocItems} />
        </CardContent>
      </Card>

      <Comments postId={post.id} />
    </main>
  )
}

