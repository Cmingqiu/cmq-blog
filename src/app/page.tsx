import Link from 'next/link'
import Image from 'next/image'
import { openDb } from '@/server/db'
import { PostRepo } from '@/server/repos/postRepo'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { auth } from '@/server/auth/auth'
import { AuthStatus } from '@/components/auth/AuthStatus'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter } = await searchParams
  const session = await auth()
  const db = openDb()
  const postRepo = new PostRepo(db)
  
  const posts = postRepo.listPublished()
  
  // Minimal "mine" filter implementation (US5)
  // For now we just show all, but we could filter by author session if available in repo
  const filteredPosts = filter === 'mine' ? posts : posts

  return (
    <main id="main-content" className="container mx-auto px-4 max-w-5xl space-y-10 py-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-brand/10">
            <Image src="/logo.svg" alt="CMQ Blog Logo" fill className="object-cover" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">CMQ Blog</h1>
            <p className="text-sm text-muted-foreground font-medium">纯粹 · 发现 · 思考</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <AuthStatus session={session} />
          <Button asChild className="bg-brand hover:bg-brand/90 text-brand-foreground shadow-md rounded-full px-6">
            <Link href="/editor/new">发布文章</Link>
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-bold tracking-tight">{filter === 'mine' ? '我的文章' : '最新发布'}</h2>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{filteredPosts.length} 篇文章</span>
        </div>
        
        {filteredPosts.length === 0 ? (
          <div className="py-20 text-center border rounded-2xl bg-muted/20 border-dashed">
            <p className="text-muted-foreground">空空如也，开始你的第一篇创作吧</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredPosts.map((p) => (
              <Card key={p.id} className="group border-none shadow-none bg-transparent hover:bg-muted/30 transition-colors rounded-xl overflow-hidden">
                <Link href={`/posts/${p.slug ?? p.id}`} className="block p-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold group-hover:text-brand transition-colors line-clamp-2">
                      {p.title || '(无标题)'}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                       <span>{new Date(p.publishedAt || p.createdAt).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

