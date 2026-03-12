import React from 'react'
import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { MarkdownContent } from '@/lib/markdown/MarkdownContent'

describe('markdown render pipeline', () => {
  it('strips raw HTML when skipHtml is enabled', () => {
    const html = renderToStaticMarkup(
      <MarkdownContent markdown={'hello <script>alert(1)</script> world'} />,
    )
    expect(html).toContain('hello')
    expect(html).toContain('world')
    expect(html).not.toContain('<script>')
  })
})

