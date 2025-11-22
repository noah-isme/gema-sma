'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, Compass, BookOpenCheck, Rocket } from 'lucide-react'
import { studentAuth } from '@/lib/student-auth'

const steps = [
  {
    icon: Sparkles,
    title: 'Selamat datang ✨',
    description: 'Akunmu berhasil dibuat. Mari kenali ekosistem GEMA dan manfaatkan semua fitur belajar.'
  },
  {
    icon: Compass,
    title: 'Pilih preferensi belajar',
    description: 'Tandai bidang favoritmu seperti Web, Mobile, AI, atau Robotika untuk rekomendasi konten.'
  },
  {
    icon: BookOpenCheck,
    title: 'Kenali fitur inti',
    description: 'Pelajari cara mengerjakan materi, quiz, dan pelaporan progres langsung dari dashboard.'
  }
]

export default function StudentOnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Give a small delay to ensure session is loaded from localStorage
    const checkSession = () => {
      const session = studentAuth.getSession()
      console.log('[Onboarding] Session check:', session ? session.studentId : 'NO SESSION')
      
      if (!session) {
        console.log('[Onboarding] No session found, redirecting to login')
        router.push('/student/login')
        return
      }
      
      console.log('[Onboarding] Session valid:', session.studentId)
      setLoading(false)
    }

    // Small delay to ensure localStorage is ready
    const timer = setTimeout(checkSession, 100)
    return () => clearTimeout(timer)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7ff] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat onboarding...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7ff] py-16 px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-200 opacity-60 blur-[140px]"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 rounded-full bg-purple-200 opacity-50 blur-[180px]"></div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 text-blue-600 shadow-[0_25px_70px_rgba(15,23,42,0.15)]">
            <Rocket className="h-8 w-8" />
          </div>
          <p className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-500">
            Onboarding Siswa
          </p>
          <h1 className="text-4xl font-semibold text-slate-900">Selamat datang di GEMA!</h1>
          <p className="mt-3 text-lg text-slate-500">
            Kami siapkan langkah cepat agar kamu langsung nyaman menggunakan materi dan fitur belajar digital SMA Wahidiyah.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1, duration: 0.3 }}
              className="rounded-3xl border border-white/50 bg-white/80 p-6 text-center shadow-[0_25px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl border border-indigo-200/50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-[0_30px_80px_rgba(79,70,229,0.35)]"
        >
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Langkah selanjutnya</h2>
              <p className="mt-2 text-sm text-white/80">
                Akun kamu sudah siap! Klik tombol di bawah untuk mulai menggunakan GEMA.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-blue-600 shadow-lg"
                onClick={() => router.push('/student/dashboard-simple')}
              >
                Menuju Dashboard GEMA →
              </motion.button>
              <Link
                href="/student/learning-path"
                className="inline-flex items-center justify-center rounded-2xl bg-white/20 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/30"
              >
                Lihat Learning Path
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
