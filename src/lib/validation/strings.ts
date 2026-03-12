import { AppError, type AppErrorCode } from './errors'

export function requireNonEmptyString(
  value: unknown,
  code: AppErrorCode,
  field: string,
) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new AppError(code, `${field} is required`, field)
  }
  return value
}

