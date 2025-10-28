"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  CheckCircle2,
  CircleDot,
  Gauge,
  Loader2,
  MessageCircle,
  Radio,
  RefreshCcw,
  Timer,
  Undo2,
  XCircle,
} from "lucide-react";
import clsx from "clsx";
import { clearParticipantSession, readParticipantSession, saveParticipantSession } from "@/lib/quiz/client-storage";

type QuizQuestionType =
  | "MULTIPLE_CHOICE"
  | "MULTI_SELECT"
  | "TRUE_FALSE"
  | "SHORT_ANSWER"
  | "NUMERIC"
  | "SCALE";

type SessionResponse = {
  session: {
    id: string;
    code: string;
    mode: "LIVE" | "HOMEWORK";
    status: "DRAFT" | "SCHEDULED" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";
    title: string | null;
    quizId: string;
    currentQuestionId: string | null;
    currentQuestionStartedAt: string | null;
    startedAt: string | null;
    finishedAt: string | null;
    homeworkWindowStart?: string | null;
    homeworkWindowEnd?: string | null;
  };
  quiz: {
    id: string;
    title: string;
    description: string | null;
    defaultPoints: number;
    questions: Question[];
  };
  leaderboard: Array<{
    id: string;
    rank: number;
    displayName: string;
    score: number;
    accuracy: number | null;
    responseCount: number;
    lastSeenAt: string | null;
  }>;
  currentQuestion: Question | null;
};

type Question = {
  id: string;
  order: number;
  prompt: string;
  type: QuizQuestionType;
  options?: unknown;
  richContent?: unknown;
  mediaUrl?: string | null;
  timeLimitSeconds?: number | null;
  points: number;
  difficulty?: string | null;
  competencyTag?: string | null;
};

type SubmitResult = {
  response: {
    id: string;
    score: number;
    maxScore: number;
    isCorrect: boolean | null;
    attempt: number;
  };
  participant: {
    id: string;
    score: number;
    responseCount: number;
    accuracy: number | null;
  };
  grade: {
    score: number;
    maxScore: number;
    isCorrect: boolean | null;
    requiresManual: boolean;
  };
};

const REFRESH_INTERVAL_MS = 4000;

function formatAccuracy(value: number | null): string {
  if (value == null) return "—";
  return `${Math.round(value * 100)}%`;
}

function formatTimeRemaining(startedAt: string | null, limitSeconds: number | null | undefined): string | null {
  if (!startedAt || !limitSeconds) {
    return null;
  }

  const started = new Date(startedAt).getTime();
  const deadline = started + limitSeconds * 1000;
  const remainingSeconds = Math.max(0, Math.floor((deadline - Date.now()) / 1000));

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function parseOptions(raw: unknown): Array<{ value: string; label: string }> {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw
      .map((entry) => {
        if (typeof entry === "string") {
          return { value: entry, label: entry };
        }
        if (entry && typeof entry === "object") {
          const value = "value" in entry ? String((entry as Record<string, unknown>).value) : "";
          const label = "label" in entry ? String((entry as Record<string, unknown>).label) : value;
          if (value) {
            return { value, label };
          }
        }
        return null;
      })
      .filter((item): item is { value: string; label: string } => Boolean(item));
  }

  if (typeof raw === "object" && raw !== null) {
    return Object.entries(raw as Record<string, unknown>)
      .map(([key, value]) => {
        if (typeof value === "string") {
          return { value: key, label: value };
        }
        if (value && typeof value === "object" && "label" in value) {
          return {
            value: key,
            label: String((value as Record<string, unknown>).label ?? key),
          };
        }
        return { value: key, label: key };
      })
      .filter(Boolean);
  }

  return [];
}

