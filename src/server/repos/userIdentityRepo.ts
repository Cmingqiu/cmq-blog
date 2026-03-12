import type Database from 'better-sqlite3'
import { newId } from '@/server/id'
import type { IdentityProvider, UserIdentity } from '@/server/domain/types'

function nowIso() {
  return new Date().toISOString()
}

type DbIdentityRow = {
  id: string
  provider: IdentityProvider
  provider_account_id: string
  display_name: string | null
  avatar_url: string | null
  created_at: string
}

function mapIdentity(row: DbIdentityRow): UserIdentity {
  return {
    id: row.id,
    provider: row.provider,
    providerAccountId: row.provider_account_id,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
  }
}

export class UserIdentityRepo {
  constructor(private readonly db: Database.Database) {}

  getByProviderAccount(provider: IdentityProvider, providerAccountId: string): UserIdentity | null {
    const row = this.db
      .prepare(
        `
        SELECT id, provider, provider_account_id, display_name, avatar_url, created_at
        FROM user_identities
        WHERE provider = ? AND provider_account_id = ?
        `,
      )
      .get(provider, providerAccountId) as DbIdentityRow | undefined
    return row ? mapIdentity(row) : null
  }

  upsert(input: {
    provider: IdentityProvider
    providerAccountId: string
    displayName?: string | null
    avatarUrl?: string | null
  }): UserIdentity {
    const existing = this.getByProviderAccount(input.provider, input.providerAccountId)
    if (existing) {
      this.db
        .prepare(
          `
          UPDATE user_identities
          SET display_name = ?, avatar_url = ?
          WHERE id = ?
          `,
        )
        .run(input.displayName ?? null, input.avatarUrl ?? null, existing.id)
      return {
        ...existing,
        displayName: input.displayName ?? null,
        avatarUrl: input.avatarUrl ?? null,
      }
    }

    const id = newId()
    const ts = nowIso()
    this.db
      .prepare(
        `
        INSERT INTO user_identities
          (id, provider, provider_account_id, display_name, avatar_url, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
      )
      .run(
        id,
        input.provider,
        input.providerAccountId,
        input.displayName ?? null,
        input.avatarUrl ?? null,
        ts,
      )
    return {
      id,
      provider: input.provider,
      providerAccountId: input.providerAccountId,
      displayName: input.displayName ?? null,
      avatarUrl: input.avatarUrl ?? null,
      createdAt: ts,
    }
  }
}

