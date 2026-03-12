import Link from 'next/link'
import { openDb } from '@/server/db'
import { PostRepo } from '@/server/repos/postRepo'
import { TagRepo } from '@/server/repos/tagRepo'
import { SearchService } from '@/server/search/searchService'
import { SearchBox } from '@/components/search/SearchBox'
import { TagFilter } from '@/components/tags/TagFilter'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string }>
}) {
  const { q, tag } = await searchParams
  const db = openDb()
  const tagNames = new TagRepo(db).listAll().map((t) => t.name)
  const posts =
    q || tag ? new SearchService(db).search({ q, tag }) : new PostRepo(db).listPublished()

  return (
    <main id="main-content" className="container-page space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-pretty text-2xl font-semibold tracking-tight">
            CMQ Blog
          </h1>
          <p className="text-sm text-muted-foreground">
            Markdown 写作、标签分类、搜索、评论与主题切换
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="secondary">
            <Link href="/editor/new">写文章</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">发现内容</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchBox />
          <TagFilter tags={tagNames} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">最新文章</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">无结果</p>
          ) : (
            <ul className="divide-y">
              {posts.map((p) => (
                <li key={p.id} className="py-3">
                  <Link
                    href={`/posts/${p.id}`}
                    className="block min-w-0 truncate text-sm font-medium hover:underline"
                  >
                    {p.title || '(无标题)'}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

