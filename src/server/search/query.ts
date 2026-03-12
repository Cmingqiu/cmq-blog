export function normalizeQuery(q: unknown) {
  if (typeof q !== 'string') return ''
  return q.trim()
}

export function normalizeTag(tag: unknown) {
  if (typeof tag !== 'string') return ''
  return tag.trim()
}

