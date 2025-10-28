"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  ClipboardList,
  Loader2,
  Pencil,
  Plus,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import clsx from "clsx";
import type { QuizQuestionType } from "@prisma/client";
import { useToast } from "@/components/feedback/toast";

type QuizListItem = {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  defaultPoints: number;
  questionCount: number;
  updatedAt: string;
};

type QuizQuestion = {
  id: string;
  order: number;
  type: QuizQuestionType;
  prompt: string;
  options: unknown;
  correctAnswers: unknown;
  points: number;
  timeLimitSeconds: number | null;
  competencyTag: string | null;
  explanation: string | null;
  difficulty: string | null;
};

type QuizDetail = {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  defaultPoints: number;
  timePerQuestion: number | null;
  updatedAt: string;
  questions: QuizQuestion[];
};

type QuizEditorState =
  | { mode: "create" }
  | { mode: "edit"; quiz: QuizDetail };

type QuestionFormState = {
  formId: string;
  questionId?: string;
  type: QuizQuestionType;
  prompt: string;
  points: string;
  timeLimitSeconds: string;
  competencyTag: string;
  difficulty: string;
  explanation: string;
  options: string[];
  correctOptionIndex: number;
  correctOptionIndexes: number[];
  shortAnswers: string[];
  trueFalseAnswer: boolean;
  numericValue: string;
  numericTolerance: string;
};

const QUESTION_TYPE_LABEL: Record<QuizQuestionType, string> = {
  MULTIPLE_CHOICE: "Pilihan Ganda",
  MULTI_SELECT: "Pilih Banyak",
  TRUE_FALSE: "Benar / Salah",
  SHORT_ANSWER: "Jawaban Singkat",
  NUMERIC: "Numerik",
  SCALE: "Skala",
};

const QUESTION_TYPE_OPTIONS = Object.entries(QUESTION_TYPE_LABEL).map(
  ([value, label]) => ({
    value: value as QuizQuestionType,
    label,
  })
);

const generateLocalId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

const extractStringArray = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).map((item) =>
      String(item)
    );
  }
  return [String(value)];
};

const createEmptyQuestionState = (defaultPoints: number): QuestionFormState => ({
  formId: generateLocalId(),
  type: "MULTIPLE_CHOICE",
  prompt: "",
  points: String(defaultPoints || 1),
  timeLimitSeconds: "",
  competencyTag: "",
  difficulty: "",
  explanation: "",
  options: ["", ""],
  correctOptionIndex: 0,
  correctOptionIndexes: [],
  shortAnswers: [""],
  trueFalseAnswer: true,
  numericValue: "",
  numericTolerance: "0",
});

