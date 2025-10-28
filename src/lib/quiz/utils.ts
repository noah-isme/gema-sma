import { randomInt } from 'node:crypto'

const CODE_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateSessionCode(length: number = 6): string {
  let code = ''
  for (let i = 0; i < length; i++) {
    code += CODE_CHARSET.charAt(randomInt(CODE_CHARSET.length))
  }
  return code
}

export function sanitizeText(value: unknown, maxLength: number = 4000): string {
  if (typeof value !== 'string') {
    return ''
  }

  const trimmed = value.trim().slice(0, maxLength)
  const withoutScripts = trimmed.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
  const withoutEventHandlers = withoutScripts.replace(/on\w+="[^"]*"/gi, '')

  return withoutEventHandlers
}

export function sanitizeDisplayName(value: unknown, maxLength: number = 80): string {
  const text = sanitizeText(value, maxLength)
  return text.replace(/[^A-Za-z0-9 _-]/g, '').trim()
}

export function clampPoints(points: number | null | undefined, fallback: number = 1): number {
  if (typeof points !== 'number' || Number.isNaN(points)) {
    return fallback
  }

  if (points < 0) {
    return 0
  }

  if (points > 1000) {
    return 1000
  }

  return points
}

export function normalizeJson<T>(value: unknown): T | undefined {
  if (value === undefined || value === null) {
    return undefined
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T
    } catch {
      return undefined
    }
  }

  if (typeof value === 'object') {
    return value as T
  }

  return undefined
}
