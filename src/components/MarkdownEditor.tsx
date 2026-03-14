'use client'

import React, { useState, useEffect } from 'react'

type MDEditorComponent = React.ComponentType<{
  value: string
  onChange: (value?: string) => void
  height?: number | string
  visibleDragbar?: boolean
  preview?: 'live' | 'edit' | 'preview'
}>

export function MarkdownEditor({
  value,
  onChange,
  height = 360,
  className,
}: {
  value: string
  onChange: (value: string) => void
  height?: number | string
  className?: string
}) {
  const [MDEditor, setMDEditor] = useState<MDEditorComponent | null>(null)

  useEffect(() => {
    import('@uiw/react-md-editor').then((mod) => setMDEditor(() => mod.default))
  }, [])

  if (!MDEditor) {
    return (
      <div
        className={className}
        style={{ height: typeof height === 'number' ? height : undefined }}
      >
        <textarea
          className="w-full rounded-md border bg-background p-3 font-mono text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Markdown 正文…"
          aria-label="Markdown 正文"
          rows={16}
        />
      </div>
    )
  }

  return (
    <div className={className} data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(v) => onChange(v ?? '')}
        height={height}
        visibleDragbar={false}
        preview="edit"
      />
    </div>
  )
}
