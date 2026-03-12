import { requireNonEmptyString } from '@/lib/validation/strings'

export function validatePublishInput(input: { title: unknown; bodyMarkdown: unknown }) {
  const title = requireNonEmptyString(input.title, 'VALIDATION_REQUIRED_TITLE', 'title').trim()
  const bodyMarkdown = requireNonEmptyString(input.bodyMarkdown, 'VALIDATION_REQUIRED_BODY', 'bodyMarkdown')
  return { title, bodyMarkdown }
}

