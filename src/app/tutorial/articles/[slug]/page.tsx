"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { studentAuth, type StudentSession } from "@/lib/student-auth";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  User,
  Clock,
  Eye,
  Share2,
  Newspaper,
  Star,
  MessageCircle,
  Sparkles,
  Send,
  LogIn,
  LayoutDashboard,
  ThumbsUp,
} from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  status: string;
  featured: boolean;
  imageUrl?: string;
  readTime: number;
  views: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

type FeedbackResponseItem = {
  id: string;
  rating: number;
  comment: string;
  challenge: string;
  timestamp: string;
  studentName: string;
  studentClass: string;
  timeAgo: string;
  upvotes?: number;
  hasUpvoted?: boolean;
};

const formatDate = (dateString?: string) => {
  if (!dateString) {
    return "";
  }
  try {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const splitContentIntoParagraphs = (content?: string) => {
  if (!content) {
    return [];
  }
  return content
    .replace(/```[\s\S]*?```/g, "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

const extractCodeSamples = (content?: string) => {
  if (!content) {
    return [];
  }
  const regex = /```(\w+)?\n([\s\S]*?)```/g;
  const samples: Array<{ language: string; code: string }> = [];
  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(content)) !== null) {
    const language = match[1] || "code";
    const code = match[2].trim();
    samples.push({ language, code });
  }
  return samples;
};

const chunkArray = <T,>(arr: T[], size: number) => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: session } = useSession();
  const loginRedirect = useMemo(
    () => `/student/login?redirect=${encodeURIComponent(`/tutorial/articles/${slug}`)}`,
    [slug],
  );
  const [studentSession, setStudentSession] = useState<StudentSession | null>(null);
  const isNextAuthStudent = session?.user?.userType === 'student';
  const isStudentLoggedIn = isNextAuthStudent || !!studentSession;
  const displayName = studentSession?.fullName || session?.user?.name || 'Siswa GEMA';
  const displayMeta = studentSession
    ? `${studentSession.studentId} • ${studentSession.class}`
    : session?.user?.email || '';
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Feedback State
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [challenge, setChallenge] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [quizSelection, setQuizSelection] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Real feedback data
  const [realFeedback, setRealFeedback] = useState<{
    id: string;
    rating: number;
    comment: string;
    challenge: string;
    timestamp: string;
    studentName: string;
    studentClass: string;
    timeAgo: string;
    upvotes: number;
    hasUpvoted: boolean;
  }[]>([]);
  const [feedbackStats, setFeedbackStats] = useState<{
    averageRating: number | null;
    totalFeedback: number | null;
    title?: string | null;
  } | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});
  const [reactionSubmitting, setReactionSubmitting] = useState(false);
  const [upvoteInFlight, setUpvoteInFlight] = useState<string | null>(null);
  
  // Testing Checklist State
  const [checklist, setChecklist] = useState({
    responsive: false,
    lightbox: false,
    performance: false,
    hover: false,
    navigation: false
  });

  const fetchArticle = useCallback(async () => {
    try {
      const response = await fetch(`/api/tutorial/articles/${slug}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setArticle(data.data);
        } else {
          setError(data.error || 'Article not found');
        }
      } else {
        setError('Failed to fetch article');
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const getStudentHeaders = useCallback(() => {
    const headers: Record<string, string> = {};
    if (!isNextAuthStudent && studentSession?.id) {
      headers["x-student-id"] = studentSession.id;
    }
    return headers;
  }, [isNextAuthStudent, studentSession?.id]);

  const fetchFeedback = useCallback(async () => {
    if (!article?.id) return;
    
    setFeedbackLoading(true);
    try {
      const headers = getStudentHeaders();
      const response = await fetch(`/api/tutorial/feedback?articleId=${article.id}` , { headers });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const feedbackItems = (data.data.feedback || []) as FeedbackResponseItem[];
          const normalized = feedbackItems.map((item) => ({
            ...item,
            upvotes: item.upvotes ?? 0,
            hasUpvoted: Boolean(item.hasUpvoted),
          }));
          setRealFeedback(normalized);
          setFeedbackStats(data.data.stats || null);
        }
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setFeedbackLoading(false);
    }
  }, [article?.id, getStudentHeaders]);

  const fetchReactions = useCallback(async () => {
    if (!article?.id) return;

    try {
      const headers = getStudentHeaders();
      const response = await fetch(`/api/tutorial/reactions?articleId=${article.id}`, {
        headers,
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setReactionCounts(data.data.counts || {});
          if (typeof data.data.currentReaction !== "undefined") {
            setSelectedReaction(data.data.currentReaction);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching reactions:", error);
    }
  }, [article?.id, getStudentHeaders]);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug, fetchArticle]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  useEffect(() => {
    const currentStudentSession = studentAuth.getSession();
    setStudentSession(currentStudentSession);
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const container = contentRef.current;
      if (!container) {
        setScrollProgress(0);
        return;
      }
      const rect = container.getBoundingClientRect();
      const offsetTop = window.scrollY + rect.top;
      const total = container.offsetHeight - window.innerHeight * 0.5;
      const current = window.scrollY - offsetTop + 200;
      const progress =
        total > 0 ? Math.min(Math.max(current / total, 0), 1) : 0;
      setScrollProgress(progress);
    };

    const handleScroll = () => {
      requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    const title = article?.title || 'GEMA Article';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: article?.excerpt,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert('Link artikel berhasil disalin!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  const handleChecklistChange = (key: keyof typeof checklist) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleFeedbackSubmit = async () => {
    if (!isStudentLoggedIn) {
      alert('Hanya siswa yang sudah login yang dapat memberikan feedback!');
      return;
    }

    if (!rating || !feedback.trim()) {
      alert('Mohon berikan rating dan saran improvement!');
      return;
    }

    setSubmittingFeedback(true);
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...getStudentHeaders(),
      };

      const response = await fetch('/api/tutorial/feedback', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          articleId: article?.id,
          rating,
          comment: feedback,
          challenge,
          checklist
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(data.data.message || 'Terima kasih atas feedback Anda! 🎉');
        setFeedbackSubmitted(true);
        setRating(0);
        setFeedback('');
        setChallenge('');
        // Refresh feedback list
        fetchFeedback();
      } else {
        alert(data.error || 'Gagal mengirim feedback. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setSubmittingFeedback(false);
    }
  };
  const handleReactionSelect = async (value: string) => {
    if (!article?.id) {
      return;
    }
    if (!isStudentLoggedIn) {
      alert('Masuk sebagai siswa untuk memberikan reaksi.');
      return;
    }
    if (reactionSubmitting) {
      return;
    }

    const isRemoving = selectedReaction === value;
    setReactionSubmitting(true);
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...getStudentHeaders(),
      };
      const response = await fetch('/api/tutorial/reactions', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          articleId: article.id,
          reaction: isRemoving ? null : value,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setReactionCounts(data.data.counts || {});
        setSelectedReaction(isRemoving ? null : value);
      } else {
        alert(data.error || 'Gagal menyimpan reaksi.');
      }
    } catch (error) {
      console.error('Error saving reaction:', error);
      alert('Terjadi kesalahan saat menyimpan reaksi.');
    } finally {
      setReactionSubmitting(false);
    }
  };

  const handleQuizSelect = (value: string) => {
    setQuizSelection(value);
    setQuizFeedback(
      value === correctQuizAnswer
        ? "Jawaban kamu tepat! 🚀"
        : "Belum pas, baca ulang bagian overview ya.",
    );
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      alert("Kode berhasil disalin!");
    } catch {
      alert("Gagal menyalin kode.");
    }
  };

  const handleToggleUpvote = async (feedbackId: string) => {
    if (!isStudentLoggedIn) {
      alert('Masuk sebagai siswa untuk mendukung diskusi.');
      return;
    }

    setUpvoteInFlight(feedbackId);
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...getStudentHeaders(),
      };
      const response = await fetch('/api/tutorial/feedback/upvotes', {
        method: 'POST',
        headers,
        body: JSON.stringify({ feedbackId }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setRealFeedback((prev) =>
          prev.map((feedbackItem) =>
            feedbackItem.id === feedbackId
              ? {
                  ...feedbackItem,
                  upvotes: data.data.count,
                  hasUpvoted: data.data.upvoted,
                }
              : feedbackItem,
          ),
        );
      } else {
        alert(data.error || 'Gagal memperbarui dukungan.');
      }
    } catch (error) {
      console.error('Error toggling feedback upvote:', error);
      alert('Terjadi kesalahan saat memproses dukungan.');
    } finally {
      setUpvoteInFlight(null);
    }
  };

  const paragraphs = useMemo(() => splitContentIntoParagraphs(article?.content), [article?.content]);

  const steps = useMemo(
    () =>
      (paragraphs.length ? paragraphs : ["Rencanakan struktur konten", "Implementasikan UI modular", "Evaluasi dan perbaiki interaksi", "Bagikan dan minta feedback"]).slice(0, 4).map((text, idx) => {
        const sentences = text.split(/(?<=\.)\s+/);
        return {
          id: idx + 1,
          title: sentences[0]?.slice(0, 80) || `Langkah ${idx + 1}`,
          description: sentences.slice(1).join(" ").trim() || text,
          example: sentences[1] || sentences[0] || text,
        };
      }),
    [paragraphs],
  );

  const structuredSections = useMemo(() => {
    const bodyParagraphs = paragraphs.slice(4);
    const chunks = chunkArray(bodyParagraphs, 2);
    if (chunks.length === 0 && article) {
      return [
        {
          id: 1,
          title: article.title,
          description: paragraphs[0] || article.excerpt,
          body: paragraphs[1] || "",
        },
      ];
    }
    return chunks.map((chunk, idx) => ({
      id: idx + 1,
      title: chunk[0]?.split(".")[0] || `Bagian ${idx + 1}`,
      description: chunk[0] || "",
      body: chunk[1] || "",
    }));
  }, [paragraphs, article]);

  const codeSamples = useMemo(() => extractCodeSamples(article?.content), [article?.content]);

  const learningObjectives = useMemo(() => {
    const baseObjectives = [
      `Memahami konteks ${article?.category || "materi"} secara terstruktur.`,
      `Menerapkan ${article?.tags?.[0] || "konsep desain"} pada proyek nyata.`,
      `Mengukur hasil belajar melalui checklist & quiz mini.`,
    ];
    if (paragraphs[0]) {
      baseObjectives.push(paragraphs[0].split(".")[0]);
    }
    return baseObjectives.slice(0, 4);
  }, [article?.category, article?.tags, paragraphs]);

  const skills = useMemo(
    () =>
      article?.tags?.length
        ? article.tags.map((tag) => tag.replace(/-/g, " "))
        : ["HTML", "CSS", "JavaScript", "UI/UX"],
    [article?.tags],
  );

  const prerequisites = useMemo(() => {
    const category = article?.category?.toLowerCase() || "default";
    const presets: Record<string, string[]> = {
      tutorial: ["Dasar HTML & CSS", "Konsep responsive layout", "Editor favorit"],
      programming: ["Variabel & fungsi", "DOM manipulation", "Console debugging"],
      design: ["Grid system", "Color harmony", "Motion basics"],
      default: ["Rasa penasaran tinggi", "Laptop + koneksi stabil", "Catatan belajar"],
    };
    return presets[category] || presets.default;
  }, [article?.category]);

  const estimatedMinutes = article?.readTime || Math.max(steps.length * 4, 12);

  const difficultyPreset = useMemo(() => {
    const difficultyMap: Record<
      string,
      { label: string; emoji: string; tone: string }
    > = {
      tutorial: { label: "Intermediate", emoji: "🚀", tone: "text-indigo-600" },
      programming: { label: "Advance", emoji: "🧠", tone: "text-rose-500" },
      news: { label: "Foundational", emoji: "📚", tone: "text-emerald-600" },
      default: { label: "All Level", emoji: "✨", tone: "text-sky-600" },
    };
    return difficultyMap[article?.category?.toLowerCase() || "default"];
  }, [article?.category]);

  const callouts = useMemo(() => {
    const base = paragraphs.slice(2, 5);
    const fallbacks = [
      "Fokus pada value yang dihasilkan pengguna, bukan sekadar memenuhi checklist.",
      "Gunakan visual cues (warna, ikon, grid) untuk bantu storytelling konten.",
      "Validasi pekerjaanmu dengan testing kecil di setiap langkah.",
    ];
    const content = base.length > 0 ? base : fallbacks;
    return content.slice(0, 3).map((text, idx) => {
      const variants = [
        { tone: "info", emoji: "ℹ️", gradient: "from-sky-100 to-white" },
        { tone: "tip", emoji: "💡", gradient: "from-emerald-100 to-white" },
        { tone: "alert", emoji: "⚠️", gradient: "from-amber-100 to-white" },
      ];
      return {
        ...variants[idx % variants.length],
        body: text,
        title:
          variants[idx % variants.length].tone === "tip"
            ? "Insight"
            : variants[idx % variants.length].tone === "alert"
              ? "Perhatian"
              : "Informasi",
      };
    });
  }, [paragraphs]);

  const recommendedActions = useMemo(
    () => [
      {
        title: "Tutorial berikutnya",
        description: "Dalami materi lanjutan yang masih berhubungan.",
        href: "/tutorial",
        icon: "🧭",
        accent: "from-indigo-500 to-blue-500",
      },
      {
        title: "Latihan terkurasi",
        description: "Coba tantangan singkat untuk menguji pemahamanmu.",
        href: "/tutorial/assignments",
        icon: "🧩",
        accent: "from-emerald-500 to-teal-500",
      },
      {
        title: "Coding Lab",
        description: "Implementasi langsung di lab interaktif GEMA.",
        href: "/student/coding-lab",
        icon: "💻",
        accent: "from-purple-500 to-pink-500",
      },
      {
        title: "Diskusi komunitas",
        description: "Diskusikan tantanganmu di forum siswa.",
        href: "/tutorial?tab=diskusi",
        icon: "💬",
        accent: "from-orange-500 to-amber-500",
      },
    ],
    [],
  );

  const quizQuestion = useMemo(
    () =>
      article?.title
        ? `Apa fokus utama tutorial "${article.title}"?`
        : "Apa fokus utama tutorial ini?",
    [article?.title],
  );

  const reactionOptions = [
    { value: "love", emoji: "🔥", label: "Semangat!" },
    { value: "wow", emoji: "🤯", label: "Mind blown" },
    { value: "smart", emoji: "🤓", label: "Makin paham" },
    { value: "confused", emoji: "😕", label: "Masih bingung" },
  ];

  const quizOptions = useMemo(() => {
    const tag = article?.tags?.[0] || "responsive design";
    return [
      { value: "structure", label: `Menstruktur modul menjadi step-step ${tag}` },
      { value: "skip", label: "Melewati overview agar cepat selesai" },
      { value: "random", label: "Menaruh semua info tanpa prioritas" },
      { value: "style", label: "Fokus penuh ke warna terlebih dahulu" },
    ];
  }, [article?.tags]);

  const selectedQuizOption = useMemo(
    () => quizOptions.find((option) => option.value === quizSelection),
    [quizOptions, quizSelection],
  );

  const correctQuizAnswer = "structure";
  const heroIllustration = article?.imageUrl;
  const checklistItems: Array<{ key: keyof typeof checklist; label: string }> = [
    { key: "responsive", label: "Layout responsif di semua perangkat" },
    { key: "performance", label: "Loading time < 3 detik" },
    { key: "hover", label: "Hover dan micro interaction terasa natural" },
    { key: "lightbox", label: "Lightbox / dialog bekerja mulus" },
    { key: "navigation", label: "Navigasi keyboard friendly" },
  ];

  const checklistProgress = useMemo(() => {
    const values = Object.values(checklist);
    const completed = values.filter(Boolean).length;
    const total = values.length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { completed, total, percent };
  }, [checklist]);

  const isChecklistComplete =
    checklistProgress.total > 0 && checklistProgress.completed === checklistProgress.total;

  const averageRatingDisplay =
    feedbackStats?.averageRating != null
      ? feedbackStats.averageRating.toFixed(1)
      : "0.0";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Artikel Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">{error || 'Artikel yang Anda cari tidak tersedia.'}</p>
          <Link 
            href="/tutorial"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Tutorial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#ecf5ff] via-white to-[#f4efff]">
      <div className="pointer-events-none fixed right-6 top-1/3 z-40 hidden flex-col items-center gap-3 text-slate-500 lg:flex">
        <span className="text-[11px] uppercase tracking-[0.3em]">Progress</span>
        <div className="relative h-44 w-1 overflow-hidden rounded-full bg-slate-200">
          <div
            className="absolute bottom-0 left-0 w-full rounded-full bg-gradient-to-b from-[#06B6D4] via-[#4F46E5] to-[#BE185D]"
            style={{ height: `${Math.round(scrollProgress * 100)}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-slate-600">
          {Math.round(scrollProgress * 100)}%
        </span>
      </div>
      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-30 -mx-4 mb-10 flex items-center justify-between border-b border-white/40 bg-white/80 px-4 py-4 backdrop-blur-lg dark:bg-slate-900/80">
          <Link
            href="/tutorial"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:-translate-x-1 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            {isStudentLoggedIn && (
              <div className="hidden flex-col text-right leading-tight sm:flex">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Sedang belajar
                </span>
                <span className="font-semibold text-slate-700">{displayName}</span>
                {displayMeta && (
                  <span className="text-xs text-slate-400">{displayMeta}</span>
                )}
              </div>
            )}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#06B6D4] to-[#4F46E5] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#4F46E5]/30 transition hover:shadow-xl"
            >
              <Share2 className="h-4 w-4" />
              Bagikan
            </button>
          </div>
        </header>

        <section className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-[#dff3ff] via-white to-[#f6e8ff] p-8 shadow-xl">
          <div className="absolute inset-0">
            <div className="absolute -top-12 right-10 h-32 w-32 rounded-full bg-[#4F46E5]/15 blur-3xl" />
            <div className="absolute bottom-0 left-6 h-24 w-24 rounded-full bg-[#06B6D4]/10 blur-2xl" />
          </div>
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row">
            <div className="flex-1 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1 text-sm font-semibold text-slate-800 shadow">
                  <Sparkles className="h-4 w-4 text-[#06B6D4]" />
                  {article.category}
                </span>
                {article.tags?.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    #{tag.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {article.title}
              </h1>
              {article.excerpt && (
                <p className="max-w-2xl text-lg text-slate-600">{article.excerpt}</p>
              )}
              <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>{estimatedMinutes} menit</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-slate-400" />
                  <span>{article.views.toLocaleString("id-ID")} views</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em] text-slate-400">
                <span>
                  {difficultyPreset.emoji} {difficultyPreset.label}
                </span>
                <span>#{article.slug}</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#overview"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/30 transition hover:-translate-y-0.5"
                >
                  Mulai eksplor
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/student/coding-lab"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Buka Coding Lab
                </Link>
              </div>
            </div>
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#c7f4ff] via-white to-[#f7d5ff] shadow-inner" />
              <div className="relative rounded-3xl border border-white/60 bg-white/80 p-6 text-center shadow-2xl backdrop-blur">
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                  Visual Insight
                </p>
                <div
                  className="mt-4 h-48 w-full overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-[#4F46E5]/10 to-[#06B6D4]/10"
                  style={
                    heroIllustration
                      ? {
                          backgroundImage: `url(${heroIllustration})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                />
                <p className="mt-4 text-sm text-slate-500">
                  Visualisasikan step penting dengan panel modular & timeline.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="overview"
          className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              🎯 Objectives
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {learningObjectives.map((objective, idx) => (
                <li key={`objective-${idx}`} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#06B6D4]" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              🧩 Skill set
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-slate-900/5 px-3 py-1 text-sm font-semibold text-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              🔑 Prasyarat
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {prerequisites.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-[#4F46E5]">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              🕒 Waktu & Level
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-900">{estimatedMinutes}m</p>
                <p className="text-xs text-slate-500">Estimasi belajar</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${difficultyPreset.tone}`}>
                  {difficultyPreset.emoji} {difficultyPreset.label}
                </p>
                <p className="text-xs text-slate-400">
                  {article.tags?.[0] || "Project readiness"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section ref={contentRef} className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-10">
            {structuredSections.map((section) => (
              <div
                key={`section-${section.id}`}
                className="rounded-3xl border border-white/60 bg-white/90 p-8 shadow"
              >
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                  Bagian {section.id.toString().padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                  {section.title}
                </h3>
                <p className="mt-4 text-base text-slate-600">{section.description}</p>
                {section.body && (
                  <p className="mt-3 text-sm text-slate-500">{section.body}</p>
                )}
              </div>
            ))}

            <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
              <div className="absolute inset-0 opacity-10">
                <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_60%)]" />
              </div>
              <div className="relative space-y-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-300">Timeline</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Ikuti langkah modul</h3>
                </div>
                <div className="space-y-8">
                  {steps.map((step, idx) => (
                    <div key={step.id} className="relative flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white">
                          {step.id.toString().padStart(2, "0")}
                        </div>
                        {idx !== steps.length - 1 && <span className="mt-2 h-12 w-px bg-white/30" />}
                      </div>
                      <div className="flex-1 rounded-2xl bg-white/10 p-4 shadow-inner">
                        <h4 className="font-semibold text-white">{step.title}</h4>
                        <p className="mt-2 text-sm text-white/80">{step.description}</p>
                        {step.example && (
                          <p className="mt-2 text-xs uppercase tracking-wide text-teal-200">
                            Contoh: {step.example}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {codeSamples.length > 0 && (
              <div className="overflow-hidden rounded-3xl border border-slate-900/10 bg-slate-900 text-sm text-white shadow-xl">
                {codeSamples.map((sample, idx) => (
                  <div key={`${sample.language}-${idx}`} className="border-t border-white/5 first:border-t-0">
                    <div className="flex items-center justify-between border-b border-white/5 px-6 py-3 text-xs uppercase tracking-[0.3em] text-slate-300">
                      <span>{sample.language}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(sample.code)}
                        className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold hover:bg-white/20"
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="overflow-x-auto px-6 py-4 text-sm leading-relaxed">
                      <code>{sample.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-3xl border border-white/60 bg-white/90 p-8 shadow">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="md:w-1/2">
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                    Visual Example
                  </p>
                  <h4 className="mt-2 text-2xl font-semibold text-slate-900">Story-driven layout</h4>
                  <p className="mt-2 text-sm text-slate-600">
                    Gunakan garis konektor, badge step, dan warna lembut untuk membantu siswa mengikuti konteks tanpa harus membaca paragraf panjang.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <div
                    className="h-48 rounded-2xl border border-dashed border-slate-200 bg-slate-100"
                    style={
                      heroIllustration
                        ? {
                            backgroundImage: `url(${heroIllustration})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : undefined
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {callouts.map((callout, idx) => (
                <div
                  key={`${callout.tone}-${idx}`}
                  className={`rounded-2xl border border-white/60 bg-gradient-to-br ${callout.gradient} p-5 shadow`}
                >
                  <p className="text-sm font-semibold text-slate-700">
                    {callout.emoji} {callout.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{callout.body}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                Quick stats
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Publikasi</span>
                  <span className="font-semibold">{formatDate(article.publishedAt)}</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Pembaruan</span>
                  <span className="font-semibold">{formatDate(article.updatedAt)}</span>
                </li>
                <li className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Kategori</span>
                  <span className="font-semibold capitalize">{article.category}</span>
                </li>
                <li className="flex justify-between">
                  <span>Total views</span>
                  <span className="font-semibold">{article.views.toLocaleString("id-ID")}</span>
                </li>
              </ul>
            </div>

            <div
              id="mini-quiz"
              className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow"
            >
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Mini Quiz</p>
              <p className="mt-3 text-sm font-semibold text-slate-900">{quizQuestion}</p>
              <div className="mt-4 space-y-2">
                {quizOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleQuizSelect(option.value)}
                    className={`w-full rounded-2xl border px-3 py-2 text-left text-sm transition ${
                      quizSelection === option.value
                        ? "border-[#06B6D4] bg-[#06B6D4]/10 text-[#0f5c68]"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {quizFeedback && (
                <p className="mt-3 text-xs font-medium text-[#06B6D4]">{quizFeedback}</p>
              )}
            </div>

            <div className="rounded-3xl border border-dashed border-[#06B6D4]/40 bg-[#06B6D4]/5 p-6 text-sm text-slate-700 shadow">
              <p className="font-semibold text-[#0f5c68]">Diskusi aktif</p>
              <p className="mt-2">
                Gabung diskusi untuk berbagi kemajuan dan bertanya hal teknis.
              </p>
              <Link
                href="/tutorial?tab=diskusi"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0f5c68] hover:underline"
              >
                Buka forum
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </section>

        <section className="mt-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Lab interaktif</p>
              <h2 className="text-2xl font-semibold text-slate-900">Tetapkan ritme belajar</h2>
            </div>
            <p className="text-sm text-slate-500 sm:max-w-md">
              Widget interaktif menjaga fokusmu: pilih reaksi, cek progress checklist, dan ulangi kuis mini bila perlu.
            </p>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-white/60 bg-white/95 p-6 shadow">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Reactions</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">Mood belajarmu</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {reactionOptions.map((reaction) => (
                  <button
                    key={reaction.value}
                    type="button"
                    onClick={() => handleReactionSelect(reaction.value)}
                    disabled={reactionSubmitting}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      selectedReaction === reaction.value
                        ? "border-[#06B6D4] bg-[#06B6D4]/10 text-[#0f5c68]"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    } ${reactionSubmitting ? "opacity-60" : ""}`}
                  >
                    <span className="text-lg">{reaction.emoji}</span>
                    <span className="flex flex-col text-left leading-tight">
                      <span>{reaction.label}</span>
                      <span className="text-[10px] uppercase tracking-wide text-slate-400">
                        × {reactionCounts[reaction.value] ?? 0}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              {selectedReaction && (
                <p className="mt-4 text-xs font-semibold text-[#0f5c68]">
                  Terima kasih! Kami catat reaksimu.
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-white/60 bg-white/95 p-6 shadow">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Checklist</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">Sudah siap dipamerkan?</h3>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {checklistProgress.completed}/{checklistProgress.total} selesai
                  </span>
                  <span>{checklistProgress.percent}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#06B6D4] via-[#4F46E5] to-[#BE185D]"
                    style={{ width: `${checklistProgress.percent}%` }}
                  />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {checklistItems.map((item) => (
                  <label
                    key={item.key}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-100 bg-white px-3 py-2 text-sm text-slate-600 transition hover:border-slate-200"
                  >
                    <input
                      type="checkbox"
                      checked={checklist[item.key]}
                      onChange={() => handleChecklistChange(item.key)}
                      className="h-4 w-4 rounded border-slate-300 text-[#06B6D4] focus:ring-[#06B6D4]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
              {isChecklistComplete && (
                <p className="mt-4 text-xs font-semibold text-emerald-600">
                  ✅ Checklist tuntas! Saatnya share hasilmu.
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-white/60 bg-white/95 p-6 shadow">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Mini Quiz</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">Review pemahaman</h3>
              {quizSelection ? (
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">Pilihanmu</p>
                  <p>{selectedQuizOption?.label}</p>
                  {quizFeedback && (
                    <p className="text-xs font-semibold text-[#06B6D4]">{quizFeedback}</p>
                  )}
                  <Link
                    href="#mini-quiz"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#0f5c68] hover:underline"
                  >
                    Ulangi kuis
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="mt-4 text-sm text-slate-600">
                  <p>Belum jawab kuis mini. Ambil 1 menit untuk mengecek pemahamanmu.</p>
                  <Link
                    href="#mini-quiz"
                    className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#0f5c68] hover:underline"
                  >
                    Ambil kuis
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/60 bg-white/95 p-6 shadow">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Challenge</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">Micro challenge</h3>
              <p className="mt-2 text-sm text-slate-600">
                Buat variasi layout masonry dengan 3 breakpoints dan kirim preview ke forum diskusi. Tambahkan label emoji untuk kategori foto.
              </p>
              <Link
                href="/tutorial?tab=diskusi"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0f5c68] hover:underline"
              >
                Bagikan di forum
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.85fr)]">
          <div className="rounded-3xl border border-white/60 bg-white/95 p-8 shadow-lg">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Feedback siswa</p>
                <h3 className="text-2xl font-semibold text-slate-900">Bagikan insight untuk pengajar</h3>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-900/90 px-5 py-3 text-white shadow">
                <p className="text-2xl font-bold">
                  {averageRatingDisplay}
                  <span className="text-sm font-normal opacity-70">/5</span>
                </p>
                <p className="text-[11px] uppercase tracking-[0.4em] text-slate-200">
                  {feedbackStats?.totalFeedback ?? 0} respon
                </p>
              </div>
            </div>
            {!isStudentLoggedIn && (
              <div className="mt-6 rounded-2xl border border-dashed border-[#06B6D4]/40 bg-[#06B6D4]/5 p-4 text-sm text-slate-700">
                <p className="font-semibold">Masuk terlebih dahulu</p>
                <p className="mt-1 text-xs text-slate-500">
                  Login siswa wajib agar tanggapanmu tercatat sebagai bagian dari diskusi kelas.
                </p>
                <Link
                  href={loginRedirect}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0f5c68] hover:underline"
                >
                  <LogIn className="h-4 w-4" />
                  Masuk sebagai siswa
                </Link>
              </div>
            )}
            <div className="mt-6 space-y-6">
              <div>
                <p className="text-sm font-semibold text-slate-600">Nilai pengalamanmu</p>
                <div className="mt-3 flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={`rating-${value}`}
                      type="button"
                      disabled={!isStudentLoggedIn}
                      onClick={() => setRating(value)}
                      className={`rounded-full p-2 transition ${
                        value <= rating
                          ? "text-amber-400"
                          : "text-slate-300"} ${
                        isStudentLoggedIn ? "hover:scale-110" : "cursor-not-allowed"
                      }`}
                    >
                      <Star
                        className={`h-5 w-5 ${
                          value <= rating ? "fill-amber-400 text-amber-400" : ""
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-xs font-semibold text-[#0f5c68]">{rating} / 5</span>
                  )}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Insight utama
                  </label>
                  <textarea
                    rows={4}
                    disabled={!isStudentLoggedIn}
                    value={feedback}
                    onChange={(event) => setFeedback(event.target.value)}
                    placeholder="Apa yang paling membantu atau perlu diperjelas?"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#06B6D4] disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Tantangan berikutnya
                  </label>
                  <textarea
                    rows={4}
                    disabled={!isStudentLoggedIn}
                    value={challenge}
                    onChange={(event) => setChallenge(event.target.value)}
                    placeholder="Apa tantangan pribadi yang ingin kamu selesaikan setelah materi ini?"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#06B6D4] disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleFeedbackSubmit}
                disabled={!isStudentLoggedIn || submittingFeedback}
                className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition ${
                  !isStudentLoggedIn || submittingFeedback
                    ? "bg-slate-400"
                    : "bg-gradient-to-r from-[#06B6D4] to-[#4F46E5] hover:shadow-xl"
                }`}
              >
                {submittingFeedback ? "Mengirim..." : "Kirim feedback"}
                <Send className="h-4 w-4" />
              </button>
              {feedbackSubmitted && (
                <p className="text-xs font-semibold text-emerald-600">
                  🎉 Terima kasih! Feedback-mu sudah tersimpan.
                </p>
              )}
            </div>
          </div>
          <div className="rounded-3xl border border-white/60 bg-white/95 p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Diskusi & insight</p>
                <h3 className="text-2xl font-semibold text-slate-900">Percakapan terbaru</h3>
              </div>
              <MessageCircle className="h-6 w-6 text-[#06B6D4]" />
            </div>
            <div className="mt-6 max-h-[420px] space-y-4 overflow-y-auto pr-1">
              {feedbackLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={`feedback-skeleton-${idx}`}
                    className="animate-pulse rounded-2xl border border-slate-100 bg-slate-50 p-5"
                  >
                    <div className="h-4 w-1/3 rounded bg-slate-200" />
                    <div className="mt-3 h-3 w-2/3 rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-slate-200" />
                  </div>
                ))
              ) : realFeedback.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-sm text-slate-600">
                  Belum ada diskusi. Jadilah siswa pertama yang memberi feedback dan ajukan pertanyaanmu.
                </div>
              ) : (
                realFeedback.slice(0, 4).map((item, idx) => {
                  const isUpvoted = item.hasUpvoted;
                  const upvoteCount = item.upvotes;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border p-5 shadow-sm ${
                        idx === 0
                          ? "border-sky-100 bg-gradient-to-br from-[#ecf8ff] to-white"
                          : "border-slate-100 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <div>
                          <p className="font-semibold text-slate-900">{item.studentName}</p>
                          <p className="text-xs text-slate-400">{item.studentClass || "Siswa GEMA"}</p>
                        </div>
                        <span className="text-xs text-slate-400">{item.timeAgo}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-amber-400">
                        {Array.from({ length: 5 }).map((_, starIdx) => (
                          <Star
                            key={`${item.id}-star-${starIdx}`}
                            className={`h-4 w-4 ${
                              starIdx < item.rating ? "fill-amber-300" : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      {item.comment && (
                        <p className="mt-3 text-sm text-slate-700">{item.comment}</p>
                      )}
                      {item.challenge && (
                        <p className="mt-2 text-xs text-[#0f5c68]">🎯 Fokus: {item.challenge}</p>
                      )}
                      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-slate-600">{upvoteCount} dukungan</span>
                        <button
                          type="button"
                          onClick={() => handleToggleUpvote(item.id)}
                          disabled={upvoteInFlight === item.id}
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-semibold transition ${
                            isUpvoted
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 text-slate-500 hover:border-slate-300"
                          } ${upvoteInFlight === item.id ? "opacity-60" : ""}`}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          {isUpvoted ? "Didukung" : "Dukung"}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <Link
              href="/tutorial?tab=diskusi"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0f5c68] hover:underline"
            >
              Lanjut ke forum diskusi
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mt-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Next actions</p>
              <h3 className="text-2xl font-semibold text-slate-900">Lanjutkan perjalanan belajar</h3>
            </div>
            <p className="text-sm text-slate-500 sm:max-w-md">
              Kami siapkan beberapa langkah curated agar kamu langsung menerapkan materi ke konteks baru.
            </p>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {recommendedActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group relative overflow-hidden rounded-3xl border border-white/50 bg-white/95 p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${action.accent} opacity-0 transition group-hover:opacity-10`}
                />
                <div className="relative flex items-start justify-between gap-6">
                  <div>
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/5 text-2xl">
                      {action.icon}
                    </span>
                    <h4 className="mt-4 text-xl font-semibold text-slate-900">{action.title}</h4>
                    <p className="mt-2 text-sm text-slate-600">{action.description}</p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-700" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
