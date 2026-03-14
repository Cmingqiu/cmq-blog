import { describe, expect, it } from 'vitest'
import { buildTocFromMarkdown } from '@/lib/markdown/toc'

describe('buildTocFromMarkdown', () => {
  it('returns empty array for empty or no headings', () => {
    expect(buildTocFromMarkdown('')).toEqual([])
    expect(buildTocFromMarkdown('paragraph only')).toEqual([])
  })

  it('extracts single-level headings', () => {
    const md = '# One\n\n# Two'
    const toc = buildTocFromMarkdown(md)
    expect(toc).toHaveLength(2)
    expect(toc[0]).toMatchObject({ text: 'One', level: 1, index: 0 })
    expect(toc[0].id).toBe('one')
    expect(toc[0].href).toBe('#one')
    expect(toc[1]).toMatchObject({ text: 'Two', level: 1, index: 1 })
  })

  it('extracts multi-level headings', () => {
    const md = '# H1\n\n## H2\n\n### H3\n\n## H2 again'
    const toc = buildTocFromMarkdown(md)
    expect(toc).toHaveLength(4)
    expect(toc[0]).toMatchObject({ level: 1, text: 'H1' })
    expect(toc[1]).toMatchObject({ level: 2, text: 'H2' })
    expect(toc[2]).toMatchObject({ level: 3, text: 'H3' })
    expect(toc[3]).toMatchObject({ level: 2, text: 'H2 again' })
  })

  it('deduplicates id for same heading text', () => {
    const md = '# Same\n\n## Same'
    const toc = buildTocFromMarkdown(md)
    expect(toc[0].id).toBe('same')
    expect(toc[1].id).toBe('same-1')
    expect(toc[1].href).toBe('#same-1')
  })

  it('strips atx closing hashes and custom id suffix', () => {
    const md = '# Title ##\n\n## With {#custom}'
    const toc = buildTocFromMarkdown(md)
    expect(toc[0].text).toBe('Title')
    expect(toc[1].text).toBe('With')
  })
})
