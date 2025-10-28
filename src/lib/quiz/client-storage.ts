export type StoredParticipantSession = {
  participantId: string
  displayName: string
  sessionId: string
  studentId?: string | null
  joinedAt: string
}

const STORAGE_PREFIX = 'quiz.participant:'

function storageKey(code: string): string {
  return `${STORAGE_PREFIX}${code.toUpperCase()}`
}

export function saveParticipantSession(code: string, data: StoredParticipantSession): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    sessionStorage.setItem(storageKey(code), JSON.stringify(data))
  } catch (error) {
    console.warn('Unable to persist participant session', error)
  }
}

export function readParticipantSession(code: string): StoredParticipantSession | null {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = sessionStorage.getItem(storageKey(code))
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as StoredParticipantSession
    if (parsed?.participantId && parsed?.sessionId) {
      return parsed
    }
  } catch (error) {
    console.warn('Failed to parse stored participant session', error)
  }

  return null
}

export function clearParticipantSession(code: string): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    sessionStorage.removeItem(storageKey(code))
  } catch {
    // ignore
  }
}
