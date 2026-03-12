export function serializeSearchState(state: { q?: string; tag?: string }) {
  const params = new URLSearchParams()
  if (state.q) params.set('q', state.q)
  if (state.tag) params.set('tag', state.tag)
  const s = params.toString()
  return s ? `?${s}` : ''
}

