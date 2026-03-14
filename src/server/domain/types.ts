export type ISODateTimeString = string

export type PostStatus = 'draft' | 'published'
export type CommentStatus = 'published' | 'hidden'

export type IdentityProvider = 'github' | 'google' | 'other'

export interface Post {
  id: string
  title: string
  slug: string | null
  bodyMarkdown: string
  status: PostStatus
  publishedAt?: ISODateTimeString | null
  createdAt: ISODateTimeString
  updatedAt: ISODateTimeString
}

export interface Tag {
  id: string
  name: string
  createdAt: ISODateTimeString
}

export interface Comment {
  id: string
  postId: string
  authorIdentityId: string
  body: string
  status: CommentStatus
  createdAt: ISODateTimeString
}

export interface UserIdentity {
  id: string
  provider: IdentityProvider
  providerAccountId: string
  displayName?: string | null
  avatarUrl?: string | null
  createdAt: ISODateTimeString
}

