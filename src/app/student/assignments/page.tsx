'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Pencil,
  Laptop,
  Presentation,
  Brain,
  FileText
} from 'lucide-react'
import { studentAuth } from '@/lib/student-auth'
import StudentLayout from '@/components/student/StudentLayout'
import Breadcrumb from '@/components/ui/Breadcrumb'
import PlayfulTourGuide, { TourStep } from '@/components/student/PlayfulTourGuide'

interface Assignment {
  id: string
  title: string
  description?: string
  dueDate?: string
  subject?: string
  status?: 'pending' | 'in_progress' | 'completed' | 'overdue'
  type?: 'essay' | 'paper' | 'coding' | 'presentation' | 'review' | 'quiz'
  progress?: number
}

type DerivedStatus = 'pending' | 'in_progress' | 'completed' | 'overdue'
type AssignmentGroup = 'urgent' | 'overdue' | 'in_progress' | 'pending' | 'completed'

type ProcessedAssignment = Omit<Assignment, 'dueDate'> & {
  dueDate: Date | null
  diffDays: number | null
  derivedStatus: DerivedStatus
  group: AssignmentGroup
  isThisWeek: boolean
  filterCategory: {
    isLate: boolean
    isCompleted: boolean
    isUrgent: boolean
    isInProgress: boolean
  }
}

const assignmentTourSteps: TourStep[] = [
  {
    selector: '#assignments-hero',
    emoji: '🎯',
    title: 'Daftar semua tugas kamu',
    subtitle: 'Liat yang penting dulu',
    text: 'Di sini kamu bisa liat sapaan sama jumlah tugas: yang lagi dikerjain, yang belum dimulai, sama yang udah selesai. Jadi tau mana yang harus didahuluin.'
  },
  {
    selector: '#assignments-filters',
    emoji: '🎛️',
    title: 'Filter tugas',
    subtitle: 'Atur sesuai kebutuhan',
    text: 'Tombol ini buat milih tugas mana yang mau kamu kerjain: yang urgent, yang udah telat, atau yang masih santai. Biar nggak kewalahan.'
  },
  {
    selector: '#assignments-groups',
    emoji: '🪄',
    title: 'Detail tiap tugas',
    subtitle: 'Deadline + tombol mulai',
    text: 'Di bagian ini setiap tugas punya keterangan lengkap: status, deadline, checklist, sama tombol buat mulai. Tinggal scroll dan kerjain satu per satu.'
  },
  {
    selector: '#assignments-groups',
    emoji: '📌',
    title: 'Status tugas real-time',
    subtitle: 'Update otomatis',
    text: 'Status tugas berubah otomatis: dari pending jadi in progress waktu kamu mulai, terus jadi completed pas selesai. Jadi selalu update!'
  }
]

