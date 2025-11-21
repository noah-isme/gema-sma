'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import StudentLayout from '@/components/student/StudentLayout'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { studentAuth } from '@/lib/student-auth'
import type { editor } from 'monaco-editor'
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clock,
  Flame,
  History,
  Lightbulb,
  Maximize2,
  Minimize2,
  Moon,
  Play,
  RefreshCcw,
  Sun,
  Terminal,
  TestTube,
  Trophy,
  XCircle
} from 'lucide-react'

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface TestCase {
  id: string
  name: string
  input: string
  expectedOutput: string
  isHidden: boolean
  points: number
}

interface Task {
  id: string
  title: string
  description: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  category: string
  points: number
  timeLimit: number
  starterCode: string
  hints: string[] | null
  testCases: TestCase[]
  updatedAt?: string
}

interface TestResult {
  name: string
  passed: boolean
  input: string
  expectedOutput: string
  actualOutput: string | null
  error: string | null
  time: string | null
  memory: number | null
}

interface SubmissionResult {
  success: boolean
  testResults: TestResult[]
  summary: {
    passedTests: number
    totalTests: number
    score: number
    percentage: number
  }
}

interface PreviousSubmission {
  id: string
  code: string
  score: number
  passedTests: number
  totalTests: number
  status: string
  submittedAt: string
  task: {
    points: number
  }
}

const difficultyMeta = {
  EASY: { label: 'Easy', chip: 'python-task-chip python-task-chip--easy' },
  MEDIUM: { label: 'Medium', chip: 'python-task-chip python-task-chip--medium' },
  HARD: { label: 'Hard', chip: 'python-task-chip python-task-chip--hard' }
} as const

const difficultyCopy = {
  EASY: 'Mudah',
  MEDIUM: 'Sedang',
  HARD: 'Sulit'
} as const

