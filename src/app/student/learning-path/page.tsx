"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import StudentLayout from '@/components/student/StudentLayout';
import PlayfulTourGuide, { TourStep } from '@/components/student/PlayfulTourGuide';
import {
  Target,
  Lock,
  TrendingUp,
  Award,
  BookOpen,
  ChevronRight,
  Lightbulb,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface LearningStage {
  id: string;
  title: string;
  slug: string;
  goal: string;
  skills: string[];
  basicTargets: Array<{
    title: string;
    description: string;
    completed: boolean;
  }>;
  advancedTargets: Array<{
    title: string;
    description: string;
    completed: boolean;
  }>;
  reflectionPrompt?: string;
  order: number;
  isActive: boolean;
  progress: number;
  isCompleted: boolean;
  isUnlocked: boolean;
}

type StageStatus = 'locked' | 'available' | 'in-progress' | 'completed'

type RawStage = Omit<LearningStage, "progress" | "isCompleted" | "isUnlocked">

const transformStages = (rawStages: RawStage[]): LearningStage[] => {
  let previousCompleted = true
  return rawStages.map((stage, index) => {
    const basicTargets = (stage.basicTargets ?? []).map((target) => ({
      title: target.title,
      description: target.description,
      completed: Boolean(target.completed)
    }))
    const advancedTargets = (stage.advancedTargets ?? []).map((target) => ({
      title: target.title,
      description: target.description,
      completed: Boolean(target.completed)
    }))
    const totalTargets = basicTargets.length + advancedTargets.length
    const completedTargets =
      basicTargets.filter((target) => target.completed).length +
      advancedTargets.filter((target) => target.completed).length
    const progress = totalTargets > 0 ? Math.round((completedTargets / totalTargets) * 100) : 0
    const isCompleted = progress === 100
    const isUnlocked = index === 0 ? true : previousCompleted
    previousCompleted = isCompleted

    return {
      id: stage.id ?? stage.slug ?? `stage-${index}`,
      title: stage.title,
      slug: stage.slug ?? `stage-${index}`,
      goal: stage.goal,
      skills: stage.skills ?? [],
      basicTargets,
      advancedTargets,
      reflectionPrompt: stage.reflectionPrompt,
      order: stage.order ?? index + 1,
      isActive: stage.isActive ?? true,
      progress,
      isCompleted,
      isUnlocked
    }
  })
}

const statusLabelMap: Record<StageStatus, string> = {
  completed: 'Completed',
  'in-progress': 'In Progress',
  available: 'Ready to Start',
  locked: 'Locked'
}

const statusBadgeClass: Record<StageStatus, string> = {
  completed: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  'in-progress': 'bg-blue-50 text-blue-700 border border-blue-100',
  available: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
  locked: 'bg-slate-100 text-slate-500 border border-slate-200'
}

const statusDotClass: Record<StageStatus, string> = {
  completed: 'bg-emerald-500 shadow-emerald-200/70',
  'in-progress': 'bg-blue-500 shadow-blue-200/70',
  available: 'bg-indigo-500 shadow-indigo-200/70',
  locked: 'bg-slate-400 shadow-slate-200/70'
}

const statusBorderClass: Record<StageStatus, string> = {
  completed: 'border-emerald-100 hover:border-emerald-200',
  'in-progress': 'border-blue-100 hover:border-blue-200',
  available: 'border-indigo-100 hover:border-indigo-200',
  locked: 'border-slate-100'
}

const learningPathTourSteps: TourStep[] = [
  {
    selector: '#learningpath-hero',
    emoji: '🗺️',
    title: 'Peta Belajar Kamu',
    subtitle: 'Misi utama belajar coding',
    text: 'Di sini kamu bisa liat level coding-mu, streak harian, sama XP yang udah dikumpulin. Serasa main game kan?'
  },
  {
    selector: '#learningpath-stage-list',
    emoji: '📚',
    title: 'Daftar tahapan',
    subtitle: 'Pilih bab yang mau dipelajari',
    text: 'Tahapan di sebelah kiri urutannya kayak level game. Klik salah satu buat lihat detail apa yang harus dikerjain.'
  },
  {
    selector: '#learningpath-stage-detail',
    emoji: '🎯',
    title: 'Detail tahap yang dipilih',
    subtitle: 'Target dasar + bonus tantangan',
    text: 'Bagian kanan ini nunjukin checklist yang harus dikerjain, tantangan bonus, sama refleksi dari setiap tahap belajar.'
  },
  {
    selector: '#learningpath-stage-detail',
    emoji: '⭐',
    title: 'Tracking progres belajar',
    subtitle: 'Pantau setiap pencapaian',
    text: 'Setiap tahap punya persentase progress, skill yang dipelajari, sama checklist target. Kamu bisa liat seberapa jauh sudah menguasai materi.'
  }
]

const renderStatusIcon = (status: StageStatus) => {
  switch (status) {
    case 'completed':
      return <ShieldCheck className="w-4 h-4 text-white" />
    case 'in-progress':
      return <Sparkles className="w-4 h-4 text-white" />
    case 'available':
      return <Target className="w-4 h-4 text-white" />
    default:
      return <Lock className="w-4 h-4 text-white" />
  }
}

export default function LearningPathPage() {
  const router = useRouter()
  const [stages, setStages] = useState<LearningStage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStage, setSelectedStage] = useState<LearningStage | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [emptyMessage, setEmptyMessage] = useState<string | null>('Menunggu data Ekstra dari server...')

  const applyStages = useCallback((rawStages: RawStage[]) => {
    if (!rawStages || rawStages.length === 0) {
      setStages([])
      setSelectedStage(null)
      setEmptyMessage('Belum ada stage di database. Jalankan seed/seed-classroom-roadmap.ts lalu refresh halaman.')
      return
    }

    console.debug('[LearningPath] applying stages', { count: rawStages.length })
    const transformedStages = transformStages(rawStages)
    setStages(transformedStages)
    setEmptyMessage(null)

    const firstIncomplete = transformedStages.find((s) => s.isUnlocked && !s.isCompleted)
    if (firstIncomplete) {
      setSelectedStage(firstIncomplete)
    } else {
      setSelectedStage(transformedStages[0] ?? null)
    }
  }, [])

  const progressSnapshot = useMemo(() => {
    const completedStagesCount = stages.filter((s) => s.isCompleted).length
    const totalStages = stages.length
    const overallProgress = totalStages > 0
      ? Math.round((completedStagesCount / totalStages) * 100)
      : 0

    const totalTargets = stages.reduce((acc, stage) => {
      return acc + (stage.basicTargets?.length || 0) + (stage.advancedTargets?.length || 0)
    }, 0)

    const completedTargets = stages.reduce((acc, stage) => {
      const doneBasic = stage.basicTargets?.filter((t) => t.completed).length || 0
      const doneAdvanced = stage.advancedTargets?.filter((t) => t.completed).length || 0
      return acc + doneBasic + doneAdvanced
    }, 0)

    const xpEstimate = completedTargets * 20
    const streakDays = Math.min(completedStagesCount, 7)

    return {
      completedStagesCount,
      totalStages,
      overallProgress,
      totalTargets,
      completedTargets,
      xpEstimate,
      streakDays
    }
  }, [stages])

  useEffect(() => {
    console.debug('[LearningPath] stages state updated', {
      count: stages.length,
      selectedStage: selectedStage?.slug
    })
  }, [stages, selectedStage])

  const fetchLearningPath = useCallback(async () => {
    try {
      console.debug('[LearningPath] fetching stages…')
      setIsLoading(true)
      const response = await fetch('/api/roadmap/stages')
      if (!response.ok) {
        throw new Error('Failed to fetch learning path')
      }

      const data = await response.json()
      const rawStages: RawStage[] = Array.isArray(data?.stages) ? data.stages : []
      console.debug('[LearningPath] API returned stages', rawStages.length)
      applyStages(rawStages)
    } catch (error) {
      console.error('Error fetching learning path:', error)
      setStages([])
      setSelectedStage(null)
      setEmptyMessage('Gagal memuat data Ekstra. Coba Refresh atau hubungi admin.')
    } finally {
      setIsLoading(false)
    }
  }, [applyStages])

  useEffect(() => {
    fetchLearningPath()
  }, [fetchLearningPath])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  const getStageStatus = (stage: LearningStage) => {
    if (!stage.isUnlocked) return 'locked'
    if (stage.isCompleted) return 'completed'
    if (stage.progress > 0) return 'in-progress'
    return 'available'
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    const elements = document.querySelectorAll<HTMLElement>('[data-lp-animate]')

    if (prefersReducedMotion) {
      elements.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    elements.forEach((el, index) => {
      if (!el.hasAttribute('data-lp-delay')) {
        el.style.setProperty('--lp-delay', `${index * 60}ms`)
      }
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [prefersReducedMotion, stages, selectedStage])

  const levelLabels = ['Beginner', 'Explorer', 'Builder', 'Creator', 'Mentor']
  const levelIndex = Math.min(
    levelLabels.length - 1,
    Math.max(progressSnapshot.completedStagesCount - 1, 0)
  )
  const currentLevelLabel = levelLabels[levelIndex] || levelLabels[0]
  const heroStats = [
    {
      label: 'Stage selesai',
      value: `${progressSnapshot.completedStagesCount}/${progressSnapshot.totalStages || 0}`
    },
    {
      label: 'Target tuntas',
      value: `${progressSnapshot.completedTargets}/${progressSnapshot.totalTargets || 0}`
    },
    {
      label: 'XP terkumpul',
      value: `${progressSnapshot.xpEstimate} XP`
    }
  ]
  const stageSkills = selectedStage?.skills ?? []
  const stageBasicTargets = selectedStage?.basicTargets ?? []
  const stageAdvancedTargets = selectedStage?.advancedTargets ?? []

  const handleStartStage = useCallback(() => {
    router.push('/student/web-lab')
  }, [router])

  const handleViewMaterials = useCallback(() => {
    router.push('/student/web-lab')
  }, [router])

  const handleBasicTargetCta = useCallback(() => {
    router.push('/student/web-lab')
  }, [router])

  const handleAdvancedTargetCta = useCallback(() => {
    router.push('/student/coding-lab')
  }, [router])

  const selectedStageStatus: StageStatus | null = selectedStage ? getStageStatus(selectedStage) : null

  if (!isLoading && stages.length === 0) {
    return (
      <StudentLayout>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
          <div className="max-w-md rounded-2xl border border-indigo-100 bg-white p-8 text-center shadow-lg">
            <Sparkles className="mx-auto mb-4 h-10 w-10 text-indigo-500" />
            <h2 className="text-xl font-semibold text-slate-900">Ekstra belum siap</h2>
            <p className="mt-3 text-sm text-slate-600">
              {emptyMessage ||
                'Kami belum bisa memuat tahapan Coding Lab dari server. Jalankan kembali seed/seed-classroom-roadmap.ts atau hubungi admin.'}
            </p>
            <button
              type="button"
              onClick={fetchLearningPath}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Coba muat ulang
            </button>
          </div>
        </div>
      </StudentLayout>
    )
  }

  return (
    <StudentLayout>
      <div className="min-h-screen bg-slate-50 pb-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-10 sm:px-6 lg:px-0">
          {isLoading && (
            <div className="rounded-2xl border border-indigo-100 bg-white px-4 py-3 text-sm text-indigo-700 shadow-sm">
              <div className="flex items-center justify-center gap-2">
                <div className="h-2 w-2 animate-ping rounded-full bg-indigo-500" />
                Sedang memuat progres terbaru…
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <PlayfulTourGuide
              tourId="student-learningpath"
              steps={learningPathTourSteps}
              autoStartDelay={1500}
              renderTrigger={({ startTour, hasSeenTutorial, storageReady }) => (
                <button type="button" className="tour-trigger-chip" onClick={startTour}>
                  {storageReady && hasSeenTutorial ? 'Ulang panduan' : 'Butuh panduan?'}
                  <span aria-hidden>🗺️</span>
                </button>
              )}
            />
          </div>

          <section
            id="learningpath-hero"
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 p-8 text-white shadow-xl"
            data-lp-animate="fade-down"
          >
            <div className="absolute inset-y-0 right-0 w-1/2 opacity-40 blur-3xl">
              <div className="h-full w-full bg-gradient-to-br from-cyan-300 via-white to-fuchsia-300" />
            </div>
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
                  <Sparkles className="h-4 w-4" />
                  Coding Journey
                </div>
                <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                  Ekstra – Perjalanan Belajarmu Dimulai
                </h1>
                <p className="mt-3 max-w-2xl text-base text-white/80">
                  Ikuti tahap demi tahap hingga menjadi Web Developer mandiri. Setiap stage memuat target dasar, bonus challenge, dan refleksi agar progresmu terasa seperti quest sungguhan.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div
                    className="rounded-2xl border border-white/30 bg-white/10 p-4 backdrop-blur"
                    data-lp-animate="fade-up"
                  >
                    <p className="text-xs uppercase tracking-widest text-white/70">Coding Level</p>
                    <p className="mt-2 text-2xl font-semibold">
                      Level {Math.max(progressSnapshot.completedStagesCount, 1)}
                    </p>
                    <p className="text-sm text-white/80">{currentLevelLabel}</p>
                  </div>
                  <div
                    className="rounded-2xl border border-white/30 bg-white/10 p-4 backdrop-blur"
                    data-lp-animate="fade-up"
                    data-lp-delay="120ms"
                  >
                    <p className="text-xs uppercase tracking-widest text-white/70">Streak</p>
                    <p className="mt-2 text-2xl font-semibold">
                      🔥 {progressSnapshot.streakDays} Hari
                    </p>
                    <p className="text-sm text-white/80">
                      {progressSnapshot.completedTargets} tantangan selesai
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="w-full rounded-2xl border border-white/30 bg-white/10 p-6 backdrop-blur lg:w-96"
                data-lp-animate="fade-left"
              >
                <div className="flex items-center justify-between text-sm text-white/80">
                  <span>XP Progress</span>
                  <span>{progressSnapshot.overallProgress}%</span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-white/20">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-yellow-300 via-white to-cyan-200 transition-all duration-500"
                    style={{
                      width: `${progressSnapshot.overallProgress}%`
                    }}
                  />
                </div>
                <dl className="mt-6 grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
                  {heroStats.map((stat, index) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl bg-white/15 px-3 py-2 text-white"
                      data-lp-animate="fade-up"
                      data-lp-delay={`${index * 90}ms`}
                    >
                      <dt className="text-xs uppercase tracking-widest text-white/70">{stat.label}</dt>
                      <dd className="text-lg font-semibold">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          <div
            className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-lg sm:p-6"
            data-lp-animate="fade-up"
          >
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Quest Progress</p>
                  <p className="text-xs text-slate-500">
                    {progressSnapshot.completedStagesCount}/{stages.length} stages completed
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-6 text-center text-sm font-semibold text-slate-700">
                <div>
                  <p className="text-base text-slate-900">{progressSnapshot.completedStagesCount}</p>
                  <span className="text-xs uppercase tracking-widest text-slate-500">Stages selesai</span>
                </div>
                <div>
                  <p className="text-base text-slate-900">{progressSnapshot.completedTargets}</p>
                  <span className="text-xs uppercase tracking-widest text-slate-500">Target beres</span>
                </div>
                <div>
                  <p className="text-base text-slate-900">{progressSnapshot.xpEstimate} XP</p>
                  <span className="text-xs uppercase tracking-widest text-slate-500">XP estimasi</span>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2 text-sm text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Selesaikan Basic Targets untuk buka stage selanjutnya
              </div>
            </div>
          </div>

          <section className="grid gap-8 lg:grid-cols-[280px,minmax(0,1fr)] xl:grid-cols-[340px,minmax(0,1fr)]">
            <aside
              id="learningpath-stage-list"
              className="rounded-3xl border border-slate-100 bg-white/90 p-5 shadow-lg sm:p-6"
              data-lp-animate="fade-right"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Roadmap Stages
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    {progressSnapshot.completedStagesCount}/{progressSnapshot.totalStages || 0} selesai
                  </p>
                </div>
                <Award className="h-6 w-6 text-amber-500" />
              </div>
              <div className="relative mt-6 pl-6">
                <div className="pointer-events-none absolute left-3 top-0 h-full w-px bg-gradient-to-b from-sky-100 via-indigo-100 to-purple-100" />
                <div className="flex flex-col gap-4">
                  {stages.map((stage, index) => {
                    const status = getStageStatus(stage)
                    const isSelected = selectedStage?.id === stage.id
                    const disabled = !stage.isUnlocked

                    return (
                      <button
                        key={stage.id}
                        type="button"
                        title={
                          disabled
                            ? 'Buka setelah menyelesaikan stage sebelumnya'
                            : `Lihat detail ${stage.title}`
                        }
                        onClick={() => !disabled && setSelectedStage(stage)}
                        className={`lp-hover-card relative w-full rounded-2xl border bg-white px-4 py-4 text-left transition-all ${
                          statusBorderClass[status]
                        } ${isSelected ? 'ring-2 ring-indigo-200 shadow-lg' : 'shadow-sm'} ${
                          disabled ? 'cursor-not-allowed opacity-60' : 'hover:-translate-y-0.5'
                        }`}
                        data-lp-animate="fade-up"
                        data-lp-delay={`${index * 80}ms`}
                      >
                        <span
                          className={`absolute -left-6 top-5 flex h-8 w-8 items-center justify-center rounded-full shadow-lg ${statusDotClass[status]}`}
                        >
                          {renderStatusIcon(status)}
                        </span>

                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                            Stage {stage.order || index + 1}
                          </p>
                          <span className={`lp-floating-chip rounded-full px-3 py-0.5 text-xs font-semibold ${statusBadgeClass[status]}`}>
                            {statusLabelMap[status]}
                          </span>
                        </div>
                        <h4 className="mt-2 text-base font-semibold text-slate-900">{stage.title}</h4>
                        <p className="text-sm text-slate-500">{stage.goal}</p>

                        <div className="mt-4">
                          <div className="h-2 rounded-full bg-slate-100">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                status === 'completed'
                                  ? 'bg-emerald-500'
                                  : status === 'locked'
                                  ? 'bg-slate-300'
                                  : 'bg-blue-500'
                              }`}
                              style={{ width: `${stage.progress}%` }}
                            />
                          </div>
                          <p className="mt-2 text-xs font-semibold text-slate-500">
                            {stage.progress}% progress
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </aside>

            <div
              id="learningpath-stage-detail"
              className="rounded-3xl border border-slate-100 bg-white shadow-2xl"
              data-lp-animate="fade-left"
            >
              {selectedStage ? (
                <>
                  <div
                    className="rounded-t-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 px-8 py-6 text-white"
                    data-lp-animate="fade-down"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold uppercase tracking-widest text-white/80">
                            Stage {selectedStage.order || 1}
                          </span>
                          {selectedStageStatus && (
                            <span
                              className={`rounded-full px-3 py-0.5 text-xs font-semibold ${statusBadgeClass[selectedStageStatus]}`}
                            >
                              {statusLabelMap[selectedStageStatus]}
                            </span>
                          )}
                        </div>
                        <h2 className="mt-3 text-3xl font-semibold">{selectedStage.title}</h2>
                        <p className="text-sm text-white/80">{selectedStage.goal}</p>
                      </div>
                      <div className="rounded-2xl border border-white/30 bg-white/10 p-4 text-center backdrop-blur">
                        <p className="text-xs uppercase tracking-widest text-white/70">Stage Progress</p>
                        <p className="mt-1 text-4xl font-bold">{selectedStage.progress}%</p>
                        <div className="mt-3 h-2 rounded-full bg-white/20">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-emerald-200 via-white to-cyan-200 transition-all duration-500"
                            style={{ width: `${selectedStage.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {stageSkills.map((skill) => (
                        <span
                          key={skill}
                          className="lp-skill-chip rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm text-white"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8 px-8 py-8">
                    <div
                      className="rounded-2xl border border-slate-100 p-6 shadow-sm"
                      data-lp-animate="fade-up"
                    >
                      <div className="flex flex-wrap items-center gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                            Stage Guide
                          </p>
                          <h3 className="text-xl font-semibold text-slate-900">Basic Targets</h3>
                          <p className="text-sm text-slate-500">
                            Tuntaskan misi-misi dasar untuk membuka stage berikutnya.
                          </p>
                        </div>
                        <div className="ml-auto flex gap-3">
                          <button
                            type="button"
                            onClick={handleStartStage}
                            className="lp-cta-button inline-flex items-center gap-2 rounded-full border border-white/0 bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition"
                          >
                            <ArrowRight className="h-4 w-4" />
                            Mulai Stage
                          </button>
                          <button
                            type="button"
                            onClick={handleViewMaterials}
                            className="lp-ghost-button inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition"
                          >
                            <BookOpen className="h-4 w-4" />
                            Lihat Materi
                          </button>
                        </div>
                      </div>
                      <div className="mt-6 grid gap-4">
                        {stageBasicTargets.map((target, idx) => (
                          <div
                            key={`${target.title}-${idx}`}
                            className={`rounded-2xl border p-4 transition-all ${
                              target.completed
                                ? 'border-emerald-200 bg-emerald-50/80'
                                : 'border-slate-100 bg-white hover:border-indigo-200'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{target.title}</p>
                                <p className="text-sm text-slate-500">{target.description}</p>
                              </div>
                              <span
                                className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                                  target.completed
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {target.completed ? 'Selesai' : 'Belum dimulai'}
                              </span>
                            </div>
                            <button
                              type="button"
                            onClick={handleBasicTargetCta}
                              className="lp-link-cta mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition"
                            >
                              {target.completed ? 'Review' : 'Mulai'}
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {stageAdvancedTargets.length > 0 && (
                      <div
                        className="rounded-2xl border border-purple-100 bg-purple-50/70 p-6 shadow-sm"
                        data-lp-animate="fade-up"
                        data-lp-delay="100ms"
                      >
                        <div className="flex items-center gap-3 text-purple-700">
                          <Award className="h-5 w-5" />
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest">Advanced Targets</p>
                            <h3 className="text-xl font-semibold text-purple-900">Bonus Challenge</h3>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-purple-800">
                          Level-up skillmu dengan tantangan tambahan berikut. Tidak wajib, tapi sangat direkomendasikan!
                        </p>
                        <div className="mt-5 grid gap-4">
                          {stageAdvancedTargets.map((target, idx) => (
                            <div
                              key={`${target.title}-${idx}`}
                              className={`rounded-2xl border bg-white/80 p-4 ${
                                target.completed
                                  ? 'border-purple-200 shadow-inner'
                                  : 'border-purple-100'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">{target.title}</p>
                                  <p className="text-sm text-slate-500">{target.description}</p>
                                </div>
                                <span
                                  className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                                    target.completed
                                      ? 'bg-purple-100 text-purple-700'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {target.completed ? 'Selesai' : 'Coba yuk'}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={handleAdvancedTargetCta}
                                className="lp-link-cta mt-4 inline-flex items-center gap-2 text-sm font-semibold text-purple-700 transition"
                              >
                                Kerjakan
                                <ChevronRight className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedStage.reflectionPrompt && (
                      <div
                        className="rounded-2xl border border-amber-100 bg-amber-50 p-6 shadow-sm"
                        data-lp-animate="fade-up"
                        data-lp-delay="140ms"
                      >
                        <div className="flex items-start gap-3">
                          <Lightbulb className="h-6 w-6 text-amber-500" />
                          <div>
                            <p className="text-sm font-semibold text-amber-900">Reflection Corner</p>
                            <p className="text-sm text-amber-800">{selectedStage.reflectionPrompt}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div
                  className="flex flex-col items-center gap-4 px-8 py-16 text-center"
                  data-lp-animate="fade-up"
                >
                  <Target className="h-16 w-16 text-slate-300" />
                  <h3 className="text-xl font-semibold text-slate-900">Pilih stage untuk mulai perjalanan</h3>
                  <p className="max-w-md text-sm text-slate-500">
                    Klik salah satu stage di sisi kiri untuk melihat target belajar, bonus challenge, dan refleksi.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </StudentLayout>
  );
}