export default function AssignmentsIndexPage() {
  const router = useRouter()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const session = studentAuth.getSession()
    if (!session) {
      // redirect to login and back to assignments after auth
      router.push('/student/login?redirectTo=' + encodeURIComponent('/student/assignments'))
      return
    }

    fetchAssignments()
  }, [router])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => setPrefersReducedMotion(motionQuery.matches)
    setPrefersReducedMotion(motionQuery.matches)
    motionQuery.addEventListener('change', handleChange)
    return () => motionQuery.removeEventListener('change', handleChange)
  }, [])

  const fetchAssignments = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/tutorial/assignments')
      if (res.ok) {
        const data = await res.json()
        setAssignments(Array.isArray(data.data) ? data.data : [])
        setError('')
      } else {
        setError('Gagal memuat daftar tugas')
        setAssignments([])
      }
    } catch (err) {
      console.error('Error fetching assignments', err)
      setError((err as Error).message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const processedAssignments: ProcessedAssignment[] = useMemo(() => {
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 7)

    return assignments.map((assignment) => {
      const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null
      const diffDays = dueDate ? Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null
      let derivedStatus: DerivedStatus = assignment.status ?? 'pending'

      if (assignment.status === 'completed') {
        derivedStatus = 'completed'
      } else if (dueDate && dueDate < now) {
        derivedStatus = 'overdue'
      } else if (diffDays !== null && diffDays <= 2) {
        derivedStatus = 'pending'
      } else if (assignment.status === 'in_progress') {
        derivedStatus = 'in_progress'
      }

      const group =
        derivedStatus === 'completed'
          ? 'completed'
          : derivedStatus === 'overdue'
            ? 'overdue'
            : diffDays !== null && diffDays <= 2
              ? 'urgent'
              : assignment.status === 'in_progress'
                ? 'in_progress'
                : 'pending'

      const isThisWeek = dueDate ? dueDate >= startOfWeek && dueDate <= endOfWeek : false

      return {
        ...assignment,
        dueDate,
        diffDays,
        derivedStatus,
        group,
        isThisWeek,
        filterCategory: {
          isLate: derivedStatus === 'overdue',
          isCompleted: derivedStatus === 'completed',
          isUrgent: group === 'urgent',
          isInProgress: group === 'in_progress'
        }
      }
    })
  }, [assignments])

  const summaryStats = useMemo(() => {
    const pending = processedAssignments.filter((a) => a.derivedStatus === 'pending').length
    const completed = processedAssignments.filter((a) => a.derivedStatus === 'completed').length
    const overdue = processedAssignments.filter((a) => a.derivedStatus === 'overdue').length
    const inProgress = processedAssignments.filter((a) => a.derivedStatus === 'in_progress').length
    return { pending, completed, overdue, inProgress }
  }, [processedAssignments])

  const filters = useMemo(() => ([
    { id: 'all', label: 'Semua' },
    { id: 'this_week', label: 'Minggu Ini' },
    { id: 'upcoming', label: 'Mendekati Deadline' },
    { id: 'late', label: 'Terlambat' },
    { id: 'completed', label: 'Selesai' }
  ]), [])

  const filteredAssignments = useMemo(() => {
    return processedAssignments.filter((assignment) => {
      switch (activeFilter) {
        case 'this_week':
          return assignment.isThisWeek
        case 'upcoming':
          return assignment.group === 'urgent'
        case 'late':
          return assignment.derivedStatus === 'overdue'
        case 'completed':
          return assignment.derivedStatus === 'completed'
        default:
          return true
      }
    })
  }, [processedAssignments, activeFilter])

  const groupedAssignments = useMemo(() => {
    const groupingOrder: Record<string, { title: string; icon: ReactNode; description: string }> = {
      urgent: {
        title: '🔥 Deadline Mendekati',
        icon: <Clock className="w-4 h-4 text-amber-500" />,
        description: 'Kerjakan yang paling mepet dulu ya!'
      },
      overdue: {
        title: '⚠️ Perlu Perhatian',
        icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
        description: 'Sudah melewati batas waktu, yuk segera kejar.'
      },
      in_progress: {
        title: '💬 Sedang Dikerjakan',
        icon: <Sparkles className="w-4 h-4 text-sky-500" />,
        description: 'Momentum lagi bagus, lanjutkan!'
      },
      pending: {
        title: '⏳ Belum Dimulai',
        icon: <BookOpen className="w-4 h-4 text-slate-500" />,
        description: 'Pilih tugas yang mau kamu mulai duluan.'
      },
      completed: {
        title: '📘 Terselesaikan',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
        description: 'Kerja bagus! Nikmati progresmu.'
      }
    }

    const grouped: Record<string, typeof filteredAssignments> = { urgent: [], overdue: [], in_progress: [], pending: [], completed: [] }
    filteredAssignments.forEach((assignment) => {
      grouped[assignment.group].push(assignment)
    })
    return {
      grouped,
      groupingOrder
    }
  }, [filteredAssignments])

  const getStatusMeta = useCallback((assignment: ProcessedAssignment) => {
    if (assignment.derivedStatus === 'overdue') {
      return {
        label: 'Terlambat',
        badgeClass: 'bg-[#FEE2E2] text-[#B91C1C]',
        borderClass: 'border-[#FCA5A5]',
        ctaLabel: 'Perbaiki Sekarang',
        accent: 'text-[#B91C1C]',
        icon: AlertTriangle,
        tone: 'late'
      }
    }

    if (assignment.group === 'urgent') {
      return {
        label: 'Segera',
        badgeClass: 'bg-[#FEF3C7] text-[#B45309]',
        borderClass: 'border-[#FCD34D]',
        ctaLabel: 'Kerjakan Dulu',
        accent: 'text-[#B45309]',
        icon: Clock,
        tone: 'urgent'
      }
    }

    if (assignment.derivedStatus === 'in_progress') {
      return {
        label: 'Sedang dikerjakan',
        badgeClass: 'bg-[#DBEAFE] text-[#1D4ED8]',
        borderClass: 'border-[#93C5FD]',
        ctaLabel: 'Lanjutkan',
        accent: 'text-[#1D4ED8]',
        icon: Sparkles,
        tone: 'progress'
      }
    }

    if (assignment.derivedStatus === 'completed') {
      return {
        label: 'Selesai',
        badgeClass: 'bg-[#DCFCE7] text-[#15803D]',
        borderClass: 'border-[#A7F3D0]',
        ctaLabel: 'Lihat Tugas',
        accent: 'text-[#15803D]',
        icon: CheckCircle2,
        tone: 'completed'
      }
    }

    return {
      label: 'Belum dimulai',
      badgeClass: 'bg-[#F3F4F6] text-[#374151]',
      borderClass: 'border-[#E5E7EB]',
      ctaLabel: 'Mulai',
      accent: 'text-[#374151]',
      icon: BookOpen,
      tone: 'pending'
    }
  }, [])

  const taskTypeMeta = useMemo(() => ({
    essay: { icon: Pencil, label: 'Esai' },
    paper: { icon: FileText, label: 'Makalah' },
    coding: { icon: Laptop, label: 'Coding Lab' },
    presentation: { icon: Presentation, label: 'Presentasi' },
    review: { icon: Brain, label: 'Review' },
    quiz: { icon: Sparkles, label: 'Quiz' }
  }), [])

  const renderTaskCard = (assignment: ProcessedAssignment, index: number) => {
    const statusMeta = getStatusMeta(assignment)
    const typeMeta = assignment.type ? taskTypeMeta[assignment.type] : null
    const Icon = statusMeta.icon
    const TypeIcon = typeMeta?.icon ?? FileText

    return (
      <motion.div
        key={assignment.id}
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: prefersReducedMotion ? 0 : index * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`task-card border ${statusMeta.borderClass}`}
        data-tone={statusMeta.tone}
      >
        <div className="task-card__left">
          <span className={`task-status-badge ${statusMeta.badgeClass}`}>
            <Icon className="w-4 h-4" />
            {statusMeta.label}
          </span>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {typeMeta && (
                <span className="task-type-chip">
                  <TypeIcon className="w-3.5 h-3.5" />
                  {typeMeta.label}
                </span>
              )}
              {assignment.subject && (
                <span className="text-xs text-gray-500">
                  {assignment.subject}
                </span>
              )}
            </div>
            <h3 className="task-title">{assignment.title}</h3>
            {assignment.description && (
              <p className="task-description">{assignment.description}</p>
            )}
          </div>
        </div>
        <div className="task-card__right">
          <div className="task-deadline">
            <p className="task-deadline__label">Tenggat</p>
            <p className={`task-deadline__value ${statusMeta.accent}`}>
              {assignment.dueDate
                ? assignment.dueDate.toLocaleDateString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long'
                })
                : 'Belum ditentukan'}
            </p>
            {assignment.diffDays !== null && (
              <p className="task-deadline__meta">
                {assignment.diffDays < 0
                  ? `${Math.abs(assignment.diffDays)} hari lalu`
                  : assignment.diffDays === 0
                    ? 'Hari ini'
                    : `Dalam ${assignment.diffDays} hari`}
              </p>
            )}
          </div>
          <div className="task-card__actions">
            {assignment.progress !== undefined && assignment.derivedStatus === 'in_progress' && (
              <div className="task-progress">
                <div className="task-progress__fill" style={{ width: `${assignment.progress}%` }}></div>
              </div>
            )}
            <Link
              href={`/student/assignments/${assignment.id}`}
              className="task-cta"
            >
              {statusMeta.ctaLabel}
            </Link>
          </div>
        </div>
      </motion.div>
    )
  }

  const renderEmptyState = () => (
    <div className="task-empty-state">
      <div className="task-empty-state__illustration">
        <Sparkles className="w-8 h-8 text-[#45C7FA]" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900">Tidak ada tugas pada filter ini 🎉</h3>
      <p className="text-gray-600 mt-2">Kamu bebas eksplor materi lain dulu atau cek coding lab.</p>
      <Link href="/student/dashboard-simple" className="task-cta mt-4 inline-flex w-auto justify-center">Kembali ke Dashboard</Link>
    </div>
  )

  const renderGroupedContent = () => {
    return Object.entries(groupedAssignments.groupingOrder).map(([groupKey, groupMeta]) => {
      const assignmentsInGroup = groupedAssignments.grouped[groupKey] || []
      if (assignmentsInGroup.length === 0) return null
      return (
        <section key={groupKey}>
          <div className="task-group-header">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              {groupMeta.icon}
              {groupMeta.title}
            </div>
            <p className="text-sm text-gray-500">{groupMeta.description}</p>
          </div>
          <div className="space-y-4">
            {assignmentsInGroup.map((assignment, index) => renderTaskCard(assignment, index))}
          </div>
        </section>
      )
    })
  }

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat daftar tugas...</p>
          </div>
        </div>
      </StudentLayout>
    )
  }

  const currentSession = studentAuth.getSession()

  return (
    <StudentLayout>
      <div className="task-page w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Breadcrumb items={[{ label: 'Daftar Tugas' }]} />
        </div>
        <div className="flex justify-end">
          <PlayfulTourGuide
            tourId="student-assignments"
            steps={assignmentTourSteps}
            autoStartDelay={1100}
            renderTrigger={({ startTour, hasSeenTutorial, storageReady }) => (
              <button type="button" className="tour-trigger-chip" onClick={startTour}>
                {storageReady && hasSeenTutorial ? 'Ulang panduan' : 'Butuh panduan?'}
                <span aria-hidden>📚</span>
              </button>
            )}
          />
        </div>

        <motion.section
          id="assignments-hero"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="task-hero"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">Learning Tasks</p>
            <h1 className="text-3xl font-bold text-white mt-2">Hai {currentSession?.fullName ?? 'Sahabat'}! Ini daftar tugasmu ✨</h1>
            <p className="text-white/80 mt-2 max-w-2xl">
              Kami rapikan tugas berdasarkan prioritas supaya kamu fokus ke hal yang paling penting dulu.
            </p>
          </div>
          <div className="task-summary-grid">
            <div className="task-summary-card">
              <p className="task-summary-card__label">Pending</p>
              <p className="task-summary-card__value">{summaryStats.pending}</p>
            </div>
            <div className="task-summary-card">
              <p className="task-summary-card__label">Sedang Dikerjakan</p>
              <p className="task-summary-card__value">{summaryStats.inProgress}</p>
            </div>
            <div className="task-summary-card">
              <p className="task-summary-card__label">Terlambat</p>
              <p className="task-summary-card__value">{summaryStats.overdue}</p>
            </div>
            <div className="task-summary-card">
              <p className="task-summary-card__label">Selesai</p>
              <p className="task-summary-card__value">{summaryStats.completed}</p>
            </div>
          </div>
        </motion.section>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg">{error}</div>
        )}

        <section id="assignments-filters">
          <div className="task-filter-bar">
            <div className="flex flex-wrap gap-2 items-center">
              {filters.map((filter) => (
                <motion.button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`task-filter-pill ${activeFilter === filter.id ? 'task-filter-pill--active' : ''}`}
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {filter.label}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        <div id="assignments-groups">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              {filteredAssignments.length === 0
                ? renderEmptyState()
                : renderGroupedContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </StudentLayout>
  )
}
