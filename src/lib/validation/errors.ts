export type AppErrorCode =
  | 'VALIDATION_REQUIRED_TITLE'
  | 'VALIDATION_REQUIRED_BODY'
  | 'VALIDATION_REQUIRED_COMMENT'
  | 'AUTH_REQUIRED'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR'

export interface AppErrorShape {
  code: AppErrorCode
  message: string
  field?: string
}

export class AppError extends Error {
  public readonly code: AppErrorCode
  public readonly field?: string

  constructor(code: AppErrorCode, message: string, field?: string) {
    super(message)
    this.code = code
    this.field = field
  }

  toShape(): AppErrorShape {
    return { code: this.code, message: this.message, field: this.field }
  }
}

