"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Copy,
  Flame,
  Loader2,
  Play,
  ShieldCheck,
  StopCircle,
  Users,
} from "lucide-react";
import clsx from "clsx";

type QuizQuestionType =
  | "MULTIPLE_CHOICE"
  | "MULTI_SELECT"
  | "TRUE_FALSE"
  | "SHORT_ANSWER"
  | "NUMERIC"
  | "SCALE";

type HostSessionResponse = {
  session: {
    id: string;
    code: string;
    mode: "LIVE" | "HOMEWORK";
    status: "DRAFT" | "SCHEDULED" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";
    title: string | null;
    description: string | null;
    currentQuestionId: string | null;
    currentQuestionStartedAt: string | null;
    startedAt: string | null;
    finishedAt: string | null;
    scheduledStart: string | null;
    scheduledEnd: string | null;
    homeworkWindowStart: string | null;
    homeworkWindowEnd: string | null;
  };
  quiz: {
    id: string;
    title: string;
    description: string | null;
    defaultPoints: number;
    questions: HostQuestion[];
  };
  leaderboard: Array<{
    id: string;
    rank: number;
    displayName: string;
    score: number;
    accuracy: number | null;
    responseCount: number;
    joinedAt: string;
  }>;
  currentQuestion: HostQuestion | null;
  isHostView: boolean;
};

type HostQuestion = {
  id: string;
  order: number;
  prompt: string;
  type: QuizQuestionType;
  options?: unknown;
  correctAnswers?: unknown;
  explanation?: string | null;
  competencyTag?: string | null;
  points: number;
  timeLimitSeconds?: number | null;
};

const HOST_REFRESH_INTERVAL_MS = 3000;

function parseOptions(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((entry) => (typeof entry === "string" ? entry : JSON.stringify(entry)));
  }
  if (typeof raw === "object") {
    return Object.entries(raw as Record<string, unknown>).map(([key, value]) =>
      typeof value === "string" ? `${key}. ${value}` : key
    );
  }
  return [String(raw)];
}

