import type Database from 'better-sqlite3'
import { AppError } from '@/lib/validation/errors'
import { requireNonEmptyString } from '@/lib/validation/strings'
import { CommentRepo } from '@/server/repos/commentRepo'
import { UserIdentityRepo } from '@/server/repos/userIdentityRepo'

export function createComment(
  db: Database.Database,
  input: { postId: string; body: unknown; sessionUserEmail?: string | null; sessionUserName?: string | null; sessionUserImage?: string | null },
) {
  if (!input.sessionUserEmail) {
    throw new AppError('AUTH_REQUIRED', 'Authentication required')
  }

  const body = requireNonEmptyString(input.body, 'VALIDATION_REQUIRED_COMMENT', 'body').trim()

  const identityRepo = new UserIdentityRepo(db)
  const identity = identityRepo.upsert({
    provider: 'other',
    providerAccountId: input.sessionUserEmail,
    displayName: input.sessionUserName ?? input.sessionUserEmail,
    avatarUrl: input.sessionUserImage ?? null,
  })

  return new CommentRepo(db).create({
    postId: input.postId,
    authorIdentityId: identity.id,
    body,
  })
}

