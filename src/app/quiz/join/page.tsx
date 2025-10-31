"use client";

import { FormEvent, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Landmark, Trophy, Users, Loader2, ScanSearch } from "lucide-react";
import {
  saveParticipantSession,
  type StoredParticipantSession,
} from "@/lib/quiz/client-storage";

type JoinResponse = {
  participant: {
    id: string;
    displayName: string;
    sessionId: string;
    studentId?: string | null;
  };
  session: {
    id: string;
    code: string;
    status: string;
    mode: string;
  };
};

function normaliseCode(code: string): string {
  return code
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 8);
}

function QuizJoinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codeFromQuery = searchParams?.get("code") ?? "";
  const [code, setCode] = useState(() => normaliseCode(codeFromQuery));
  const [displayName, setDisplayName] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isReady = useMemo(() => code.length >= 4 && displayName.trim().length >= 2, [code, displayName]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isReady || joining) {
      return;
    }

    setJoining(true);
    setError(null);

    try {
      const response = await fetch(`/api/sessions/${code}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: displayName.trim(),
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || "Gagal bergabung ke sesi. Silakan coba ulang.");
      }

      const data = (await response.json()) as JoinResponse;
      const payload: StoredParticipantSession = {
        participantId: data.participant.id,
        displayName: data.participant.displayName,
        sessionId: data.session.id,
        studentId: data.participant.studentId ?? undefined,
        joinedAt: new Date().toISOString(),
      };

      saveParticipantSession(code, payload);
      router.replace(`/quiz/play/${code}`);
    } catch (joinError) {
      console.error(joinError);
      setError(joinError instanceof Error ? joinError.message : "Terjadi kesalahan tak terduga.");
    } finally {
      setJoining(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-blue-200 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Kembali
          </Link>
          <div className="flex items-center gap-2 text-sm text-blue-200">
            <Landmark className="h-4 w-4" aria-hidden="true" />
            GEMA Quiz Arena
          </div>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl flex-col items-center justify-center px-6 py-12">
        <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-blue-950/40 backdrop-blur">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-200">
              <Users className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-blue-200">Mulai</p>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">Gabung ke Live Quiz</h1>
            </div>
          </div>

          <form className="grid gap-6" onSubmit={handleSubmit} noValidate>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-blue-100">
                Kode Sesi <span className="text-blue-300">(biasanya 6 karakter)</span>
              </span>
              <div className="relative">
                <input
                  type="text"
                  value={code}
                  onChange={(event) => setCode(normaliseCode(event.target.value))}
                  inputMode="text"
                  pattern="[A-Z0-9]{4,8}"
                  placeholder="Misal: GMA123"
                  className="w-full rounded-2xl border border-white/20 bg-slate-900/70 px-5 py-4 text-lg font-mono tracking-[0.35em] text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  aria-describedby="code-help"
                  required
                />
                <ScanSearch className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-300" aria-hidden="true" />
              </div>
              <p id="code-help" className="text-sm text-blue-200">
                Host akan membagikan kode ini saat memulai sesi.
              </p>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-blue-100">Nama Tampilan</span>
              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Nama kamu di leaderboard"
                minLength={2}
                maxLength={60}
                className="w-full rounded-2xl border border-white/20 bg-slate-900/70 px-5 py-4 text-lg text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                required
              />
            </label>

            {error && (
              <div
                role="alert"
                className="rounded-2xl border border-red-400/60 bg-red-500/10 px-4 py-3 text-sm text-red-100"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-blue-500 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 disabled:cursor-not-allowed disabled:bg-blue-500/40"
              disabled={!isReady || joining}
            >
              {joining ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  Menghubungkan...
                </>
              ) : (
                <>
                  <Trophy className="h-5 w-5" aria-hidden="true" />
                  Gabung Sekarang
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-12 grid w-full gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-blue-50 shadow-inner shadow-blue-900/20 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/30">
              <Trophy className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold text-white">Tips Cepat</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-blue-100">
                <li>Gunakan nama tampilan yang mudah dikenali agar host dapat melacak skor kamu.</li>
                <li>Kode sesi tidak membedakan huruf besar kecil; tetap pastikan tidak ada spasi.</li>
                <li>Poin dan peringkat akan diperbarui otomatis selama kuis berlangsung.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function QuizJoinPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-900">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    }>
      <QuizJoinContent />
    </Suspense>
  );
}
