'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { studentAuth } from '@/lib/student-auth'
import StudentLayout from '@/components/student/StudentLayout'
import Breadcrumb from '@/components/ui/Breadcrumb'
import PlayfulTourGuide, { TourStep } from '@/components/student/PlayfulTourGuide'
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Circle,
  Code2,
  Flame,
  Gauge,
  Laptop,
  MessageSquare,
  Play,
  PlayCircle,
  Sparkles,
  Timer
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type AssignmentDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
type SubmissionStatus = 'DRAFT' | 'SUBMITTED' | 'GRADED' | 'RETURNED'
type AssignmentState = 'late' | 'in_progress' | 'not_started' | 'completed'

interface AssignmentSubmission {
  id: string
  status: SubmissionStatus
  submittedAt: string | null
  gradedAt?: string | null
  grade?: number | null
  score?: number | null
  feedback?: string | null
}

interface Assignment {
  id: string
  title: string
  description: string
  difficulty: AssignmentDifficulty | string
  classLevel: string | null
  instructions: string
  starterHtml?: string
  starterCss?: string
  starterJs?: string
  template?: string
  requirements?: string[] | string | null
  hints?: string[] | string | null
  points: number
  timeLimit?: number | null
  status: string
  createdBy: string
  createdAt: string
  updatedAt: string
  submissions?: AssignmentSubmission[]
  _count?: {
    submissions: number
  }
}

interface AssignmentWithSubmission {
  assignment: Assignment
  submission?: AssignmentSubmission
}

const xpPerAssignment = 40

const statusOrder: AssignmentState[] = ['late', 'in_progress', 'not_started', 'completed']

const difficultyScoreMap: Record<AssignmentDifficulty, number> = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3
}

const difficultyDeadlineMap: Record<AssignmentDifficulty, number> = {
  BEGINNER: 4,
  INTERMEDIATE: 6,
  ADVANCED: 8
}

const difficultyMeta: Record<AssignmentDifficulty, { label: string; chipClass: string; gradient: string }> = {
  BEGINNER: {
    label: 'Pemula',
    chipClass:
      'chip-float border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-sm',
    gradient: 'from-emerald-400/25 via-emerald-100/40 to-transparent'
  },
  INTERMEDIATE: {
    label: 'Menengah',
    chipClass:
      'chip-float border border-amber-200 bg-amber-50 text-amber-700 shadow-sm',
    gradient: 'from-amber-300/20 via-amber-100/40 to-transparent'
  },
  ADVANCED: {
    label: 'Mahir',
    chipClass:
      'chip-float border border-rose-200 bg-rose-50 text-rose-700 shadow-sm',
    gradient: 'from-rose-400/20 via-rose-100/40 to-transparent'
  }
}

const statusChipMeta: Record<AssignmentState, { label: string; className: string; icon: LucideIcon }> = {
  late: {
    label: 'Terlambat',
    className: 'badge-pulse border border-rose-200 bg-rose-50 text-rose-700',
    icon: Flame
  },
  in_progress: {
    label: 'Dalam Proses',
    className: 'border border-sky-200 bg-sky-50 text-sky-700',
    icon: Timer
  },
  not_started: {
    label: 'Belum Dimulai',
    className: 'border border-slate-200 bg-slate-50 text-slate-600',
    icon: PlayCircle
  },
  completed: {
    label: 'Selesai',
    className: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
    icon: CheckCircle2
  }
}

const statusGroupMeta: Record<AssignmentState, { title: string; description: string; icon: LucideIcon; accent: string }> = {
  late: {
    title: '🔥 Terlambat',
    description: 'Butuh prioritas agar XP tidak hilang. Masuk lab sekarang!',
    icon: Flame,
    accent: 'from-rose-50 via-white to-amber-50'
  },
  in_progress: {
    title: '⏳ Dalam Proses',
    description: 'Sedang kamu garap. Jaga momentum coding-mu.',
    icon: Timer,
    accent: 'from-sky-50 via-white to-indigo-50'
  },
  not_started: {
    title: '🌱 Belum Dimulai',
    description: 'Mulai saat siap. Progress kecil tetap berarti.',
    icon: Sparkles,
    accent: 'from-emerald-50 via-white to-amber-50'
  },
  completed: {
    title: '🎉 Selesai',
    description: 'Sudah kamu taklukkan. Review feedback guru.',
    icon: CheckCircle2,
    accent: 'from-emerald-50 via-white to-cyan-50'
  }
}

