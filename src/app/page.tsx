import Link from 'next/link'
import { openDb } from '@/server/db'
import { PostRepo } from '@/server/repos/postRepo'
import { TagRepo } from '@/server/repos/tagRepo'
import { SearchService } from '@/server/search/searchService'
import { SearchBox } from '@/components/search/SearchBox'
import { TagFilter } from '@/components/tags/TagFilter'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

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
    <main>
      <h1>CMQ Blog</h1>
      <p>
        <Link href="/editor/new">写文章</Link>
      </p>
      <ThemeToggle />
      <SearchBox />
      <div style={{ marginTop: 12 }}>
        <TagFilter tags={tagNames} />
      </div>
      <ul>
        {posts.length === 0 ? (
          <li>无结果</li>
        ) : (
          posts.map((p) => (
            <li key={p.id}>
              <Link href={`/posts/${p.id}`}>{p.title || '(无标题)'}</Link>
            </li>
          ))
        )}
      </ul>
    </main>
  )
}