const createStateFromQuestion = (
  question: QuizQuestion,
  fallbackPoints: number
): QuestionFormState => {
  const options = extractStringArray(question.options);
  const correctAnswers = extractStringArray(question.correctAnswers);

  const state: QuestionFormState = {
    formId: generateLocalId(),
    questionId: question.id,
    type: question.type,
    prompt: question.prompt,
    points: String(question.points ?? fallbackPoints ?? 1),
    timeLimitSeconds: question.timeLimitSeconds
      ? String(question.timeLimitSeconds)
      : "",
    competencyTag: question.competencyTag ?? "",
    difficulty: question.difficulty ?? "",
    explanation: question.explanation ?? "",
    options: options.length > 0 ? options : ["", ""],
    correctOptionIndex: 0,
    correctOptionIndexes: [],
    shortAnswers: correctAnswers.length > 0 ? correctAnswers : [""],
    trueFalseAnswer: true,
    numericValue: "",
    numericTolerance: "0",
  };

  switch (question.type) {
    case "MULTIPLE_CHOICE": {
      const answer = correctAnswers[0];
      const index = options.findIndex((option) => option === answer);
      state.correctOptionIndex = index >= 0 ? index : 0;
      break;
    }
    case "MULTI_SELECT": {
      state.correctOptionIndexes = options.reduce<number[]>(
        (acc, option, index) => {
          if (correctAnswers.includes(option)) {
            acc.push(index);
          }
          return acc;
        },
        []
      );
      break;
    }
    case "TRUE_FALSE": {
      if (Array.isArray(question.correctAnswers)) {
        const value = question.correctAnswers[0];
        state.trueFalseAnswer =
          typeof value === "boolean" ? value : String(value).toLowerCase() === "true";
      } else if (typeof question.correctAnswers === "boolean") {
        state.trueFalseAnswer = question.correctAnswers;
      }
      break;
    }
    case "NUMERIC":
    case "SCALE": {
      const raw = Array.isArray(question.correctAnswers)
        ? question.correctAnswers[0]
        : question.correctAnswers;
      if (raw && typeof raw === "object" && "value" in raw) {
        const { value, tolerance } = raw as { value: unknown; tolerance?: unknown };
        state.numericValue = String(value ?? "");
        state.numericTolerance = tolerance !== undefined ? String(tolerance) : "0";
      } else {
        state.numericValue = raw !== undefined ? String(raw) : "";
      }
      break;
    }
    case "SHORT_ANSWER":
      state.shortAnswers = correctAnswers.length > 0 ? correctAnswers : [""];
      break;
    default:
      break;
  }

  return state;
};

export default function AdminQuizManagerPage() {
  return (
    <AdminLayout>
      <QuizManagerScreen />
    </AdminLayout>
  );
}