const groupEmptyCopy: Record<AssignmentState, string> = {
  late: 'Tidak ada tugas terlambat. Pertahankan ritme ini! 🎯',
  in_progress: 'Belum ada tugas yang sedang berlangsung. Yuk mulai satu tugas.',
  not_started: 'Semua tugas sudah tersentuh. Ambil tantangan baru saat siap.',
  completed: 'Belum ada tugas selesai. Saatnya raih XP pertamamu!'
}

const taskIconMap = [
  { keywords: ['foto', 'galeri', 'gallery'], icon: '📸' },
  { keywords: ['form', 'kontak'], icon: '📝' },
  { keywords: ['profil', 'profile'], icon: '👤' },
  { keywords: ['portfolio', 'landing', 'website'], icon: '🌐' },
  { keywords: ['game'], icon: '🎮' },
  { keywords: ['blog', 'artikel'], icon: '✍️' }
]

const normalizeDifficulty = (difficulty: Assignment['difficulty']): AssignmentDifficulty => {
  if (difficulty === 'BEGINNER' || difficulty === 'INTERMEDIATE' || difficulty === 'ADVANCED') {
    return difficulty
  }

  const normalized = typeof difficulty === 'string' ? difficulty.toUpperCase() : ''

  if (normalized === 'BEGINNER' || normalized === 'INTERMEDIATE' || normalized === 'ADVANCED') {
    return normalized as AssignmentDifficulty
  }

  return 'INTERMEDIATE'
}

const parseArrayField = (value: Assignment['requirements']): string[] => {
  if (!value) return []
  if (Array.isArray(value)) return value as string[]

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.warn('Failed to parse array field', error)
      return []
    }
  }

  return []
}

const getTaskEmoji = (title: string) => {
  const lowerTitle = title.toLowerCase()
  const matched = taskIconMap.find(entry => entry.keywords.some(keyword => lowerTitle.includes(keyword)))
  return matched?.icon ?? '💡'
}

const getLatestSubmission = (assignment: Assignment): AssignmentSubmission | undefined => {
  if (!assignment.submissions || assignment.submissions.length === 0) {
    return undefined
  }

  return assignment.submissions.reduce<AssignmentSubmission>((latest, current) => {
    const latestTime = latest.submittedAt ? new Date(latest.submittedAt).getTime() : 0
    const currentTime = current.submittedAt ? new Date(current.submittedAt).getTime() : 0
    return currentTime > latestTime ? current : latest
  }, assignment.submissions[0])
}

const isAssignmentLate = (assignment: Assignment, submission?: AssignmentSubmission) => {
  if (submission?.status === 'GRADED') {
    return false
  }

  const difficulty = normalizeDifficulty(assignment.difficulty)
  const bufferDays = difficultyDeadlineMap[difficulty]
  const referenceDate = submission?.submittedAt
    ? new Date(submission.submittedAt)
    : new Date(assignment.createdAt)
  const dueDate = new Date(referenceDate)
  dueDate.setDate(dueDate.getDate() + bufferDays)

  const overdue = Date.now() > dueDate.getTime()

  if (!submission) {
    return overdue
  }

  if (submission.status === 'RETURNED') {
    return overdue
  }

  return false
}

const getAssignmentState = (assignment: Assignment, submission?: AssignmentSubmission): AssignmentState => {
  if (isAssignmentLate(assignment, submission)) {
    return 'late'
  }

  if (submission?.status === 'GRADED') {
    return 'completed'
  }

  if (submission) {
    return 'in_progress'
  }

  return 'not_started'
}

