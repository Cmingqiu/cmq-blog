import { AppError } from '@/lib/validation/errors'
import { auth } from './auth'

export async function requireSession() {
  const session = await auth()
  if (!session) throw new AppError('AUTH_REQUIRED', 'Authentication required')
  return session
}