export default function HostSessionPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const code = Array.isArray(params.code) ? params.code[0] : params.code;

  const [data, setData] = useState<HostSessionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  const currentQuestion = data?.currentQuestion ?? null;
  const questions = data?.quiz.questions ?? [];

  const nextQuestion = useMemo(() => {
    if (!currentQuestion) {
      return questions[0] ?? null;
    }
    return questions.find((question) => question.order > currentQuestion.order) ?? null;
  }, [questions, currentQuestion]);

  const currentQuestionOptions = useMemo(
    () => (currentQuestion ? parseOptions(currentQuestion.options) : []),
    [currentQuestion]
  );

  const participantsJoined = data?.leaderboard.length ?? 0;

  const refreshSession = useCallback(
    async (signal?: AbortSignal) => {
      if (!code) return;

      try {
        const response = await fetch(`/api/sessions/${code}`, { cache: "no-store", signal });

        if (response.status === 401) {
          router.replace("/admin/login?redirect=/quiz/host/" + code);
          return;
        }

        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as { error?: string };
          throw new Error(body.error || "Gagal memuat sesi.");
        }

        const body = (await response.json()) as HostSessionResponse;
        if (!body.isHostView) {
          throw new Error("Anda tidak memiliki akses sebagai host.");
        }

        setData(body);
      } catch (fetchError) {
        if ((fetchError as Error).name === "AbortError") {
          return;
        }
        console.error(fetchError);
        setError(fetchError instanceof Error ? fetchError.message : "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    },
    [code, router]
  );

  useEffect(() => {
    if (!code) return;
    const controller = new AbortController();
    refreshSession(controller.signal);
    return () => controller.abort();
  }, [code, refreshSession]);

  useEffect(() => {
    if (!code) return;
    const intervalId = window.setInterval(() => {
      refreshSession().catch((error) => console.error("Failed refreshing host view", error));
    }, HOST_REFRESH_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [code, refreshSession]);

  async function triggerHostAction(path: "start" | "next" | "finish") {
    if (!code) return;
    setActionLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/sessions/${code}/${path}`, { method: "POST" });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || "Aksi host gagal dijalankan.");
      }
      await refreshSession();
    } catch (actionError) {
      console.error(actionError);
      setError(actionError instanceof Error ? actionError.message : "Gagal mengirim perintah host.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCopyCode() {
    if (!data?.session.code || copyState === "copied") return;
    try {
      await navigator.clipboard.writeText(data.session.code);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2000);
    } catch (copyError) {
      console.warn(copyError);
    }
  }

  return (
    <div className="min-h-screen bg-[#040612] text-white">
      <header className="border-b border-white/10 bg-[#040612]/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-blue-200 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Dashboard Admin
          </Link>

          <div className="flex items-center gap-6">
            <button
              onClick={handleCopyCode}
              className={clsx(
                "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
                copyState === "copied"
                  ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-100"
                  : "border-blue-400/40 bg-blue-500/10 text-blue-100 hover:border-blue-400/60 hover:bg-blue-500/20"
              )}
            >
              {copyState === "copied" ? (
                <>
                  <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
                  Kode disalin
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  {data?.session.code ?? code ?? "—"}
                </>
              )}
            </button>

            <div className="rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-blue-100">
              {data?.session.status ?? "MEMUAT"}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-blue-950/40 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-blue-200">Host Control</p>
                <h1 className="text-3xl font-semibold text-white">{data?.quiz.title ?? "Memuat sesi..."}</h1>
                <p className="mt-1 text-sm text-blue-200">{data?.quiz.description}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <ControlButton
                  icon={Play}
                  label="Mulai"
                  disabled={!data || data.session.status === "ACTIVE" || data.session.status === "COMPLETED"}
                  tone="emerald"
                  loading={actionLoading}
                  onClick={() => triggerHostAction("start")}
                />
                <ControlButton
                  icon={ChevronRight}
                  label="Pertanyaan berikutnya"
                  disabled={!data || !nextQuestion || data.session.status !== "ACTIVE"}
                  tone="blue"
                  loading={actionLoading}
                  onClick={() => triggerHostAction("next")}
                />
                <ControlButton
                  icon={StopCircle}
                  label="Akhiri sesi"
                  disabled={!data || data.session.status === "COMPLETED"}
                  tone="rose"
                  loading={actionLoading}
                  onClick={() => triggerHostAction("finish")}
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex min-h-[220px] items-center justify-center text-blue-200">
                <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
              </div>
            ) : (
              <div className="mt-8 grid gap-6">
                <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <header className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-blue-200">Pertanyaan aktif</p>
                      <h2 className="text-2xl font-semibold text-white">
                        {currentQuestion ? `#${currentQuestion.order + 1}` : "Belum dimulai"}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100">
                      <Flame className="h-4 w-4" aria-hidden="true" />
                      {participantsJoined} Peserta
                    </div>
                  </header>

                  {currentQuestion ? (
                    <article className="mt-4 space-y-4 text-blue-100">
                      <p className="text-lg font-medium leading-relaxed text-white">{currentQuestion.prompt}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-blue-200">
                        <span className="rounded-full border border-blue-400/40 px-3 py-1">
                          {currentQuestion.type.replaceAll("_", " ")}
                        </span>
                        <span className="rounded-full border border-blue-400/40 px-3 py-1">
                          {currentQuestion.points} poin
                        </span>
                        {currentQuestion.competencyTag && (
                          <span className="rounded-full border border-blue-400/40 px-3 py-1">
                            Kompetensi: {currentQuestion.competencyTag}
                          </span>
                        )}
                      </div>

                      {currentQuestionOptions.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-blue-200">Pilihan jawaban</p>
                          <ul className="mt-2 space-y-2 text-sm text-blue-100">
                            {currentQuestionOptions.map((option) => (
                              <li key={option} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                                {option}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {!!currentQuestion.correctAnswers && (
                        <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                          <p className="font-semibold">Kunci Jawaban</p>
                          <pre className="mt-1 whitespace-pre-wrap text-emerald-200">
                            {JSON.stringify(currentQuestion.correctAnswers, null, 2)}
                          </pre>
                        </div>
                      )}
                    </article>
                  ) : (
                    <div className="mt-6 rounded-2xl border border-dashed border-white/20 p-8 text-center text-sm text-blue-200">
                      Tekan <span className="font-semibold text-blue-100">Mulai</span> untuk memulai sesi atau lanjutkan ke pertanyaan berikutnya.
                    </div>
                  )}
                </section>

                <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <header className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">Pertanyaan Berikutnya</h3>
                    <span className="text-sm text-blue-200">{nextQuestion ? `#${nextQuestion.order + 1}` : "Selesai"}</span>
                  </header>
                  {nextQuestion ? (
                    <div className="mt-4 space-y-3 text-sm text-blue-100">
                      <p className="font-semibold text-white">{nextQuestion.prompt}</p>
                      <p>Tipe: {nextQuestion.type.replaceAll("_", " ")}</p>
                      <p>Poin: {nextQuestion.points}</p>
                    </div>
                  ) : (
                    <p className="mt-4 rounded-2xl border border-dashed border-white/20 p-4 text-center text-sm text-blue-200">
                      Tidak ada pertanyaan lanjutan. Kamu bisa mengakhiri sesi kapan saja.
                    </p>
                  )}
                </section>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-blue-900/20">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Leaderboard</h2>
                <p className="text-sm text-blue-200">10 peserta teratas ter-update otomatis</p>
              </div>
              <BarChart3 className="h-5 w-5 text-amber-300" aria-hidden="true" />
            </header>

            <div className="mt-4 space-y-3">
              {data?.leaderboard.slice(0, 10).map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-white">{entry.rank}</span>
                    <div>
                      <p className="font-semibold text-white">{entry.displayName}</p>
                      <p className="text-xs text-blue-200">
                        Skor {Math.round(entry.score)} • Akurasi{" "}
                        {entry.accuracy == null ? "—" : `${Math.round(entry.accuracy * 100)}%`}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-blue-200">{entry.responseCount} jawaban</span>
                </motion.div>
              ))}

              {participantsJoined === 0 && (
                <p className="rounded-2xl border border-dashed border-white/20 p-4 text-center text-sm text-blue-200">
                  Belum ada peserta. Bagikan kode sesi untuk mulai.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-blue-200">
            <h3 className="text-base font-semibold text-white">Catatan Host</h3>
            <ul className="mt-3 space-y-2">
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-1 h-4 w-4 text-emerald-300" aria-hidden="true" />
                Gunakan tombol Mulai untuk mengaktifkan pertanyaan pertama. Tombol Next akan otomatis menandai pertanyaan berikutnya.
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-1 h-4 w-4 text-emerald-300" aria-hidden="true" />
                Mode LIVE memerlukan host memajukan soal, sedangkan mode HOMEWORK berjalan sesuai jendela waktu.
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-1 h-4 w-4 text-emerald-300" aria-hidden="true" />
                Gunakan leaderboard untuk memantau performa dan tindak lanjuti peserta yang tidak aktif.
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}

type ControlButtonProps = {
  icon: typeof Play;
  label: string;
  tone: "blue" | "emerald" | "rose";
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
};

function ControlButton({ icon: Icon, label, tone, disabled, loading, onClick }: ControlButtonProps) {
  const toneClass = {
    blue: "border-blue-400/40 bg-blue-500/10 text-blue-100 hover:border-blue-400/60 hover:bg-blue-500/20",
    emerald: "border-emerald-400/40 bg-emerald-500/10 text-emerald-100 hover:border-emerald-400/60 hover:bg-emerald-500/20",
    rose: "border-rose-400/40 bg-rose-500/10 text-rose-100 hover:border-rose-400/60 hover:bg-rose-500/20",
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        "flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 disabled:cursor-not-allowed disabled:border-white/20 disabled:bg-white/10 disabled:text-blue-100/60",
        toneClass
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Icon className="h-4 w-4" aria-hidden="true" />
      )}
      {label}
    </button>
  );
}