export default function PythonCodingTaskPage() {
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const slug = params?.slug ?? ''

  const [task, setTask] = useState<Task | null>(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [result, setResult] = useState<SubmissionResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [showHints, setShowHints] = useState(false)
  const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(false)
  const [submissions, setSubmissions] = useState<PreviousSubmission[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)

  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark')
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false)
  const [autosaveMessage, setAutosaveMessage] = useState<string>('Belum tersimpan')
  const [activeTestCaseId, setActiveTestCaseId] = useState<string>('')

  const [lastAction, setLastAction] = useState<'run' | 'submit' | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'info'; text: string } | null>(null)
  const [isCodeRestored, setIsCodeRestored] = useState(false)
  const [editorKey, setEditorKey] = useState(0)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const autosaveKey = useMemo(() => {
    if (!task) return ''
    const updatedStamp = task.updatedAt ? new Date(task.updatedAt).getTime() : ''
    return `python-lab-${task.id}-${updatedStamp}`
  }, [task])

  const breadcrumbItems = useMemo(() => (
    [
      { label: 'Dashboard', href: '/student/dashboard' },
      { label: 'Coding Lab', href: '/student/coding-lab' },
      { label: task?.title || 'Soal' }
    ]
  ), [task?.title])

  const fetchTask = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const session = studentAuth.getSession()
      if (!session) {
        router.push('/student/login')
        return
      }

      const response = await fetch(`/api/coding-lab-python/tasks/${slug}?studentId=${session.id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memuat soal')
      }

      setTask(data.task)
      setCode(data.task.starterCode)
    } catch (err) {
      console.error('Error fetching task:', err)
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat soal')
    } finally {
      setLoading(false)
    }
  }, [router, slug])

  useEffect(() => {
    fetchTask()
  }, [fetchTask])

  useEffect(() => {
    if (isEditorFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isEditorFullscreen])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!task || isCodeRestored) return

    if (typeof window !== 'undefined' && autosaveKey) {
      const savedCode = localStorage.getItem(autosaveKey)
      if (savedCode) {
        setCode(savedCode)
        setAutosaveMessage('Draft dipulihkan dari autosave')
        setIsCodeRestored(true)
        setEditorKey(prev => prev + 1) // Force editor remount with restored code
      } else {
        setIsCodeRestored(true)
      }
    }

    if (task.testCases?.length) {
      setActiveTestCaseId(task.testCases[0].id)
    }
  }, [task, autosaveKey, isCodeRestored])

  useEffect(() => {
    if (!task || !autosaveKey) return
    const handler = setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(autosaveKey, code)
        setAutosaveMessage(`Tersimpan otomatis ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`)
      }
    }, 1200)

    return () => clearTimeout(handler)
  }, [code, autosaveKey, task])

  const fetchSubmissions = useCallback(async () => {
    if (!task) return
    try {
      setLoadingSubmissions(true)
      const session = studentAuth.getSession()
      if (!session) {
        router.push('/student/login')
        return
      }

      const response = await fetch(`/api/coding-lab-python/submissions?taskId=${task.id}&studentId=${String(session.id)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memuat riwayat')
      }

      setSubmissions(data.submissions || [])
    } catch (err) {
      console.error('Error fetching submissions:', err)
    } finally {
      setLoadingSubmissions(false)
    }
  }, [router, task])

  useEffect(() => {
    if (isSubmissionsOpen) {
      fetchSubmissions()
    }
  }, [fetchSubmissions, isSubmissionsOpen])

  const executeSubmission = useCallback(async (mode: 'run' | 'submit') => {
    if (!task) return
    try {
      if (mode === 'run') {
        setIsRunning(true)
      } else {
        setIsSubmitting(true)
      }
      setLastAction(mode)

      const session = studentAuth.getSession()
      if (!session) {
        router.push('/student/login')
        return
      }

      const response = await fetch('/api/coding-lab-python/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: task.id,
          code,
          studentId: session.id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Gagal menjalankan kode')
      }

      setResult(data as SubmissionResult)
      if (mode === 'submit') {
        setToast({ type: 'success', text: 'Kode berhasil dikumpulkan' })
        fetchSubmissions()
      } else {
        setToast({ type: 'info', text: 'Kode berhasil dijalankan' })
      }
    } catch (err) {
      console.error('Error executing code:', err)
      setError(err instanceof Error ? err.message : 'Gagal menjalankan kode')
    } finally {
      if (mode === 'run') {
        setIsRunning(false)
      } else {
        setIsSubmitting(false)
      }
    }
  }, [code, fetchSubmissions, router, task])

  const handleReset = () => {
    if (!task) return
    setCode(task.starterCode)
    setAutosaveMessage('Kode dikembalikan ke awal')
  }

  const currentTestCase = useMemo(() => task?.testCases.find(tc => tc.id === activeTestCaseId), [task, activeTestCaseId])

  const resultStatus = useMemo(() => {
    if (!result) return null
    const passed = result.summary.passedTests === result.summary.totalTests
    return passed ? 'pass' : 'fail'
  }, [result])

  const headerStatusText = useMemo(() => {
    if (!result) return 'Belum dijalankan'
    const passed = result.summary.passedTests === result.summary.totalTests
    return passed ? 'Semua test lulus' : `${result.summary.passedTests}/${result.summary.totalTests} test lulus`
  }, [result])

  const difficultyBadge = task ? difficultyMeta[task.difficulty] : null

  const renderHints = () => {
    if (!task?.hints || task.hints.length === 0) {
      return <p className="python-problem-note">Belum ada hints untuk tugas ini.</p>
    }

    return (
      <ul className="python-hint-list">
        {task.hints.map((hint, idx) => (
          <li key={idx}>
            <Lightbulb className="h-4 w-4" />
            <span>{hint}</span>
          </li>
        ))}
      </ul>
    )
  }

  const renderOutputPanel = () => {
    if (!result) {
      return (
        <div className="python-output-empty">
          <Terminal className="h-5 w-5" />
          <div>
            <p>Belum ada hasil</p>
            <span>Jalankan kode untuk melihat output test case.</span>
          </div>
        </div>
      )
    }

    const passed = resultStatus === 'pass'
    return (
      <div className={`python-output-result ${passed ? 'is-pass' : 'is-fail'}`}>
        <div className="python-output-summary">
          <div>
            <p>{passed ? 'Semua test lulus' : 'Masih ada test yang gagal'}</p>
            <span>{result.summary.passedTests}/{result.summary.totalTests} test • {result.summary.score} XP</span>
          </div>
          <span className="python-output-chip">
            {passed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {passed ? 'PASS' : 'REVIEW' }
          </span>
        </div>
        <ul className="python-output-tests">
          {result.testResults.map((test, idx) => (
            <li key={test.name + idx} className={test.passed ? 'is-pass' : 'is-fail'}>
              <div>
                {test.passed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <span>{test.name}</span>
              </div>
              <span>{test.passed ? 'Lulus' : 'Perlu revisi'}</span>
            </li>
          ))}
        </ul>
        {!passed && result.testResults.some(test => !test.passed) && (
          <div className="python-output-details">
            {result.testResults.filter(test => !test.passed).map((test, idx) => (
              <div key={`detail-${test.name}-${idx}`} className="python-output-detail">
                <p className="title">{test.name}</p>
                <div className="detail-grid">
                  <div>
                    <span>Input</span>
                    <pre>{test.input}</pre>
                  </div>
                  <div>
                    <span>Expected</span>
                    <pre>{test.expectedOutput}</pre>
                  </div>
                  <div>
                    <span>Output kamu</span>
                    <pre>{test.actualOutput ?? '—'}</pre>
                  </div>
                  {test.error && (
                    <div>
                      <span>Error</span>
                      <pre className="error">{test.error}</pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <StudentLayout>
        <div className="python-loading">
          <div className="spinner" />
          <p>Menyiapkan ruang coding...</p>
        </div>
      </StudentLayout>
    )
  }

  if (!task) {
    return (
      <StudentLayout>
        <div className="python-loading">
          <AlertCircle className="h-5 w-5" />
          <p>Soal tidak ditemukan</p>
        </div>
      </StudentLayout>
    )
  }

  return (
    <StudentLayout>
      <div className={`python-task-page ${isEditorFullscreen ? 'is-editor-fullscreen' : ''}`}>
        <Breadcrumb items={breadcrumbItems} />
        {error && (
          <div className="python-alert">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <p className="font-semibold">Terjadi kesalahan</p>
              <p className="text-sm">{error}</p>
            </div>
            <button type="button" onClick={fetchTask}>Coba lagi</button>
          </div>
        )}

        <div className="python-task-layout">
          <section className="python-problem-panel">
            <button className="python-back" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" /> Kembali
            </button>
            <header className="python-task-header">
              <div>
                <div className="python-task-title">
                  <h1>{task.title}</h1>
                  {difficultyBadge && <span className={difficultyBadge.chip}>{difficultyCopy[task.difficulty]}</span>}
                  <span className="python-task-chip">{task.points} XP</span>
                </div>
                <div className="python-task-meta">
                  <span><Trophy className="h-4 w-4" /> {task.category}</span>
                  <span><Clock className="h-4 w-4" /> {task.timeLimit}s limit</span>
                  <span><Flame className="h-4 w-4" /> {headerStatusText}</span>
                </div>
              </div>
              <button className="python-chip python-chip--clear" onClick={() => setIsSubmissionsOpen(true)}>
                <History className="h-4 w-4" /> Riwayat submit
              </button>
            </header>

            <div className="python-problem-block">
              <div className="block-header">
                <BookIcon />
                <div>
                  <p>Deskripsi</p>
                  <span>Pahami tujuan tugas</span>
                </div>
              </div>
              <p className="python-problem-text">{task.description}</p>
            </div>

            <div className="python-problem-block">
              <div className="block-header">
                <TestTube className="h-4 w-4" />
                <div>
                  <p>Test Case</p>
                  <span>Contoh input/output</span>
                </div>
              </div>
              <div className="python-testcase-tabs">
                {task.testCases.map(test => (
                  <button
                    key={test.id}
                    type="button"
                    onClick={() => setActiveTestCaseId(test.id)}
                    className={`python-testcase-tab ${activeTestCaseId === test.id ? 'is-active' : ''}`}
                  >
                    {test.name}
                    {test.isHidden && <span className="hidden-pill">Hidden</span>}
                  </button>
                ))}
              </div>
              {currentTestCase ? (
                <div className="python-testcase-body">
                  <div>
                    <span>Input</span>
                    <pre>{currentTestCase.input}</pre>
                  </div>
                  <div>
                    <span>Output</span>
                    <pre>{currentTestCase.expectedOutput}</pre>
                  </div>
                </div>
              ) : (
                <p className="python-problem-note">Pilih test case untuk melihat detail.</p>
              )}
            </div>

            <div className="python-problem-block">
              <button className="python-hint-toggle" onClick={() => setShowHints(prev => !prev)}>
                <Lightbulb className="h-4 w-4" />
                <span>Hints</span>
                <ChevronDown className={`h-4 w-4 ${showHints ? 'rotate-180' : ''}`} />
              </button>
              {showHints && (
                <div className="python-hint-panel">
                  {renderHints()}
                </div>
              )}
            </div>
          </section>

          <section className="python-workstation">
            <div className={`python-editor-panel ${isEditorFullscreen ? 'is-fullscreen' : ''}`}>
              <div className="python-editor-toolbar">
                <div>
                  <p>Python 3</p>
                  <span>Gunakan koding terbaikmu</span>
                </div>
                <div className="python-editor-actions">
                  <button onClick={() => setEditorTheme(prev => prev === 'vs-dark' ? 'light' : 'vs-dark')}>
                    {editorTheme === 'vs-dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    {editorTheme === 'vs-dark' ? 'Light' : 'Dark'}
                  </button>
                  <button onClick={handleReset}><RefreshCcw className="h-4 w-4" /> Reset</button>
                  <button onClick={() => setIsEditorFullscreen(prev => !prev)}>
                    {isEditorFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    {isEditorFullscreen ? 'Keluar' : 'Fullscreen'}
                  </button>
                </div>
              </div>

              <div className="python-editor-shell">
                <Editor
                  key={editorKey}
                  language="python"
                  theme={editorTheme}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  onMount={(editor) => {
                    editorRef.current = editor
                  }}
                  options={{
                    minimap: { enabled: false },
                    fontFamily: 'JetBrains Mono, Fira Code, monospace',
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    automaticLayout: true
                  }}
                  height="480px"
                />
              </div>

              <div className="python-editor-footer">
                <span>{autosaveMessage}</span>
                <div>
                  <button
                    type="button"
                    className="python-run-btn"
                    onClick={() => executeSubmission('run')}
                    disabled={isRunning}
                  >
                    {isRunning ? <Loader /> : <Play className="h-4 w-4" />}
                    {isRunning ? 'Running...' : 'Run Code'}
                  </button>
                  <button
                    type="button"
                    className="python-submit-btn"
                    onClick={() => executeSubmission('submit')}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader /> : <CheckCircle2 className="h-4 w-4" />}
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            </div>

            <div className="python-output-panel">
              <div className="python-output-header">
                <div>
                  <p>Output & Result</p>
                  <span>{lastAction ? `Terakhir: ${lastAction === 'run' ? 'Run code' : 'Submit'}` : 'Belum ada eksekusi'}</span>
                </div>
                <button onClick={() => setResult(null)} className="python-chip python-chip--clear">
                  Bersihkan
                </button>
              </div>
              {renderOutputPanel()}
            </div>
          </section>
        </div>
      </div>

      {isSubmissionsOpen && (
        <div className="python-submissions-overlay">
          <div className="python-submissions-panel">
            <header>
              <div>
                <p>Riwayat Submit</p>
                <span>{task.title}</span>
              </div>
              <button onClick={() => setIsSubmissionsOpen(false)}>
                <XCircle className="h-4 w-4" />
              </button>
            </header>
            {loadingSubmissions ? (
              <div className="python-loading">
                <div className="spinner" />
                <p>Memuat riwayat...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="python-empty-state">
                <History className="h-6 w-6" />
                <p>Belum ada submission</p>
              </div>
            ) : (
              <ul className="python-submission-list">
                {submissions.map(item => (
                  <li key={item.id}>
                    <div>
                      <p>Skor {item.score}/{item.task.points}</p>
                      <span>{new Date(item.submittedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                    <span>{item.passedTests}/{item.totalTests} test</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div className={`python-toast ${toast.type === 'success' ? 'python-toast--success' : 'python-toast--info'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <Terminal className="h-4 w-4" />}
          <span>{toast.text}</span>
        </div>
      )}
    </StudentLayout>
  )
}

const BookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4H18V20H6V4Z" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 8H18" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const Loader = () => <span className="python-btn-loader" />
