'use client'

import React, { useMemo, useRef } from 'react'
import Markdown, { defaultUrlTransform } from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function MarkdownContent({
  markdown,
  headingIds,
}: {
  markdown: string
  /** 与 buildTocFromMarkdown 顺序一致，用于注入 h1–h6 的 id 以配合目录锚点 */
  headingIds?: string[]
}) {
  const indexRef = useRef(0)
  const components = useMemo(() => {
    if (!headingIds?.length) return undefined
    const nextId = () => headingIds[indexRef.current++] ?? undefined
    const wrap =
      (Tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') =>
      ({ children, ...props }: React.ComponentProps<typeof Tag>) => {
        const id = nextId()
        return React.createElement(Tag, { ...props, id }, children)
      }
    return {
      h1: wrap('h1'),
      h2: wrap('h2'),
      h3: wrap('h3'),
      h4: wrap('h4'),
      h5: wrap('h5'),
      h6: wrap('h6'),
    }
  }, [headingIds])

  React.useEffect(() => {
    indexRef.current = 0
  }, [markdown, headingIds])

  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      skipHtml
      urlTransform={defaultUrlTransform}
      components={components}
    >
      {markdown}
    </Markdown>
  )
}

