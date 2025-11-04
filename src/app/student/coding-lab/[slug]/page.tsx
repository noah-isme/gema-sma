'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import StudentLayout from '@/components/student/StudentLayout';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { studentAuth } from '@/lib/student-auth';
import { 
  Code2, 
  Play, 
  Trophy, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowLeft,
  Lightbulb,
  TestTube
} from 'lucide-react';

// Dynamically import Monaco Editor to avoid SSR issues
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  points: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
  points: number;
  timeLimit: number;
  starterCode: string;
  hints: string[] | null;
  testCases: TestCase[];
}

interface TestResult {
  name: string;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string | null;
  error: string | null;
  time: string | null;
  memory: number | null;
}

interface SubmissionResult {
  success: boolean;
  testResults: TestResult[];
  summary: {
    passedTests: number;
    totalTests: number;
    score: number;
    percentage: number;
  };
}

interface PreviousSubmission {
  id: string;
  code: string;
  score: number;
  passedTests: number;
  totalTests: number;
  status: string;
  submittedAt: string;
  task: {
    points: number;
  };
}

const difficultyColors = {
  EASY: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  HARD: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function PythonCodingTaskPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || '';
  
  const [task, setTask] = useState<Task | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [activeTab, setActiveTab] = useState<'problem' | 'submissions'>('problem');
  const [submissions, setSubmissions] = useState<PreviousSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [slug]);

  useEffect(() => {
    if (activeTab === 'submissions' && task) {
      fetchSubmissions();
    }
  }, [activeTab, task]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      
      // Get student session from custom auth
      const session = studentAuth.getSession();
      if (!session) {
        router.push('/student/login');
        return;
      }

      const response = await fetch(`/api/coding-lab-python/tasks/${slug}?studentId=${session.id}`);
      const data = await response.json();

      if (response.ok) {
        setTask(data.task);
        setCode(data.task.starterCode);
      } else {
        console.error('Failed to fetch task:', data.error);
      }
    } catch (error) {
      console.error('Error fetching task:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    if (!task) return;

    try {
      setLoadingSubmissions(true);
      
      const session = studentAuth.getSession();
      if (!session) {
        router.push('/student/login');
        return;
      }

      const response = await fetch(`/api/coding-lab-python/submissions?taskId=${task.id}&studentId=${String(session.id)}`);
      const data = await response.json();

      if (response.ok) {
        setSubmissions(data.submissions || []);
      } else {
        console.error('Failed to fetch submissions:', data.error);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleSubmit = async () => {
    if (!task) return;

    try {
      setSubmitting(true);
      setResult(null);

      // Get student session from custom auth
      const session = studentAuth.getSession();
      if (!session) {
        router.push('/student/login');
        return;
      }

      const response = await fetch('/api/coding-lab-python/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: task.id,
          code,
          studentId: session.id, // Add studentId
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        // Refresh submissions after successful submit
        fetchSubmissions();
      } else {
        alert(`Error: ${data.message || data.error}`);
      }
    } catch (error) {
      console.error('Error submitting code:', error);
      alert('Gagal mengirim kode. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    if (task && confirm('Reset kode ke template awal?')) {
      setCode(task.starterCode);
      setResult(null);
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/student/dashboard' },
    { label: 'Coding Lab', href: '/student/coding-lab' },
    { label: task?.title || 'Loading...', href: `/student/coding-lab/${slug}` },
  ];

  if (!task) {
    return (
      <StudentLayout loading={loading}>
        <div className="text-center py-20">
          <p className="text-gray-600 dark:text-gray-400">Task tidak ditemukan</p>
          <button
            onClick={() => router.push('/student/coding-lab')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Kembali ke daftar
          </button>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout loading={loading}>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => router.push('/student/coding-lab')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {task.title}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[task.difficulty]}`}>
                  {task.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  {task.points} poin
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {task.timeLimit}s batas waktu
                </span>
                <span className="capitalize">{task.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Problem Description */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('problem')}
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'problem'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  Deskripsi
                </button>
                <button
                  onClick={() => setActiveTab('submissions')}
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'submissions'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  Submission
                </button>
              </div>

              {activeTab === 'problem' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Deskripsi Soal
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {task.description}
                    </p>
                  </div>

                  {/* Test Cases Preview */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <TestTube className="w-5 h-5" />
                      Contoh Test Case
                    </h3>
                    <div className="space-y-3">
                      {task.testCases.filter(tc => !tc.isHidden).map((tc, idx) => (
                        <div key={tc.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                          <p className="font-medium text-gray-900 dark:text-white mb-2">
                            {tc.name || `Test Case ${idx + 1}`}
                          </p>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Input:</span>
                              <pre className="mt-1 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                {tc.input}
                              </pre>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Expected Output:</span>
                              <pre className="mt-1 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                {tc.expectedOutput}
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hints */}
                  {task.hints && task.hints.length > 0 && (
                    <div>
                      <button
                        onClick={() => setShowHints(!showHints)}
                        className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 dark:text-yellow-500 dark:hover:text-yellow-400"
                      >
                        <Lightbulb className="w-5 h-5" />
                        {showHints ? 'Sembunyikan' : 'Tampilkan'} Hints
                      </button>
                      {showHints && (
                        <div className="mt-3 space-y-2">
                          {task.hints.map((hint, idx) => (
                            <div key={idx} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                💡 {hint}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'submissions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Riwayat Submission
                    </h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Total: {submissions.length} submission
                    </span>
                  </div>

                  {loadingSubmissions ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">Loading submissions...</p>
                    </div>
                  ) : submissions.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-400">Belum ada submission</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        Submit kode Anda untuk melihat riwayat
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {submissions.map((submission, idx) => (
                        <div
                          key={submission.id}
                          className={`p-4 rounded-lg border ${
                            submission.status === 'COMPLETED'
                              ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                              : submission.status === 'RUNTIME_ERROR'
                              ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                              : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {submission.status === 'COMPLETED' && submission.passedTests === submission.totalTests ? (
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                              ) : submission.status === 'COMPLETED' ? (
                                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                              )}
                              <span className="font-medium text-gray-900 dark:text-white">
                                Submission #{submissions.length - idx}
                              </span>
                            </div>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                              {submission.score}/{submission.task.points}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Status:</span>
                              <span className={`ml-2 font-medium ${
                                submission.status === 'COMPLETED' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                              }`}>
                                {submission.status === 'COMPLETED' ? '✓ Completed' : '✗ Error'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Test Cases:</span>
                              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                {submission.passedTests}/{submission.totalTests} passed
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-600 dark:text-gray-400">Waktu:</span>
                              <span className="ml-2 text-gray-900 dark:text-white">
                                {new Date(submission.submittedAt).toLocaleString('id-ID', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>

                          <details className="cursor-pointer">
                            <summary className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                              Lihat Kode
                            </summary>
                            <pre className="mt-2 p-3 bg-gray-900 text-gray-100 rounded text-xs overflow-x-auto">
                              {submission.code}
                            </pre>
                          </details>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5" />
                  Python Editor
                </h3>
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  Reset
                </button>
              </div>
              <div className="h-[400px]">
                <Editor
                  height="100%"
                  defaultLanguage="python"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Menjalankan...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Jalankan & Submit
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Hasil Eksekusi
                </h3>
                
                {/* Summary */}
                <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Skor:</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {result.summary.score}/{task.points}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Test Cases:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {result.summary.passedTests}/{result.summary.totalTests} passed ({result.summary.percentage}%)
                    </span>
                  </div>
                </div>

                {/* Test Results */}
                <div className="space-y-3">
                  {result.testResults.map((test, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border ${
                        test.passed
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {test.passed ? (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        )}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {test.name}
                        </span>
                      </div>
                      
                      {!test.passed && (
                        <div className="space-y-2 text-sm">
                          {test.error && (
                            <div>
                              <span className="font-medium text-red-700 dark:text-red-300">Error:</span>
                              <pre className="mt-1 p-2 bg-red-100 dark:bg-red-900/30 rounded text-red-800 dark:text-red-200 overflow-x-auto">
                                {test.error}
                              </pre>
                            </div>
                          )}
                          {test.actualOutput && (
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Output Anda:</span>
                              <pre className="mt-1 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto">
                                {test.actualOutput}
                              </pre>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Expected:</span>
                            <pre className="mt-1 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto">
                              {test.expectedOutput}
                            </pre>
                          </div>
                        </div>
                      )}
                      
                      {test.time && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                          ⏱️ Waktu: {test.time}s
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
