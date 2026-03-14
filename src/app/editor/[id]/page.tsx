import { notFound } from 'next/navigation'
import { openDb } from '@/server/db'
import { PostRepo } from '@/server/repos/postRepo'
import { Editor } from '@/components/editor/Editor'

export default async function EditEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const db = openDb()
  const post = new PostRepo(db).getById(id)
  if (!post) notFound()
  return (
    <Editor
      initialId={id}
      initialPost={{
        id: post.id,
        title: post.title,
        bodyMarkdown: post.bodyMarkdown,
        status: post.status,
      }}
    />
  )
}