function QuizManagerScreen() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [quizDetails, setQuizDetails] = useState<Record<string, QuizDetail>>({});
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [quizEditor, setQuizEditor] = useState<QuizEditorState | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/quizzes", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Gagal memuat daftar kuis");
        }
        const data = (await response.json()) as Array<{
          id: string;
          title: string;
          description: string | null;
          isPublic: boolean;
          defaultPoints: number;
          updatedAt: string;
          _count?: { questions: number };
        }>;

        const mapped: QuizListItem[] = data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          isPublic: item.isPublic,
          defaultPoints: item.defaultPoints,
          questionCount: item._count?.questions ?? 0,
          updatedAt: item.updatedAt,
        }));

        setQuizzes(mapped);
        if (mapped.length > 0) {
          setSelectedQuizId(mapped[0].id);
        }
      } catch (error) {
        console.error(error);
        addToast({
          type: "error",
          title: "Gagal memuat kuis",
          message: "Silakan coba beberapa saat lagi.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [addToast]);

  useEffect(() => {
    if (!selectedQuizId) return;
    if (quizDetails[selectedQuizId]) return;

    const fetchDetail = async () => {
      setDetailLoading(true);
      setDetailError(null);
      try {
        const detail = await fetchQuizDetail(selectedQuizId);
        setQuizDetails((prev) => ({ ...prev, [selectedQuizId]: detail }));
      } catch (error) {
        console.error(error);
        setDetailError(
          error instanceof Error
            ? error.message
            : "Tidak dapat memuat detail kuis."
        );
      } finally {
        setDetailLoading(false);
      }
    };

    fetchDetail();
  }, [selectedQuizId, quizDetails]);

  const selectedQuizDetail = selectedQuizId ? quizDetails[selectedQuizId] : null;

  const handleSelectQuiz = (quizId: string) => {
    setSelectedQuizId(quizId);
  };

  const handleCreateClick = () => {
    setQuizEditor({ mode: "create" });
  };

  const handleEditClick = async (quizId: string) => {
    try {
      const detail = quizDetails[quizId] ?? (await fetchQuizDetail(quizId));
      setQuizDetails((prev) => ({ ...prev, [quizId]: detail }));
      setQuizEditor({ mode: "edit", quiz: detail });
    } catch (error) {
      console.error(error);
      addToast({
        type: "error",
        title: "Gagal membuka editor",
        message: "Tidak dapat memuat detail kuis.",
      });
    }
  };

  const handleQuizCreated = (quiz: QuizDetail) => {
    setQuizzes((prev) => [
      {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        isPublic: quiz.isPublic,
        defaultPoints: quiz.defaultPoints,
        questionCount: quiz.questions.length,
        updatedAt: quiz.updatedAt,
      },
      ...prev,
    ]);
    setQuizDetails((prev) => ({ ...prev, [quiz.id]: quiz }));
    setSelectedQuizId(quiz.id);
    setQuizEditor(null);
    addToast({
      type: "success",
      title: "Kuis tersimpan",
      message: "Kuis berhasil dibuat dan siap digunakan.",
    });
  };

  const handleQuizUpdated = (quiz: QuizDetail) => {
    setQuizzes((prev) =>
      prev.map((item) =>
        item.id === quiz.id
          ? {
              ...item,
              title: quiz.title,
              description: quiz.description,
              isPublic: quiz.isPublic,
              defaultPoints: quiz.defaultPoints,
              questionCount: quiz.questions.length,
              updatedAt: quiz.updatedAt,
            }
          : item
      )
    );
    setQuizDetails((prev) => ({ ...prev, [quiz.id]: quiz }));
    setQuizEditor(null);
    addToast({
      type: "success",
      title: "Perubahan tersimpan",
      message: "Kuis berhasil diperbarui.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <ClipboardList className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Manajemen Kuis</h1>
              <p className="text-sm text-slate-600">
                Susun bank soal, update materi, dan jalankan sesi live/homework dari satu tempat.
              </p>
            </div>
          </div>
          <button
            onClick={handleCreateClick}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Kuis Baru
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[360px,1fr]">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Daftar Kuis
            </h2>
            <button
              onClick={() => {
                setQuizEditor(null);
                setQuizDetails({});
                setLoading(true);
                (async () => {
                  try {
                    const response = await fetch("/api/quizzes", { cache: "no-store" });
                    if (!response.ok) throw new Error("Gagal memuat kuis");
                    const data = (await response.json()) as Array<{
                      id: string;
                      title: string;
                      description: string | null;
                      isPublic: boolean;
                      defaultPoints: number;
                      updatedAt: string;
                      _count?: { questions: number };
                    }>;
                    const mapped: QuizListItem[] = data.map((item) => ({
                      id: item.id,
                      title: item.title,
                      description: item.description,
                      isPublic: item.isPublic,
                      defaultPoints: item.defaultPoints,
                      questionCount: item._count?.questions ?? 0,
                      updatedAt: item.updatedAt,
                    }));
                    setQuizzes(mapped);
                    if (mapped.length > 0) {
                      setSelectedQuizId(mapped[0].id);
                    }
                    addToast({
                      type: "info",
                      title: "Daftar diperbarui",
                      message: "Data kuis berhasil dimuat ulang.",
                    });
                  } catch (error) {
                    console.error(error);
                    addToast({
                      type: "error",
                      title: "Gagal memuat ulang",
                      message: "Tidak dapat memuat ulang data kuis.",
                    });
                  } finally {
                    setLoading(false);
                  }
                })();
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
            >
              <RefreshCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Muat Ulang
            </button>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white">
                <div className="flex items-center gap-2 text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  Memuat kuis...
                </div>
              </div>
            ) : quizzes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
                Belum ada kuis. Klik <strong>Kuis Baru</strong> untuk mulai menyusun.
              </div>
            ) : (
              quizzes.map((quiz) => {
                const active = quiz.id === selectedQuizId;
                return (
                  <button
                    key={quiz.id}
                    onClick={() => handleSelectQuiz(quiz.id)}
                    className={clsx(
                      "w-full rounded-2xl border px-4 py-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300",
                      active
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/60"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900">{quiz.title}</p>
                        <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                          {quiz.description || "Tidak ada deskripsi"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleEditClick(quiz.id);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        Edit
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                      <Badge icon={ShieldCheck} tone={quiz.isPublic ? "emerald" : "slate"}>
                        {quiz.isPublic ? "Publik" : "Private"}
                      </Badge>
                      <Badge icon={ClipboardList}>
                        {quiz.questionCount} soal
                      </Badge>
                      <span>Update {new Date(quiz.updatedAt).toLocaleDateString("id-ID")}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        <section className="space-y-6">
          {selectedQuizId ? (
            <div className="space-y-6">
              {detailLoading ? (
                <div className="flex min-h-[200px] items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                </div>
              ) : detailError ? (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                  {detailError}
                </div>
              ) : selectedQuizDetail ? (
                <>
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                          {selectedQuizDetail.title}
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                          {selectedQuizDetail.description || "Tidak ada deskripsi tambahan"}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setQuizEditor({ mode: "edit", quiz: selectedQuizDetail })
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-500 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 transition hover:border-blue-600 hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                        Edit Kuis
                      </button>
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <InfoStat label="Default Poin" value={selectedQuizDetail.defaultPoints} />
                      <InfoStat
                        label="Waktu per Soal"
                        value={
                          selectedQuizDetail.timePerQuestion
                            ? `${selectedQuizDetail.timePerQuestion} detik`
                            : "Tidak diatur"
                        }
                      />
                      <InfoStat
                        label="Terakhir diperbarui"
                        value={new Date(selectedQuizDetail.updatedAt).toLocaleString("id-ID")}
                      />
                    </div>
                  </div>

                  <QuestionList quiz={selectedQuizDetail} />
                </>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                  Pilih kuis di sisi kiri untuk melihat detail.
                </div>
              )}
            </div>
          ) : (
            <div className="flex min-h-[200px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white text-sm text-slate-500">
              Pilih kuis untuk melihat detailnya.
            </div>
          )}
        </section>
      </main>

      {quizEditor ? (
        <QuizEditorModal
          mode={quizEditor.mode}
          quiz={quizEditor.mode === "edit" ? quizEditor.quiz : undefined}
          onClose={() => setQuizEditor(null)}
          onCreated={handleQuizCreated}
          onUpdated={handleQuizUpdated}
        />
      ) : null}
    </div>
  );
}

type BadgeProps = {
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  tone?: "slate" | "blue" | "emerald";
};

function Badge({ children, icon: Icon, tone = "slate" }: BadgeProps) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "blue"
        ? "border-blue-200 bg-blue-50 text-blue-700"
        : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
        toneClass
      )}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

type InfoStatProps = {
  label: string;
  value: string | number;
};

function InfoStat({ label, value }: InfoStatProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function QuestionList({ quiz }: { quiz: QuizDetail }) {
  const orderedQuestions = useMemo(
    () => quiz.questions.slice().sort((a, b) => a.order - b.order),
    [quiz.questions]
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900">Bank Soal</h3>
        <span className="text-sm text-slate-500">
          Total {orderedQuestions.length} soal
        </span>
      </div>

      {orderedQuestions.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
          Belum ada soal untuk kuis ini.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orderedQuestions.map((question, index) => (
            <div
              key={question.id}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-blue-500">
                    Soal #{index + 1}
                  </p>
                  <h4 className="mt-1 text-base font-semibold text-slate-900">
                    {question.prompt}
                  </h4>
                </div>
                <Badge tone="blue">{QUESTION_TYPE_LABEL[question.type]}</Badge>
              </div>

              <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                    P
                  </span>
                  <span>{question.points} poin</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                    ⏱
                  </span>
                  <span>
                    {question.timeLimitSeconds
                      ? `${question.timeLimitSeconds} detik`
                      : "Tidak dibatasi"}
                  </span>
                </div>
              </div>

              {question.competencyTag ? (
                <p className="mt-2 text-xs text-slate-500">
                  Kompetensi: <span className="font-medium text-slate-700">{question.competencyTag}</span>
                </p>
              ) : null}

              {question.explanation ? (
                <p className="mt-2 text-xs text-slate-500">
                  Catatan: <span className="text-slate-600">{question.explanation}</span>
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type QuizEditorModalProps = {
  mode: "create" | "edit";
  quiz?: QuizDetail;
  onClose: () => void;
  onCreated?: (quiz: QuizDetail) => void;
  onUpdated?: (quiz: QuizDetail) => void;
};

function QuizEditorModal({
  mode,
  quiz,
  onClose,
  onCreated,
  onUpdated,
}: QuizEditorModalProps) {
  const { addToast } = useToast();
  const isEdit = mode === "edit";
  const fallbackPoints = quiz?.defaultPoints ?? 1;

  const [title, setTitle] = useState(() => quiz?.title ?? "");
  const [description, setDescription] = useState(() => quiz?.description ?? "");
  const [isPublic, setIsPublic] = useState(() => quiz?.isPublic ?? false);
  const [defaultPoints, setDefaultPoints] = useState(() =>
    String(quiz?.defaultPoints ?? 1)
  );
  const [timePerQuestion, setTimePerQuestion] = useState(() =>
    quiz?.timePerQuestion ? String(quiz.timePerQuestion) : ""
  );
  const [questions, setQuestions] = useState<QuestionFormState[]>(() => {
    if (isEdit && quiz) {
      return quiz.questions
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((question) => createStateFromQuestion(question, fallbackPoints));
    }
    return [createEmptyQuestionState(fallbackPoints)];
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateQuestion = (
    formId: string,
    updater: (value: QuestionFormState) => QuestionFormState
  ) => {
    setQuestions((prev) =>
      prev.map((item) => (item.formId === formId ? updater(item) : item))
    );
  };

  const removeQuestion = (formId: string) => {
    setQuestions((prev) =>
      prev.length > 1 ? prev.filter((item) => item.formId !== formId) : prev
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, createEmptyQuestionState(Number(defaultPoints) || 1)]);
  };

  const buildQuestionPayload = (
    question: QuestionFormState,
    index: number,
    parsedDefaultPoints: number
  ) => {
    const prompt = question.prompt.trim();
    if (!prompt) {
      throw new Error(`Pertanyaan pada soal #${index + 1} wajib diisi.`);
    }

    const base: Record<string, unknown> = {
      id: question.questionId,
      order: index,
      type: question.type,
      prompt,
      points: question.points.trim()
        ? Number.parseInt(question.points.trim(), 10)
        : parsedDefaultPoints,
      competencyTag: question.competencyTag.trim() || null,
      difficulty: question.difficulty.trim() || null,
      explanation: question.explanation.trim() || null,
    };

    if (question.timeLimitSeconds.trim()) {
      const limit = Number.parseInt(question.timeLimitSeconds.trim(), 10);
      if (Number.isNaN(limit) || limit < 0) {
        throw new Error(`Batas waktu pada soal #${index + 1} tidak valid.`);
      }
      base.timeLimitSeconds = limit;
    } else {
      base.timeLimitSeconds = null;
    }

    switch (question.type) {
      case "MULTIPLE_CHOICE": {
        const options = question.options.map((opt) => opt.trim()).filter(Boolean);
        if (options.length < 2) {
          throw new Error(`Soal #${index + 1} minimal membutuhkan dua opsi.`);
        }
        const answerIndex = Math.min(
          Math.max(question.correctOptionIndex, 0),
          options.length - 1
        );
        base.options = options;
        base.correctAnswers = [options[answerIndex]];
        break;
      }
      case "MULTI_SELECT": {
        const options = question.options.map((opt) => opt.trim()).filter(Boolean);
        if (options.length < 2) {
          throw new Error(`Soal #${index + 1} minimal membutuhkan dua opsi.`);
        }
        const selected = question.correctOptionIndexes.filter(
          (idx) => idx >= 0 && idx < options.length
        );
        if (selected.length === 0) {
          throw new Error(`Pilih minimal satu jawaban benar untuk soal #${index + 1}.`);
        }
        base.options = options;
        base.correctAnswers = selected.map((idx) => options[idx]);
        break;
      }
      case "TRUE_FALSE": {
        base.correctAnswers = [question.trueFalseAnswer];
        break;
      }
      case "SHORT_ANSWER": {
        const answers = question.shortAnswers.map((ans) => ans.trim()).filter(Boolean);
        if (answers.length === 0) {
          throw new Error(`Tambahkan minimal satu jawaban benar untuk soal #${index + 1}.`);
        }
        base.correctAnswers = answers;
        break;
      }
      case "NUMERIC":
      case "SCALE": {
        const numericValue = Number(question.numericValue);
        if (!Number.isFinite(numericValue)) {
          throw new Error(`Masukkan nilai numerik yang valid untuk soal #${index + 1}.`);
        }
        const tolerance = Number(question.numericTolerance || "0");
        base.correctAnswers = [
          {
            value: numericValue,
            tolerance: Number.isFinite(tolerance) ? tolerance : 0,
          },
        ];
        break;
      }
      default:
        throw new Error(`Tipe soal ${question.type} belum didukung.`);
    }

    return base;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Judul kuis wajib diisi.");
      return;
    }

    const parsedDefaultPoints = Number.parseInt(defaultPoints.trim(), 10);
    if (!Number.isFinite(parsedDefaultPoints) || parsedDefaultPoints <= 0) {
      setError("Poin default harus berupa angka lebih besar dari nol.");
      return;
    }

    if (questions.some((question) => question.prompt.trim().length === 0)) {
      setError("Semua soal wajib memiliki teks pertanyaan.");
      return;
    }

    try {
      const payloadQuestions = questions.map((question, index) =>
        buildQuestionPayload(question, index, parsedDefaultPoints)
      );

      const body = JSON.stringify({
        title: trimmedTitle,
        description: description.trim() || null,
        isPublic,
        defaultPoints: parsedDefaultPoints,
        timePerQuestion: timePerQuestion.trim()
          ? Number.parseInt(timePerQuestion.trim(), 10)
          : null,
        questions: payloadQuestions,
      });

      setIsSubmitting(true);

      const response = await fetch(
        isEdit && quiz ? `/api/quizzes/${quiz.id}` : "/api/quizzes",
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data?.error || (isEdit ? "Gagal memperbarui kuis." : "Gagal membuat kuis.")
        );
      }

      const data = (await response.json()) as QuizDetail;
      if (isEdit) {
        onUpdated?.(data);
      } else {
        onCreated?.(data);
      }
    } catch (submitError) {
      console.error(submitError);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Terjadi kesalahan tak terduga."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Edit Kuis" : "Kuis Baru"}
            </h2>
            <p className="text-sm text-slate-500">
              {isEdit
                ? "Perbarui metadata kuis dan soal yang sudah ada."
                : "Susun kuis baru lengkap dengan variasi soal."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
            title="Tutup"
          >
            <span className="sr-only">Tutup</span>
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative flex-1 overflow-y-auto px-6 py-6"
        >
          <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-[2fr,1fr]">
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                Judul Kuis
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  placeholder="Misal: Fundamental Web Dasar"
                  required
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                Default Poin per Soal
                <input
                  type="number"
                  min={1}
                  value={defaultPoints}
                  onChange={(event) => setDefaultPoints(event.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  required
                />
              </label>
            </div>

            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Deskripsi
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                placeholder="Catatan untuk host atau gambaran kuis."
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                Waktu per Soal (detik, opsional)
                <input
                  type="number"
                  min={0}
                  value={timePerQuestion}
                  onChange={(event) => setTimePerQuestion(event.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  placeholder="Biarkan kosong jika tidak dibatasi"
                />
              </label>

              <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(event) => setIsPublic(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Tampilkan kuis ini di katalog publik
              </label>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">Daftar Soal</h3>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  Tambah Soal
                </button>
              </div>

              {questions.map((question, index) => (
                <QuestionFormCard
                  key={question.formId}
                  index={index}
                  question={question}
                  onChange={(updater) => updateQuestion(question.formId, updater)}
                  onRemove={() => removeQuestion(question.formId)}
                  disableRemove={questions.length === 1}
                />
              ))}
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}
          </div>

          <div className="sticky bottom-0 mt-6 flex justify-end gap-3 border-t border-slate-200 bg-white pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type QuestionFormCardProps = {
  index: number;
  question: QuestionFormState;
  disableRemove?: boolean;
  onChange: (updater: (value: QuestionFormState) => QuestionFormState) => void;
  onRemove: () => void;
};

function QuestionFormCard({
  index,
  question,
  onChange,
  onRemove,
  disableRemove = false,
}: QuestionFormCardProps) {
  const handleTypeChange = (nextType: QuizQuestionType) => {
    onChange((prev) => {
      const base = createEmptyQuestionState(Number(prev.points) || 1);
      return {
        ...base,
        formId: prev.formId,
        questionId: prev.questionId,
        type: nextType,
        prompt: prev.prompt,
        points: prev.points,
        competencyTag: prev.competencyTag,
        difficulty: prev.difficulty,
        explanation: prev.explanation,
      };
    });
  };

  const toggleMultiSelectAnswer = (indexToToggle: number) => {
    onChange((prev) => {
      const exists = prev.correctOptionIndexes.includes(indexToToggle);
      const next = exists
        ? prev.correctOptionIndexes.filter((idx) => idx !== indexToToggle)
        : [...prev.correctOptionIndexes, indexToToggle];
      return { ...prev, correctOptionIndexes: next };
    });
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Soal #{index + 1}
          </p>
          <h4 className="text-base font-semibold text-slate-900">
            {QUESTION_TYPE_LABEL[question.type]}
          </h4>
        </div>
        <button
          type="button"
          onClick={onRemove}
          disabled={disableRemove}
          className="inline-flex items-center justify-center rounded-full border border-slate-300 p-2 text-slate-500 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
          title="Hapus soal"
        >
          ×
        </button>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.4fr,1fr]">
        <label className="grid gap-1 text-sm font-medium text-slate-700 lg:col-span-2">
          Pertanyaan
          <textarea
            value={question.prompt}
            onChange={(event) =>
              onChange((prev) => ({ ...prev, prompt: event.target.value }))
            }
            rows={3}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            placeholder="Tuliskan pertanyaan..."
            required
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Tipe Soal
          <select
            value={question.type}
            onChange={(event) => handleTypeChange(event.target.value as QuizQuestionType)}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            {QUESTION_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Poin Soal
          <input
            type="number"
            min={0}
            value={question.points}
            onChange={(event) =>
              onChange((prev) => ({ ...prev, points: event.target.value }))
            }
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            placeholder="Mengikuti default jika kosong"
          />
        </label>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Batas Waktu (detik)
          <input
            type="number"
            min={0}
            value={question.timeLimitSeconds}
            onChange={(event) =>
              onChange((prev) => ({
                ...prev,
                timeLimitSeconds: event.target.value,
              }))
            }
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            placeholder="Biarkan kosong jika tidak dibatasi"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Kompetensi (opsional)
          <input
            type="text"
            value={question.competencyTag}
            onChange={(event) =>
              onChange((prev) => ({ ...prev, competencyTag: event.target.value }))
            }
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            placeholder="Misal: Algoritma, Struktur Data"
          />
        </label>
      </div>

      <label className="mt-3 grid gap-1 text-sm font-medium text-slate-700">
        Catatan/Eksplanasi (opsional)
        <textarea
          value={question.explanation}
          onChange={(event) =>
            onChange((prev) => ({ ...prev, explanation: event.target.value }))
          }
          rows={2}
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          placeholder="Catatan tambahan untuk host"
        />
      </label>

      {(question.type === "MULTIPLE_CHOICE" || question.type === "MULTI_SELECT") && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Opsi Jawaban
            </p>
            <button
              type="button"
              onClick={() =>
                onChange((prev) => ({ ...prev, options: [...prev.options, ""] }))
              }
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Tambah Opsi
            </button>
          </div>
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <div key={`${question.formId}-option-${optionIndex}`} className="flex items-center gap-2">
                {question.type === "MULTIPLE_CHOICE" ? (
                  <input
                    type="radio"
                    name={`${question.formId}-answer`}
                    checked={question.correctOptionIndex === optionIndex}
                    onChange={() =>
                      onChange((prev) => ({ ...prev, correctOptionIndex: optionIndex }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                ) : (
                  <input
                    type="checkbox"
                    checked={question.correctOptionIndexes.includes(optionIndex)}
                    onChange={() => toggleMultiSelectAnswer(optionIndex)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                )}
                <input
                  type="text"
                  value={option}
                  onChange={(event) =>
                    onChange((prev) => ({
                      ...prev,
                      options: prev.options.map((value, idx) =>
                        idx === optionIndex ? event.target.value : value
                      ),
                    }))
                  }
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  placeholder={`Opsi ${optionIndex + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {question.type === "SHORT_ANSWER" && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Jawaban Benar
            </p>
            <button
              type="button"
              onClick={() =>
                onChange((prev) => ({
                  ...prev,
                  shortAnswers: [...prev.shortAnswers, ""],
                }))
              }
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Tambah Jawaban
            </button>
          </div>
          <div className="space-y-2">
            {question.shortAnswers.map((answer, answerIndex) => (
              <input
                key={`${question.formId}-short-${answerIndex}`}
                type="text"
                value={answer}
                onChange={(event) =>
                  onChange((prev) => ({
                    ...prev,
                    shortAnswers: prev.shortAnswers.map((value, idx) =>
                      idx === answerIndex ? event.target.value : value
                    ),
                  }))
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                placeholder="Jawaban yang dianggap benar"
              />
            ))}
          </div>
        </div>
      )}

      {question.type === "TRUE_FALSE" && (
        <div className="mt-4 grid gap-2 text-sm text-slate-700">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name={`${question.formId}-truefalse`}
              checked={question.trueFalseAnswer === true}
              onChange={() =>
                onChange((prev) => ({ ...prev, trueFalseAnswer: true }))
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            Benar
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name={`${question.formId}-truefalse`}
              checked={question.trueFalseAnswer === false}
              onChange={() =>
                onChange((prev) => ({ ...prev, trueFalseAnswer: false }))
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            Salah
          </label>
        </div>
      )}

      {(question.type === "NUMERIC" || question.type === "SCALE") && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Nilai Benar
            <input
              type="number"
              value={question.numericValue}
              onChange={(event) =>
                onChange((prev) => ({ ...prev, numericValue: event.target.value }))
              }
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              placeholder="Misal: 42"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Toleransi (opsional)
            <input
              type="number"
              step="0.01"
              value={question.numericTolerance}
              onChange={(event) =>
                onChange((prev) => ({
                  ...prev,
                  numericTolerance: event.target.value,
                }))
              }
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              placeholder="0 untuk tepat"
            />
          </label>
        </div>
      )}
    </div>
  );
}

async function fetchQuizDetail(id: string): Promise<QuizDetail> {
  const response = await fetch(`/api/quizzes/${id}`, { cache: "no-store" });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.error || "Gagal memuat detail kuis");
  }
  return (await response.json()) as QuizDetail;
}
