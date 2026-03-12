import { Editor } from '@/components/editor/Editor'

export default async function EditEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <Editor initialId={id} />
}

