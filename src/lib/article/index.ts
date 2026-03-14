import { openDb } from '@/server/db'
import { PostRepo } from '@/server/repos/postRepo'
import type { Post } from '@/server/domain/types'

/** 文章领域模型（与 Post 一致，用于阅读/写作页） */
export type Article = Post

/** 按 slug 或 id 查询已发布文章，仅返回 status='published' */
export function getPublishedArticleBySlugOrId(
  slugOrId: string,
): Article | null {
  const db = openDb()
  const post = new PostRepo(db).getBySlugOrId(slugOrId)
  if (!post || post.status !== 'published') return null
  return post
}

/** 已发布文章列表，按发布时间倒序 */
export function listPublishedArticles(): Article[] {
  const db = openDb()
  return new PostRepo(db).listPublished()
}