export default function PlaySessionPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const code = Array.isArray(params?.code) ? params.code[0] : params?.code;

  const [participant, setParticipant] = useState(() => (code ? readParticipantSession(code) : null));
  const [sessionData, setSessionData] = useState<SessionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<unknown>(null);
  const [submitting, setSubmitting] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const currentQuestion = sessionData?.currentQuestion ?? null;
  const leaderboard = sessionData?.leaderboard ?? [];

  const timeRemaining = useMemo(() => {
    if (!sessionData?.session || !currentQuestion?.timeLimitSeconds) {
      return null;
    }
    return formatTimeRemaining(sessionData.session.currentQuestionStartedAt, currentQuestion.timeLimitSeconds);
  }, [sessionData?.session, currentQuestion?.timeLimitSeconds, sessionData?.session?.currentQuestionStartedAt]);

  const refreshSession = useCallback(
    async (signal?: AbortSignal) => {
      if (!code || !participant) {
        return;
      }

      try {
        const response = await fetch(`/api/sessions/${code}`, {
          cache: "no-store",
          signal,
        });

        if (!response.ok) {
          if (response.status === 404) {
            clearParticipantSession(code);
            setParticipant(null);
            router.replace("/quiz/join");
            return;
          }
          const body = (await response.json().catch(() => ({}))) as { error?: string };
          throw new Error(body.error || "Gagal memuat sesi.");
        }

        const data = (await response.json()) as SessionResponse;
        setSessionData(data);
        setLastUpdated(new Date());

        const isNewQuestion = data.session.currentQuestionId && data.session.currentQuestionId !== (currentQuestion?.id ?? null);
        if (isNewQuestion) {
          setAnswer(null);
          setFeedback(null);
        }

        if (!data.session.currentQuestionId) {
          setAnswer(null);
        }
      } catch (refreshError) {
        if ((refreshError as Error).name === "AbortError") {
          return;
        }
        console.error(refreshError);
        setError(refreshError instanceof Error ? refreshError.message : "Tidak dapat memuat sesi.");
      } finally {
        setLoading(false);
      }
    },
    [code, participant, router, currentQuestion?.id]
  );

  useEffect(() => {
    if (!code) {
      return;
    }

    const stored = readParticipantSession(code);
    if (!stored) {
      router.replace(`/quiz/join?code=${code}`);
      return;
    }

    setParticipant(stored);
  }, [code, router]);

  useEffect(() => {
    if (!participant || !code) {
      return;
    }

    const abortController = new AbortController();
    refreshSession(abortController.signal);

    return () => abortController.abort();
  }, [participant, code, refreshSession]);

  useEffect(() => {
    if (!participant || !code) {
      return;
    }

    const intervalId = window.setInterval(() => {
      refreshSession().catch((error) => {
        console.error("Failed refreshing session", error);
      });
    }, REFRESH_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [participant, code, refreshSession]);

  const options = useMemo(() => parseOptions(currentQuestion?.options), [currentQuestion?.options]);

  const canSubmit =
    Boolean(participant) &&
    currentQuestion &&
    sessionData?.session.status === "ACTIVE" &&
    sessionData?.session.currentQuestionId === currentQuestion.id &&
    !submitting;

  async function handleSubmitAnswer() {
    if (!participant || !sessionData?.session.currentQuestionId || !currentQuestion) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/sessions/${code}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId: participant.participantId,
          questionId: currentQuestion.id,
          answer,
          latencyMs: undefined,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || "Gagal mengirim jawaban. Silakan coba lagi.");
      }

      const payload = (await response.json()) as SubmitResult;
      setFeedback(
        payload.grade.isCorrect === true
          ? `Mantap! Jawabanmu benar (+${payload.grade.score} poin)`
          : payload.grade.isCorrect === false
            ? `Belum tepat. Kamu mendapat ${payload.grade.score} poin`
            : "Jawaban terkirim, menunggu penilaian."
      );

      if (code) {
        saveParticipantSession(code, {
          participantId: participant.participantId,
          displayName: participant.displayName,
          sessionId: participant.sessionId,
          studentId: participant.studentId,
          joinedAt: participant.joinedAt,
        });
      }

      await refreshSession();
    } catch (submitError) {
      console.error(submitError);
      setError(submitError instanceof Error ? submitError.message : "Tidak dapat mengirim jawaban.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleAnswerChange(value: unknown) {
    setAnswer(value);
    setFeedback(null);
  }

  if (!participant) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/quiz/join" className="inline-flex items-center gap-2 text-sm font-medium text-blue-200 transition hover:text-white">
            <Undo2 className="h-4 w-4" aria-hidden="true" />
            Ganti Sesi
          </Link>

          <div className="flex items-center gap-6 text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-green-300" aria-hidden="true" />
              <span className="font-semibold tracking-widest text-blue-100">{sessionData?.session.code ?? code}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Award className="h-4 w-4" aria-hidden="true" />
              <span>{participant.displayName}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-blue-950/40 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-blue-200">Pertanyaan</p>
                <h1 className="text-2xl font-semibold text-white sm:text-3xl">
                  {sessionData?.quiz.title ?? "Sesi Quiz"}
                </h1>
              </div>
              <div className="rounded-full border border-blue-500/40 bg-blue-500/20 px-4 py-2 text-xs font-medium uppercase text-blue-100">
                {sessionData?.session.status ?? "Memuat"}
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[200px] items-center justify-center text-blue-200">
                <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
              </div>
            ) : currentQuestion ? (
              <div className="mt-6 space-y-6">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-blue-200">
                    <span className="rounded-full border border-blue-400/30 px-4 py-1 font-medium text-blue-100">
                      Soal #{currentQuestion.order + 1}
                    </span>
                    {currentQuestion.points > 0 && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1 text-emerald-100">
                        <Gauge className="h-4 w-4" aria-hidden="true" />
                        {currentQuestion.points} poin
                      </span>
                    )}
                    {timeRemaining && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/40 bg-orange-400/10 px-4 py-1 text-orange-100">
                        <Timer className="h-4 w-4 animate-pulse" aria-hidden="true" />
                        {timeRemaining}
                      </span>
                    )}
                  </div>

                  <p className="text-lg leading-relaxed text-blue-50">{currentQuestion.prompt}</p>
                  {currentQuestion.mediaUrl && (
                    <img
                      src={currentQuestion.mediaUrl}
                      alt=""
                      className="mt-4 max-h-64 w-full rounded-2xl object-cover"
                    />
                  )}
                </div>

                <QuestionInteraction
                  type={currentQuestion.type}
                  options={options}
                  answer={answer}
                  onChange={handleAnswerChange}
                />

                {error && (
                  <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                    {error}
                  </div>
                )}
                {feedback && (
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                    {feedback}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleSubmitAnswer}
                    disabled={!canSubmit}
                    className={clsx(
                      "inline-flex items-center gap-3 rounded-2xl px-6 py-4 text-lg font-semibold shadow-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300",
                      canSubmit
                        ? "bg-blue-500 text-white hover:bg-blue-400 shadow-blue-900/30"
                        : "bg-blue-500/30 text-blue-100 cursor-not-allowed"
                    )}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-5 w-5" aria-hidden="true" />
                        Kirim Jawaban
                      </>
                    )}
                  </button>

                  <span className="flex items-center gap-2 text-sm text-blue-300">
                    <RefreshCcw className="h-4 w-4" aria-hidden="true" />
                    {lastUpdated ? `Terakhir diperbarui ${lastUpdated.toLocaleTimeString()}` : "Menunggu pembaruan"}
                  </span>
                </div>
              </div>
            ) : sessionData?.session.status === "COMPLETED" ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 text-center text-blue-100">
                <CheckCircle2 className="h-12 w-12 text-emerald-300" aria-hidden="true" />
                <div>
                  <h2 className="text-2xl font-semibold text-white">Kuis Selesai</h2>
                  <p className="mt-2 text-blue-200">Tunggu host mengumumkan hasil akhir, atau cek peringkatmu di leaderboard.</p>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 text-center text-blue-200">
                <CircleDot className="h-12 w-12 text-blue-300" aria-hidden="true" />
                <div>
                  <h2 className="text-2xl font-semibold text-white">Menunggu pertanyaan dimulai</h2>
                  <p className="mt-2 text-blue-200">
                    Host akan memulai atau lanjut ke pertanyaan berikutnya. Tetap siap, poin akan segera dibagikan!
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner shadow-blue-900/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Leaderboard</h2>
                <p className="text-sm text-blue-200">Kamu berada di peringkat{" "}
                  <span className="font-semibold text-blue-100">
                    {leaderboard.findIndex((entry) => entry.id === participant.participantId) + 1 || "-"}
                  </span>
                </p>
              </div>
              <Award className="h-6 w-6 text-amber-300" aria-hidden="true" />
            </div>

            <div className="mt-6 space-y-4">
              {leaderboard.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/20 p-4 text-center text-sm text-blue-200">
                  Belum ada peserta yang bergabung. Ajak temanmu sekarang!
                </p>
              ) : (
                leaderboard.slice(0, 10).map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={clsx(
                      "flex items-center justify-between rounded-2xl border px-5 py-3",
                      entry.id === participant.participantId
                        ? "border-blue-400/50 bg-blue-400/20 text-blue-50"
                        : "border-white/10 bg-white/5 text-blue-100"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-semibold text-white">{entry.rank}</span>
                      <div>
                        <p className="font-semibold text-white">{entry.displayName}</p>
                        <p className="text-xs text-blue-200">
                          Akurasi {formatAccuracy(entry.accuracy)} • {entry.responseCount} jawaban
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-white">{Math.round(entry.score)}</p>
                      {entry.id === participant.participantId && (
                        <p className="text-xs text-blue-200">Skor kamu</p>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-blue-200">
            <h3 className="text-base font-semibold text-white">Sesi & Tata Tertib</h3>
            <ul className="mt-3 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-1 h-4 w-4 text-emerald-300" aria-hidden="true" />
                Responlah dengan cepat, terutama di mode live — skor dapat dipengaruhi kecepatan.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-1 h-4 w-4 text-emerald-300" aria-hidden="true" />
                Jika koneksi terputus, buka kembali halaman ini; progresmu akan tetap tersimpan.
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="mt-1 h-4 w-4 text-red-300" aria-hidden="true" />
                Jangan menutup tab saat host memulai pertanyaan baru agar tidak ketinggalan poin.
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}

type QuestionInteractionProps = {
  type: QuizQuestionType;
  options: Array<{ value: string; label: string }>;
  answer: unknown;
  onChange: (value: unknown) => void;
};

function QuestionInteraction({ type, options, answer, onChange }: QuestionInteractionProps) {
  switch (type) {
    case "MULTIPLE_CHOICE":
      return (
        <div className="grid gap-3">
          {options.map((option) => {
            const selected = answer === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                className={clsx(
                  "flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300",
                  selected
                    ? "border-blue-400/60 bg-blue-500/20 text-blue-50"
                    : "border-white/10 bg-white/5 text-blue-100 hover:border-blue-400/40 hover:bg-blue-400/10"
                )}
                aria-pressed={selected}
              >
                <span>{option.label}</span>
                {selected && <CheckCircle2 className="h-5 w-5 text-blue-200" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      );

    case "MULTI_SELECT": {
      const selectedValues = Array.isArray(answer) ? (answer as string[]) : [];
      return (
        <div className="grid gap-3">
          {options.map((option) => {
            const selected = selectedValues.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  const next = selected
                    ? selectedValues.filter((value) => value !== option.value)
                    : [...selectedValues, option.value];
                  onChange(next);
                }}
                className={clsx(
                  "flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300",
                  selected
                    ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-50"
                    : "border-white/10 bg-white/5 text-blue-100 hover:border-emerald-400/40 hover:bg-emerald-400/10"
                )}
                aria-pressed={selected}
              >
                <span>{option.label}</span>
                {selected && <CheckCircle2 className="h-5 w-5 text-emerald-200" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      );
    }

    case "TRUE_FALSE": {
      const trueFalseOptions: Array<{
        label: string;
        value: boolean;
        selectedClasses: string;
      }> = [
        {
          label: "Benar",
          value: true,
          selectedClasses: "border-emerald-400/60 bg-emerald-500/20 text-emerald-50",
        },
        {
          label: "Salah",
          value: false,
          selectedClasses: "border-rose-400/60 bg-rose-500/20 text-rose-50",
        },
      ];

      return (
        <div className="flex flex-wrap gap-3">
          {trueFalseOptions.map((option) => {
            const selected = answer === option.value;
            return (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => onChange(option.value)}
                className={clsx(
                  "flex-1 min-w-[140px] rounded-2xl border px-5 py-4 text-lg font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300",
                  selected
                    ? option.selectedClasses
                    : "border-white/10 bg-white/5 text-blue-100 hover:border-white/30 hover:bg-white/10"
                )}
                aria-pressed={selected}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      );
    }

    case "SHORT_ANSWER":
      return (
        <label className="grid gap-2">
          <span className="text-sm font-medium text-blue-200">Tuliskan jawaban singkatmu</span>
          <textarea
            value={typeof answer === "string" ? answer : ""}
            onChange={(event) => onChange(event.target.value)}
            rows={4}
            className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-blue-200/60 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            placeholder="Ringkas dan jelas ya..."
          />
        </label>
      );

    case "NUMERIC":
    case "SCALE":
      return (
        <label className="grid gap-2">
          <span className="text-sm font-medium text-blue-200">Masukkan angka</span>
          <input
            type="number"
            inputMode="decimal"
            value={
              answer !== null && answer !== undefined && answer !== ""
                ? String(answer)
                : ""
            }
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-blue-200/60 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </label>
      );

    default:
      return (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-blue-200">
          Tipe soal ini belum didukung di antarmuka peserta. Silakan hubungi host.
        </div>
      );
  }
}
