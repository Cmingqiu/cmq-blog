/**
 * TOC（目录）类型与生成（002-article-toc-editor）
 */

export interface TocItem {
  id: string
  text: string
  level: number
  href: string
  index: number
}

/** 从标题文本生成锚点 id（仅保留安全字符） */
function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'section'
}

/**
 * 从 Markdown 字符串解析 H1–H6 标题，生成目录项列表
 */
export function buildTocFromMarkdown(markdown: string): TocItem[] {
  const items: TocItem[] = []
  const lines = markdown.split(/\r?\n/)
  const seen = new Map<string, number>()
  let index = 0
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/)
    if (!match) continue
    const level = match[1].length
    let rawText = match[2].replace(/\s*\{#.*\}$/, '').replace(/\s*#+$/, '').trim()
    const baseId = slugifyHeading(rawText)
    let count = seen.get(baseId) ?? 0
    seen.set(baseId, count + 1)
    const id = count === 0 ? baseId : `${baseId}-${count}`
    items.push({
      id,
      text: rawText,
      level,
      href: `#${id}`,
      index: index++,
    })
  }
  return items
}
