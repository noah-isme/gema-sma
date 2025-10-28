import type { Prisma, QuizQuestionType } from '@prisma/client'
import { clampPoints } from './utils'

export interface GradePayload {
  score: number
  maxScore: number
  isCorrect: boolean | null
  requiresManual: boolean
}

type QuestionForGrading = {
  id: string
  type: QuizQuestionType
  points: number | null
  correctAnswers: Prisma.JsonValue | null
}

function normalizeString(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim().toLowerCase()
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value.toString()
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }

  return ''
}

function asArray(value: Prisma.JsonValue | null | undefined): unknown[] {
  if (Array.isArray(value)) {
    return value
  }

  if (!value) {
    return []
  }

  if (typeof value === 'object' && 'values' in value && Array.isArray((value as Record<string, unknown>).values)) {
    return (value as { values: unknown[] }).values
  }

  return [value]
}

function extractTolerance(value: Prisma.JsonValue | null | undefined): number | null {
  if (!value) {
    return null
  }

  const inspect = (candidate: unknown): number | null => {
    if (candidate && typeof candidate === 'object' && 'tolerance' in candidate) {
      const tolerance = (candidate as Record<string, unknown>).tolerance
      if (typeof tolerance === 'number' && Number.isFinite(tolerance)) {
        return tolerance
      }
    }
    return null
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      const tolerance = inspect(entry)
      if (tolerance !== null) {
        return tolerance
      }
    }
    return null
  }

  if (typeof value === 'object') {
    return inspect(value)
  }

  return null
}

export function gradeAnswer(
  question: QuestionForGrading,
  submittedAnswer: unknown,
  defaultPoints: number = 1
): GradePayload {
  const maxScore = clampPoints(question.points, defaultPoints)
  const answers = asArray(question.correctAnswers)

  if (answers.length === 0) {
    return {
      score: 0,
      maxScore,
      isCorrect: null,
      requiresManual: true
    }
  }

  switch (question.type) {
    case 'MULTIPLE_CHOICE': {
      const expected = normalizeString(answers[0])
      const actual = normalizeString(submittedAnswer)
      const isCorrect = Boolean(expected) && expected === actual
      return {
        score: isCorrect ? maxScore : 0,
        maxScore,
        isCorrect,
        requiresManual: false
      }
    }

    case 'TRUE_FALSE': {
      const expected = normalizeString(answers[0])
      const actual = normalizeString(submittedAnswer)
      const isCorrect = expected === actual && (expected === 'true' || expected === 'false')
      return {
        score: isCorrect ? maxScore : 0,
        maxScore,
        isCorrect,
        requiresManual: false
      }
    }

    case 'MULTI_SELECT': {
      if (!Array.isArray(submittedAnswer)) {
        return {
          score: 0,
          maxScore,
          isCorrect: false,
          requiresManual: false
        }
      }

      const expectedSet = new Set(answers.map(normalizeString).filter(Boolean))
      const actualSet = new Set(submittedAnswer.map(normalizeString).filter(Boolean))

      if (expectedSet.size === 0) {
        return {
          score: 0,
          maxScore,
          isCorrect: null,
          requiresManual: true
        }
      }

      const isCorrect = expectedSet.size === actualSet.size &&
        Array.from(expectedSet).every(value => actualSet.has(value))

      return {
        score: isCorrect ? maxScore : 0,
        maxScore,
        isCorrect,
        requiresManual: false
      }
    }

    case 'SHORT_ANSWER': {
      const actual = normalizeString(submittedAnswer)
      const acceptableAnswers = answers.map(normalizeString).filter(Boolean)

      if (!actual || acceptableAnswers.length === 0) {
        return {
          score: 0,
          maxScore,
          isCorrect: null,
          requiresManual: true
        }
      }

      const isCorrect = acceptableAnswers.includes(actual)

      return {
        score: isCorrect ? maxScore : 0,
        maxScore,
        isCorrect,
        requiresManual: !isCorrect
      }
    }

    case 'NUMERIC':
    case 'SCALE': {
      const raw = answers[0]
      const expectedRaw = typeof raw === 'object' && raw !== null && 'value' in raw
        ? Number((raw as Record<string, unknown>).value)
        : Number(raw)
      const actualRaw = Number(typeof submittedAnswer === 'string' ? submittedAnswer.trim() : submittedAnswer)

      if (!Number.isFinite(expectedRaw) || !Number.isFinite(actualRaw)) {
        return {
          score: 0,
          maxScore,
          isCorrect: null,
          requiresManual: true
        }
      }

      const tolerance = extractTolerance(question.correctAnswers) ?? 0
      const delta = Math.abs(expectedRaw - actualRaw)
      const isCorrect = delta <= tolerance

      return {
        score: isCorrect ? maxScore : 0,
        maxScore,
        isCorrect,
        requiresManual: false
      }
    }

    default:
      return {
        score: 0,
        maxScore,
        isCorrect: null,
        requiresManual: true
      }
  }
}