const useCountUp = (target: number, duration = 800) => {
  const [value, setValue] = useState(target)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setValue(target)
      return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion || duration <= 0) {
      setValue(target)
      return
    }

    let raf: number
    let start: number | null = null

    const step = (timestamp: number) => {
      if (start === null) start = timestamp

      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))

      if (progress < 1) {
        raf = requestAnimationFrame(step)
      }
    }

    setValue(0)
    raf = requestAnimationFrame(step)

    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return value
}

const AnimatedNumber = ({ value }: { value: number }) => {
  const animatedValue = useCountUp(value)
  const formatted = useMemo(() => new Intl.NumberFormat('id-ID').format(animatedValue), [animatedValue])

  return <span>{formatted}</span>
}

export default function StudentWebLabPage() {
  const router = useRouter()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAssignments = useCallback(async (studentId: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/student/web-lab?studentId=${studentId}`)
      if (!response.ok) {
        throw new Error('Gagal memuat daftar Web Lab')
      }

      const data = await response.json()
      setAssignments(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        const session = studentAuth.getSession()
        if (!session) {
          router.push('/student/login')
          return
        }

        fetchAssignments(session.studentId)
      } catch (authError) {
        console.error('Auth error:', authError)
        router.push('/student/login')
      }
    }

    checkAuthAndLoadData()
  }, [router, fetchAssignments])

  const derivedData = useMemo(() => {
    const buckets: Record<AssignmentState, AssignmentWithSubmission[]> = {
      late: [],
      in_progress: [],
      not_started: [],
      completed: []
    }

    const counts: Record<AssignmentState, number> = {
      late: 0,
      in_progress: 0,
      not_started: 0,
      completed: 0
    }

    let difficultyScoreTotal = 0

    assignments.forEach((assignment) => {
      const submission = getLatestSubmission(assignment)
      const state = getAssignmentState(assignment, submission)
      buckets[state].push({ assignment, submission })
      counts[state] += 1

      const normalizedDifficulty = normalizeDifficulty(assignment.difficulty)
      difficultyScoreTotal += difficultyScoreMap[normalizedDifficulty]
    })

    const totalAssignments = assignments.length
    const completedCount = counts.completed
    const xp = completedCount * xpPerAssignment
    const level = Math.max(1, Math.floor(xp / 100) + 1)
    const xpIntoLevel = xp % 100
    const xpProgress = Math.min(100, (xpIntoLevel / 100) * 100)
    const difficultyAverageScore = totalAssignments ? difficultyScoreTotal / totalAssignments : 0

    let difficultyAverageLabel = 'Belum Ada'
    if (difficultyAverageScore > 0 && difficultyAverageScore < 1.6) {
      difficultyAverageLabel = 'Pemula'
    } else if (difficultyAverageScore >= 1.6 && difficultyAverageScore < 2.3) {
      difficultyAverageLabel = 'Menengah'
    } else if (difficultyAverageScore >= 2.3) {
      difficultyAverageLabel = 'Mahir'
    }

    return {
      buckets,
      counts,
      stats: {
        totalAssignments,
        completedCount,
        inProgressCount: counts.in_progress,
        lateCount: counts.late,
        pendingCount: counts.not_started
      },
      xpStats: {
        level,
        xp,
        xpIntoLevel,
        xpProgress
      },
      difficultyAverageLabel,
      difficultyAverageScore
    }
  }, [assignments])

  const {
    buckets: groupedAssignments,
    counts: statusCounts,
    stats: summaryStats,
    xpStats,
    difficultyAverageLabel,
    difficultyAverageScore
  } = derivedData

  const breadcrumbItems = useMemo(
    () => [
      { label: 'Dashboard', href: '/student/dashboard-simple' },
      { label: 'Web Lab', href: '/student/web-lab' }
    ],
    []
  )

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-cyan-400 border-r-purple-400"></div>
          <div>
            <p className="text-lg font-semibold text-slate-800">Menyiapkan ruang Web Lab...</p>
            <p className="text-sm text-slate-500">Memuat daftar tugas interaktif untukmu</p>
          </div>
        </div>
      </StudentLayout>
    )
  }

  const statsCardData = [
    {
      key: 'completed',
      label: 'Selesai',
      value: summaryStats.completedCount,
      gradient: 'from-emerald-400/20 to-emerald-100/60',
      iconBg: 'bg-white/50 text-emerald-600',
      icon: CheckCircle2
    },
    {
      key: 'in_progress',
      label: 'Dalam Proses',
      value: summaryStats.inProgressCount,
      gradient: 'from-sky-400/20 to-indigo-100/60',
      iconBg: 'bg-white/50 text-sky-600',
      icon: Timer
    },
    {
      key: 'late',
      label: 'Terlambat',
      value: summaryStats.lateCount,
      gradient: 'from-rose-400/20 to-amber-100/60',
      iconBg: 'bg-white/50 text-rose-600',
      icon: AlertTriangle
    },
    {
      key: 'pending',
      label: 'Pending',
      value: summaryStats.pendingCount,
      gradient: 'from-amber-300/20 to-yellow-100/60',
      iconBg: 'bg-white/50 text-amber-600',
      icon: Sparkles
    },
    {
      key: 'difficulty',
      label: 'Difficulty Average',
      isTextValue: true,
      textValue: difficultyAverageLabel,
      subLabel:
        difficultyAverageScore > 0
          ? `Skor ${difficultyAverageScore.toFixed(1)}`
          : 'Belum ada tugas',
      gradient: 'from-indigo-400/20 to-purple-100/60',
      iconBg: 'bg-white/50 text-indigo-600',
      icon: Gauge
    }
  ]

const heroBadges = [
  {
    label: `${summaryStats.totalAssignments} misi aktif`,
    icon: BookOpen
  },
  {
    label: `${xpStats.xp} total XP`,
    icon: Sparkles
  }
]

const webLabTourSteps: TourStep[] = [
  {
    selector: '#weblab-hero',
    emoji: '💻',
    title: 'Ruang Web Lab kamu',
    subtitle: 'Mission control versi playful',
    text: 'Panel hero ini jelasin XP, level, dan badge terbaru supaya kamu tau progress coding kamu tiap kali masuk.'
  },
  {
    selector: '#weblab-stats',
    emoji: '📈',
    title: 'Stat detail tiap misi',
    subtitle: 'Pantau status tugas',
    text: 'Kartu angka ini ngebagi tugas jadi selesai, pending, dan terlambat biar kamu bisa atur energi.'
  },
  {
    selector: '#weblab-challenges',
    emoji: '🧪',
    title: 'Grid tantangan seru',
    subtitle: 'Checklist + XP langsung',
    text: 'Scroll bagian ini buat lihat progress HTML · CSS · JS, XP, checklist requirements, dan tombol lanjut ke editor.'
  },
  {
    selector: '#student-profile-button',
    emoji: '🎧',
    title: 'Avatar = portal pribadi',
    subtitle: 'Ganti preferensi kapan aja',
    text: 'Klik avatar kanan atas buat update data diri atau re-login. Biar ruang lab-nya tetap kerasa “punyamu”.'
  }
]

  return (
    <StudentLayout>
      <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex justify-end">
          <PlayfulTourGuide
            tourId="student-weblab"
            steps={webLabTourSteps}
            autoStartDelay={1200}
            renderTrigger={({ startTour, hasSeenTutorial, storageReady }) => (
              <button type="button" className="tour-trigger-chip" onClick={startTour}>
                {storageReady && hasSeenTutorial ? 'Replay tur Web Lab' : 'Butuh guide?'}
                <span aria-hidden>💬</span>
              </button>
            )}
          />
        </div>

        <section id="weblab-hero" className="lab-hero animate-lab-hero rounded-3xl border border-white/30 p-8 text-white shadow-brand-lg">
          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-wide text-white/80">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1">
                  <Sparkles className="h-4 w-4" />
                  Web Lab Mission Control
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1">
                  <Laptop className="h-4 w-4" />
                  Live Coding Space
                </span>
              </div>

              <div>
                <h1 className="text-3xl font-bold leading-tight md:text-4xl">Web Lab</h1>
                <p className="mt-3 text-base text-white/85 md:text-lg">
                  Bangun proyek coding interaktif dengan HTML, CSS, dan JavaScript ✨
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {heroBadges.map((badge) => {
                  const Icon = badge.icon
                  return (
                    <span
                      key={badge.label}
                      className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm text-white/90"
                    >
                      <Icon className="h-4 w-4" />
                      {badge.label}
                    </span>
                  )
                })}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-white/15 p-5">
                  <p className="text-xs uppercase tracking-wide text-white/70">Coding Level</p>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-4xl font-semibold">Lv {xpStats.level}</span>
                    <span className="text-sm text-white/80">XP {xpStats.xpIntoLevel}/100</span>
                  </div>
                  <div className="mt-4 h-2 w-full rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-200 via-sky-200 to-purple-200"
                      style={{ width: `${xpStats.xpProgress}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-xs text-white/70">+{xpPerAssignment} XP tiap tugas selesai</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-5">
                  <p className="text-xs uppercase tracking-wide text-white/70">Lab Mood</p>
                  <ul className="mt-3 space-y-2 text-sm text-white/85">
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-300"></span>
                      Real-time preview aktif
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-sky-300"></span>
                      XP boost tersedia
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-300"></span>
                      Tugas kreatif siap dikerjakan
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/15 p-6 text-slate-900 shadow-brand-md backdrop-blur">
              <div className="rounded-2xl bg-white/90 p-4 shadow-brand-sm">
                <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>HTML Canvas</span>
                  <span className="inline-flex items-center gap-1 text-emerald-500">
                    <Sparkles className="h-3 w-3" /> Live
                  </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-400"></div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Code2 className="h-4 w-4 text-cyan-500" />
                  <span>Editor & Preview sinkron</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm font-semibold text-slate-800">
                <div className="rounded-2xl bg-white/85 p-3 shadow-brand-sm">
                  <span className="text-2xl">{getTaskEmoji('Profil')}</span>
                  <p className="mt-1 text-xs text-slate-500">HTML dasar</p>
                </div>
                <div className="rounded-2xl bg-white/85 p-3 shadow-brand-sm">
                  <span className="text-2xl">{getTaskEmoji('Form')}</span>
                  <p className="mt-1 text-xs text-slate-500">JS interaktif</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="weblab-stats" className="lab-stats-panel rounded-3xl border border-cyan-100/60 bg-gradient-to-r from-cyan-50 via-white to-purple-50 p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {statsCardData.map((card, idx) => {
              const Icon = card.icon
              return (
                <div
                  key={card.key}
                  className="lab-stat-card relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-5"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.gradient} opacity-80`}></div>
                  <div className="relative flex items-center gap-4">
                    <span className={`lab-icon-tilt inline-flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg}`}>
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{card.label}</p>
                      {card.isTextValue ? (
                        <>
                          <p className="text-2xl font-semibold text-slate-900">{card.textValue}</p>
                          <p className="text-xs text-slate-500">{card.subLabel}</p>
                        </>
                      ) : (
                        <p className="text-3xl font-semibold text-slate-900">
                          <AnimatedNumber value={card.value ?? 0} />
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {assignments.length > 0 ? (
          <section id="weblab-challenges" className="space-y-10">
            {statusOrder.map((statusKey) => {
              const group = groupedAssignments[statusKey]
              const meta = statusGroupMeta[statusKey]
              const Icon = meta.icon

              return (
                <div key={statusKey} className="space-y-5">
                  <div className="lab-section-heading flex flex-wrap items-center gap-3 rounded-2xl border border-slate-100 bg-white/80 px-4 py-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-slate-100 text-lg">
                      <Icon className="h-5 w-5 text-slate-700" />
                    </span>
                    <div className="flex-1 min-w-[200px]">
                      <p className="text-base font-semibold text-slate-900">{meta.title}</p>
                      <p className="text-sm text-slate-500">{meta.description}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {statusCounts[statusKey]} tugas
                    </span>
                  </div>

                  {group.length > 0 ? (
                    <div className="grid gap-6 lg:grid-cols-2">
                      {group.map(({ assignment, submission }, idx) => {
                        const difficulty = normalizeDifficulty(assignment.difficulty)
                        const difficultyInfo = difficultyMeta[difficulty]
                        const statusChip = statusChipMeta[statusKey]
                        const StatusIcon = statusChip.icon
                        const difficultyGradient = difficultyInfo.gradient
                        const requirements = parseArrayField(assignment.requirements)
                        const taskEmoji = getTaskEmoji(assignment.title)
                        const htmlComplete = Boolean(submission)
                        const cssComplete = Boolean(
                          submission && submission.status !== 'DRAFT'
                        )
                        const jsComplete = submission?.status === 'GRADED'
                        const progressSegments = [
                          { label: 'HTML', completed: htmlComplete },
                          { label: 'CSS', completed: cssComplete },
                          { label: 'JS', completed: jsComplete }
                        ]
                        const progressCompleted = progressSegments.filter(segment => segment.completed).length
                        const progressPercentage = (progressCompleted / progressSegments.length) * 100
                        const submissionScore = submission?.score ?? submission?.grade
                        const ctaCopy: Record<AssignmentState, { title: string; sub: string }> = {
                          late: {
                            title: 'Kejar Deadline',
                            sub: 'Prioritaskan misi ini dulu'
                          },
                          in_progress: {
                            title: 'Lanjutkan Progress',
                            sub: 'Tetap coding sampai submit'
                          },
                          not_started: {
                            title: 'Mulai Coding',
                            sub: 'Mulai coding sekarang'
                          },
                          completed: {
                            title: 'Review & Upgrade',
                            sub: 'Perbaiki berdasarkan feedback'
                          }
                        }

                        return (
                          <article
                            key={assignment.id}
                            className={`lab-task-card group relative overflow-hidden rounded-3xl border bg-white/95 p-6 shadow-brand-sm ${
                              statusKey === 'late'
                                ? 'border-rose-200 hover:border-rose-300'
                                : statusKey === 'in_progress'
                                  ? 'border-sky-200 hover:border-sky-300'
                                  : statusKey === 'completed'
                                    ? 'border-emerald-200 hover:border-emerald-300'
                                    : 'border-slate-200 hover:border-slate-300'
                            }`}
                            style={{ animationDelay: `${idx * 80}ms` }}
                          >
                            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${difficultyGradient}`}></div>
                            <div className={`absolute inset-0 bg-gradient-to-br ${meta.accent} opacity-40`}></div>
                            <div className="relative space-y-4">
                              <div className="flex flex-wrap items-start gap-3">
                                <span className="text-3xl" aria-hidden>
                                  {taskEmoji}
                                </span>
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${difficultyInfo.chipClass}`}>
                                      <Sparkles className="h-3 w-3" />
                                      {difficultyInfo.label}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusChip.className}`}>
                                      <StatusIcon
                                        className={`h-3.5 w-3.5 ${
                                          statusKey === 'not_started' ? 'lab-play-icon' : ''
                                        }`}
                                      />
                                      {statusChip.label}
                                    </span>
                                  </div>
                                  <h3 className="mt-3 text-2xl font-semibold text-slate-900">
                                    {assignment.title}
                                  </h3>
                                  <p className="mt-2 text-sm text-slate-600">
                                    {assignment.description}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-3 text-[13px] font-medium text-slate-600">
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1">
                                  <Sparkles className="h-3 w-3 text-amber-500" />
                                  +{assignment.points} XP
                                </span>
                                {assignment.timeLimit && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1">
                                    <Timer className="h-3 w-3 text-sky-500" />
                                    {assignment.timeLimit} menit fokus
                                  </span>
                                )}
                                {assignment.classLevel && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1">
                                    <Laptop className="h-3 w-3 text-indigo-500" />
                                    {assignment.classLevel}
                                  </span>
                                )}
                              </div>

                              {requirements.length > 0 && (
                                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Checklist ({requirements.length})
                                  </p>
                                  <ul className="mt-2 space-y-1 text-sm text-slate-600">
                                    {requirements.slice(0, 2).map((req, reqIdx) => (
                                      <li key={`${assignment.id}-req-${reqIdx}`} className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                                        <span className="line-clamp-2">{req}</span>
                                      </li>
                                    ))}
                                    {requirements.length > 2 && (
                                      <li className="text-xs text-slate-500">+{requirements.length - 2} lainnya</li>
                                    )}
                                  </ul>
                                </div>
                              )}

                              <div className="rounded-2xl border border-slate-100 bg-white/80 p-4">
                                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                                  <span>Progress Coding</span>
                                  <span>{progressCompleted}/3 stack</span>
                                </div>
                                <div className="lab-progress-rail mt-3">
                                  <div
                                    className={`lab-progress-fill ${statusKey === 'in_progress' ? 'lab-progress-fill--active' : ''}`}
                                    style={{ width: `${progressPercentage}%` }}
                                  ></div>
                                </div>
                                <div className="mt-3 space-y-2 text-xs font-semibold text-slate-600">
                                  {progressSegments.map((segment) => (
                                    <div key={`${assignment.id}-${segment.label}`} className="flex items-center justify-between">
                                      <span className="flex items-center gap-2">
                                        {segment.completed ? (
                                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                        ) : (
                                          <Circle className="h-4 w-4 text-slate-300" />
                                        )}
                                        {segment.label}
                                      </span>
                                      <span className="text-[11px] text-slate-500">{segment.completed ? '1/1' : '0/1'}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {submission?.status === 'GRADED' && (submission.feedback || submissionScore !== undefined) && (
                                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                                  <div className="flex items-start gap-3">
                                    <MessageSquare className="h-5 w-5 text-emerald-600" />
                                    <div className="text-sm text-emerald-700">
                                      <p className="font-semibold">Feedback Guru</p>
                                      {submission.feedback && <p className="mt-1">{submission.feedback}</p>}
                                      {typeof submissionScore === 'number' && (
                                        <p className="mt-2 text-xs font-semibold">
                                          Nilai {submissionScore}/100
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              <button
                                type="button"
                                onClick={() => router.push(`/student/web-lab/${assignment.id}`)}
                                className="cta-animated group/cta mt-2 w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-purple-500 px-5 py-4 text-left text-white shadow-brand-md transition-transform active:scale-95"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-base font-semibold">{ctaCopy[statusKey].title}</p>
                                    <p className="text-xs text-white/80">{ctaCopy[statusKey].sub}</p>
                                  </div>
                                  <span className="cta-icon inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white">
                                    <Play className="h-5 w-5" />
                                  </span>
                                </div>
                              </button>
                            </div>
                          </article>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 px-5 py-6 text-sm text-slate-500">
                      {groupEmptyCopy[statusKey]}
                    </div>
                  )}
                </div>
              )
            })}
          </section>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/90 px-8 py-14 text-center shadow-brand-sm">
            <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-100 to-purple-100 text-3xl">
              <div className="flex h-full w-full items-center justify-center">💻</div>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900">Belum ada tugas Web Lab</h3>
            <p className="mt-2 text-sm text-slate-500">
              Guru akan merilis misi baru segera. Sementara itu, eksplorasi ide desainmu sendiri.
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
              <div>
                <p className="font-semibold text-rose-700">Terjadi kesalahan</p>
                <p className="text-sm text-rose-600">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  )
}
