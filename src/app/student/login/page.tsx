"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, User, GraduationCap, Laptop, Sparkles, AlertCircle, Loader2, Shield } from 'lucide-react'
import { Toast } from '@/components/feedback/toast'
import { studentAuth } from '@/lib/student-auth'
import { useAnimatedAuthBackground } from '@/hooks/useAnimatedAuthBackground'

const inputWrapperStyles = (isFocused: boolean) =>
  `rounded-3xl border-2 bg-white/85 px-5 py-4 transition-all duration-200 shadow-[0_20px_50px_rgba(15,23,42,0.08)] ${
    isFocused
      ? 'border-blue-500 shadow-[0_30px_70px_rgba(59,130,246,0.25)] bg-white'
      : 'border-transparent'
  }`

const placeholderClass = 'placeholder:text-slate-400'

export default function StudentLoginPage() {
  useAnimatedAuthBackground()
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [error, setError] = useState('')
  const [errorWave, setErrorWave] = useState(0)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({ show: false, message: '', type: 'info' })

  useEffect(() => {
    const existingSession = studentAuth.getSession()
    if (existingSession) {
      window.location.replace('/student/dashboard-simple')
    }
  }, [])

  const raiseError = (message: string) => {
    setError(message)
    setErrorWave(prev => prev + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setLoadingMessage('Memeriksa kredensial siswa...')

    try {
      setToast({
        show: true,
        message: 'Memeriksa kredensial siswa...',
        type: 'info'
      })

      const response = await fetch('/api/auth/student-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          password,
        }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const authResult = await response.json()

      if (!authResult.success) {
        raiseError('NIS/username atau password salah. Silakan periksa data Anda.')
        setToast({
          show: true,
          message: 'Login gagal! Periksa NIS/username dan password Anda.',
          type: 'error'
        })
        setIsLoading(false)
        setLoadingMessage('')
        return
      }

      studentAuth.setSession({
        id: authResult.student.id,
        studentId: authResult.student.studentId || studentId,
        fullName: authResult.student.fullName || authResult.student.name || 'Student',
        class: authResult.student.class || authResult.student.className || 'Unknown',
        email: authResult.student.email || ''
      })

      setLoadingMessage('Login berhasil! Membuka dashboard...')
      setToast({
        show: true,
        message: '🎉 Selamat datang kembali! Menyiapkan dashboard...',
        type: 'success'
      })

      const urlParams = new URLSearchParams(window.location.search)
      const redirectTo = urlParams.get('redirect') || '/student/dashboard-simple'

      setTimeout(() => {
        setIsTransitioning(true)
        setTimeout(() => {
          window.location.replace(redirectTo)
        }, 220)
      }, 700)
    } catch (err) {
      console.error('Student login error:', err)
      raiseError('NIS atau password salah. Silakan periksa data Anda.')
      setToast({
        show: true,
        message: 'Login gagal! Periksa NIS dan password Anda.',
        type: 'error'
      })
      setIsLoading(false)
      setLoadingMessage('')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden auth-gradient-bg py-12 px-4">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        duration={4000}
      />

      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-50 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          />
        )}
      </AnimatePresence>

      <div className="auth-background-blobs">
        <div className="auth-blob blob-1"></div>
        <div className="auth-blob blob-2"></div>
        <div className="auth-blob blob-3"></div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-blue-200/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-500"
        >
          <Sparkles className="h-4 w-4" /> Mode Premium Login
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="w-full max-w-lg rounded-[32px] border border-white/60 bg-white/80 p-10 text-center shadow-[0_30px_80px_rgba(15,23,42,0.15)] backdrop-blur-2xl"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-[0_15px_45px_rgba(15,23,42,0.12)]">
            <Image src="/gema.svg" alt="Logo GEMA" width={52} height={52} className="h-12 w-12" priority />
          </div>
          <h1 className="text-3xl font-semibold text-slate-900">Masuk Siswa</h1>
          <p className="mt-2 text-base text-slate-500">Akses materi dan tugas belajar dengan satu klik.</p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 flex items-center justify-center gap-3 rounded-2xl bg-indigo-50/80 px-4 py-3 text-sm text-indigo-700"
          >
            <Laptop className="h-5 w-5" />
            <span>Belajar terasa seperti platform coding premium.</span>
          </motion.div>

          <AnimatePresence>
            {loadingMessage && (
              <motion.div
                key={loadingMessage}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-6 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/90 px-4 py-3 text-sm text-blue-700"
              >
                <Loader2 className="h-4 w-4 animate-spin" /> {loadingMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6 text-left">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="studentId" className="text-sm font-semibold text-slate-800">
                  NIS / Username
                </label>
                <span className="text-xs text-slate-400">Gunakan NIS atau username.</span>
              </div>
              <div className={inputWrapperStyles(focusedField === 'studentId')}>
                <div className="flex items-center gap-3">
                  <motion.span
                    animate={{ y: focusedField === 'studentId' ? -2 : 0, scale: focusedField === 'studentId' ? 1.05 : 1 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl bg-slate-100 p-3 text-slate-500"
                  >
                    <User className="h-[18px] w-[18px]" />
                  </motion.span>
                  <input
                    type="text"
                    id="studentId"
                    value={studentId}
                    autoComplete="username"
                    onChange={e => setStudentId(e.target.value)}
                    onFocus={() => setFocusedField('studentId')}
                    onBlur={() => setFocusedField(prev => (prev === 'studentId' ? null : prev))}
                    required
                    disabled={isLoading}
                    placeholder="NIS atau username kamu"
                    className={`w-full rounded-2xl bg-transparent text-base font-medium text-slate-900 outline-none ${placeholderClass}`}
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-slate-800">
                  Password
                </label>
                <span className="text-xs text-slate-400">Minimal 8 karakter.</span>
              </div>
              <div className={inputWrapperStyles(focusedField === 'password')}>
                <div className="flex items-center gap-3">
                  <motion.span
                    animate={{ y: focusedField === 'password' ? -2 : 0, scale: focusedField === 'password' ? 1.05 : 1 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl bg-slate-100 p-3 text-slate-500"
                  >
                    <Shield className="h-[18px] w-[18px]" />
                  </motion.span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    autoComplete="current-password"
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(prev => (prev === 'password' ? null : prev))}
                    required
                    disabled={isLoading}
                    placeholder="Masukkan password"
                    className={`w-full rounded-2xl bg-transparent text-base font-medium text-slate-900 outline-none ${placeholderClass}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="text-slate-400 transition hover:text-slate-600"
                    disabled={isLoading}
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Gunakan kombinasi huruf dan angka agar akunmu lebih aman.
              </p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  key={errorWave}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    x: [-4, 4, -3, 3, -2, 2, 0]
                  }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2 rounded-2xl border border-rose-100 bg-rose-50/90 px-4 py-3 text-sm text-rose-600"
                >
                  <AlertCircle className="h-4 w-4" /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ y: isLoading ? 0 : -2 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              animate={{ backgroundPosition: isLoading ? '0% 0%' : '100% 0%' }}
              transition={{
                backgroundPosition: { duration: 1.2, repeat: isLoading ? 0 : Infinity, repeatType: 'reverse', ease: 'linear' }
              }}
              className="flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-lg font-semibold text-white shadow-[0_25px_60px_rgba(79,70,229,0.35)] transition disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                backgroundImage: 'linear-gradient(90deg, #2563eb, #7c3aed, #2563eb)',
                backgroundSize: '200% auto'
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Memeriksa akun...
                </>
              ) : (
                <>
                  <GraduationCap className="h-5 w-5" />
                  Masuk Siswa
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 space-y-2 text-sm text-slate-600">
            <p className="text-[13px] text-slate-600">
              Belum punya akun?
              <Link href="/student/register" className="ml-1 font-semibold text-blue-600 transition hover:text-blue-700">
                Daftar sekarang
              </Link>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-[12px] text-slate-500">
              <Link href="/admin/login" className="font-medium text-indigo-600 transition hover:text-indigo-700">
                Login sebagai admin
              </Link>
              <span className="text-slate-400">•</span>
              <Link href="/" className="transition hover:text-slate-700">
                Kembali ke beranda
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
