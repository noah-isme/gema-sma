"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  Component,
  type ErrorInfo,
  type ReactNode,
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Calendar,
  Camera,
  ChevronRight,
  Code2,
  GraduationCap,
  MapPin,
  Megaphone,
  MonitorPlay,
  Sparkles,
  Users,
} from "lucide-react";
import LogoAnimated from "@/components/LogoAnimated";

const VideoLogo = dynamic(() => import("@/components/branding/VideoLogo"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-[#6C63FF]/10 to-[#5EEAD4]/10">
      <div className="h-12 w-12 animate-pulse rounded-full bg-[#6C63FF]/20" />
    </div>
  ),
});
import { useTheme } from "@/components/theme/ThemeProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SkipLink } from "@/components/ui/SkipLink";
import { SkeletonGrid } from "@/components/ui/Skeleton";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useParallaxMotion } from "@/hooks/useParallaxMotion";

const VantaBackground = dynamic(() => import("@/components/landing/VantaBackground"), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(108,99,255,0.22),transparent_68%)]"
      aria-hidden="true"
    />
  ),
});

interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  participants: number;
  category: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  publishedAt: string;
}

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: string;
  description: string;
}


interface Stats {
  totalStudents: number;
  totalTutorials: number;
  totalCodingLabs: number;
  totalActivities: number;
  totalAnnouncements: number;
  totalGalleryItems: number;
  totalAssignments: number;
  completedAssignments: number;
  upcomingEventsToday: number;
  upcomingEventsThisWeek: number;
}

const typedPhrases = [
  "Platform LMS terlengkap untuk Informatika SMA",
  "Coding Lab, Tutorial, Quiz - semua dalam satu tempat",
  "Belajar pemrograman jadi lebih mudah dan terstruktur",
  "Sistem penilaian otomatis dan tracking progress real-time",
];

const heroEmojis = [
  { symbol: "💡", label: "Ide kreatif" },
  { symbol: "⚡", label: "Energi kolaborasi" },
  { symbol: "💻", label: "Eksperimen coding" },
];

type FeatureAccent = {
  primary: string;
  secondary: string;
  spotlight: string;
  shadow: string;
  hoverShadow: string;
  emoji: string;
  label: string;
};

interface FeatureCardConfig {
  title: string;
  description: string;
  highlights: string[];
  icon: typeof BarChart3;
  accent: FeatureAccent;
}

const featuresData: FeatureCardConfig[] = [
  {
    title: "Dashboard & Tracking",
    description:
      "Lihat sejauh mana kamu sudah melangkah — tiap baris kode bikinmu makin jago! 🚀 Dashboard real-time yang bikin kamu paham progress belajar dengan visualisasi yang keren.",
    highlights: ["Progress Real-time", "Analitik Visual", "Badge Achievement"],
    icon: BarChart3,
    accent: {
      primary: "#6366F1", // Indigo
      secondary: "#06B6D4", // Cyan
      spotlight: "rgba(99, 102, 241, 0.25)",
      shadow: "0 20px 50px rgba(99, 102, 241, 0.15)",
      hoverShadow: "0 8px 30px rgba(99, 102, 241, 0.15)",
      emoji: "🔮",
      label: "Step 1",
    },
  },
  {
    title: "Interactive Coding Lab",
    description:
      "Langsung praktik coding di browser. Dapat feedback instan kayak punya mentor pribadi! 💻 Nggak perlu install apapun — code, test, dan lihat hasilnya langsung.",
    highlights: ["Auto-grading", "Multi-language", "Instant Feedback"],
    icon: Code2,
    accent: {
      primary: "#06B6D4", // Cyan
      secondary: "#10B981", // Green
      spotlight: "rgba(6, 182, 212, 0.25)",
      shadow: "0 20px 50px rgba(6, 182, 212, 0.15)",
      hoverShadow: "0 8px 30px rgba(6, 182, 212, 0.15)",
      emoji: "⚡",
      label: "Step 2",
    },
  },
  {
    title: "Learning Path",
    description:
      "Belajar konsepnya, lalu coba bikin proyekmu sendiri. Belajar nggak harus ngebosenin! 🎯 Video, artikel, dan quiz interaktif yang bikin kamu paham lebih dalam.",
    highlights: ["Kurikulum Lengkap", "Video Tutorial", "Interactive Quiz"],
    icon: MonitorPlay,
    accent: {
      primary: "#EC4899", // Pink
      secondary: "#A855F7", // Purple
      spotlight: "rgba(236, 72, 153, 0.25)",
      shadow: "0 20px 50px rgba(236, 72, 153, 0.15)",
      hoverShadow: "0 8px 30px rgba(236, 72, 153, 0.15)",
      emoji: "🧠",
      label: "Step 3",
    },
  },
];

const heroSpotlightCards = [
  {
    title: "Nilai Otomatis",
    caption: "Langsung tahu nilaimu begitu selesai ngerjain tugas atau kuis.",
    accent: "#5EEAD4",
  },
  {
    title: "Banyak Bahasa Coding",
    caption: "Belajar Python, JavaScript, HTML/CSS lengkap dalam satu tempat.",
    accent: "#F4B5FF",
  },
  {
    title: "Pantau Progres Belajar",
    caption: "Liat perkembangan belajarmu lewat dashboard yang mudah dimengerti.",
    accent: "#FFDB7D",
  },
];

const gradientBackground =
  "bg-[radial-gradient(circle_at_top,_rgba(108,99,255,0.18),transparent_65%)]";

type AccentPalette = {
  primary: string;
  secondary: string;
  tertiary?: string;
  glow: string;
  surface: string;
  label: string;
  emoji?: string;
};

const statsAccents: AccentPalette[] = [
  {
    primary: "#6C63FF",
    secondary: "#9C8BFF",
    tertiary: "rgba(108, 99, 255, 0.18)",
    glow: "0 22px 55px rgba(108, 99, 255, 0.22)",
    surface: "",
    label: "Aktif",
    emoji: "🚀",
  },
  {
    primary: "#5EEAD4",
    secondary: "#53C8FF",
    tertiary: "rgba(94, 234, 212, 0.2)",
    glow: "0 22px 55px rgba(83, 200, 255, 0.2)",
    surface: "",
    label: "Kolaborasi",
    emoji: "🤝",
  },
  {
    primary: "#FFB347",
    secondary: "#FFCF86",
    tertiary: "rgba(255, 179, 71, 0.24)",
    glow: "0 22px 55px rgba(255, 179, 71, 0.22)",
    surface: "",
    label: "Pembelajaran",
    emoji: "📘",
  },
  {
    primary: "#FF99CC",
    secondary: "#FFB4E3",
    tertiary: "rgba(255, 153, 204, 0.24)",
    glow: "0 22px 55px rgba(255, 153, 204, 0.2)",
    surface: "",
    label: "Prestasi",
    emoji: "🏆",
  },
];

const activityAccents: AccentPalette[] = [
  {
    primary: "#6C63FF",
    secondary: "#8B7CFF",
    glow: "0 24px 60px rgba(108, 99, 255, 0.22)",
    surface: "",
    label: "Bootcamp",
  },
  {
    primary: "#5EEAD4",
    secondary: "#58D3FF",
    glow: "0 24px 60px rgba(94, 234, 212, 0.22)",
    surface: "",
    label: "Workshop",
  },
  {
    primary: "#FF99CC",
    secondary: "#FFB3E2",
    glow: "0 24px 60px rgba(255, 153, 204, 0.22)",
    surface: "",
    label: "Community",
  },
];

const announcementAccentMap: Record<string, AccentPalette> = {
  info: {
    primary: "#0ea5e9", // sky-500
    secondary: "#22d3ee", // cyan-400
    glow: "0 20px 45px rgba(14, 165, 233, 0.25)",
    surface: "",
    label: "Info",
    emoji: "ℹ️",
  },
  warning: {
    primary: "#fbbf24", // amber-400
    secondary: "#f97316", // orange-500
    glow: "0 20px 45px rgba(251, 191, 36, 0.3)",
    surface: "",
    label: "Penting",
    emoji: "⚠️",
  },
  success: {
    primary: "#10b981", // emerald-500
    secondary: "#22c55e", // green-400
    glow: "0 20px 45px rgba(16, 185, 129, 0.25)",
    surface: "",
    label: "Kabar Baik",
    emoji: "✅",
  },
  highlight: {
    primary: "#4f46e5", // indigo-600
    secondary: "#8b5cf6", // violet-500
    glow: "0 20px 45px rgba(79, 70, 229, 0.35)",
    surface: "",
    label: "Featured",
    emoji: "✨",
  },
  event: {
    primary: "#6C63FF",
    secondary: "#8F83FF",
    glow: "0 20px 45px rgba(108, 99, 255, 0.2)",
    surface: "",
    label: "Event",
    emoji: "📅",
  },
  achievement: {
    primary: "#10b981",
    secondary: "#22c55e",
    glow: "0 20px 45px rgba(16, 185, 129, 0.25)",
    surface: "",
    label: "Prestasi",
    emoji: "🏆",
  },
};

const galleryAccents: AccentPalette[] = [
  {
    primary: "#6C63FF",
    secondary: "#5EEAD4",
    glow: "0 20px 45px rgba(108, 99, 255, 0.18)",
    surface: "",
    label: "Labs",
  },
  {
    primary: "#FF99CC",
    secondary: "#FFD1DC",
    glow: "0 20px 45px rgba(255, 153, 204, 0.2)",
    surface: "",
    label: "Kolaborasi",
  },
  {
    primary: "#5EEAD4",
    secondary: "#6DB2FF",
    glow: "0 20px 45px rgba(94, 234, 212, 0.2)",
    surface: "",
    label: "Eksplorasi",
  },
];

const galleryCategoryMap: Record<string, { primary: string; secondary: string; mood: string; emoji: string; label: string }> = {
  workshop: {
    primary: "#06b6d4", // cyan-500
    secondary: "#6366f1", // indigo-500
    mood: "Fokus & Produktif",
    emoji: "💻",
    label: "Workshop",
  },
  prestasi: {
    primary: "#fbbf24", // amber-400
    secondary: "#f59e0b", // amber-500
    mood: "Membanggakan",
    emoji: "🏆",
    label: "Prestasi",
  },
  sosial: {
    primary: "#ec4899", // pink-500
    secondary: "#f472b6", // pink-400
    mood: "Kolaboratif",
    emoji: "🤝",
    label: "Sosial",
  },
  keagamaan: {
    primary: "#10b981", // emerald-500
    secondary: "#14b8a6", // teal-500
    mood: "Reflektif",
    emoji: "🕌",
    label: "Keagamaan",
  },
  umum: {
    primary: "#3b82f6", // blue-500
    secondary: "#64748b", // slate-500
    mood: "Kredibel",
    emoji: "📸",
    label: "Umum",
  },
};


class InteractiveBackgroundBoundary
  extends Component<{ children: ReactNode }, { hasError: boolean }>
{
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Interactive background failed to render", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div className={`absolute inset-0 ${gradientBackground}`} aria-hidden="true" />;
    }

    return this.props.children;
  }
}

const formatStatValue = (value: number | undefined, suffix = "") =>
  `${(value ?? 0).toLocaleString("id-ID")}${suffix}`;

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function HomePage() {
  const heroRef = useRef<HTMLElement | null>(null);
  const heroTitleRef = useRef<HTMLHeadingElement | null>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement | null>(null);
  const heroButtonsRef = useRef<HTMLDivElement | null>(null);
  const typedRef = useRef<HTMLSpanElement | null>(null);
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const activitiesRef = useRef<HTMLDivElement | null>(null);
  const announcementsRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const ctaButtonRef = useRef<HTMLAnchorElement | null>(null);
  const lottieContainerRef = useRef<HTMLDivElement | null>(null);
  const countersRef = useRef<Array<HTMLSpanElement | null>>([]);

  const { resolvedTheme } = useTheme();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [activeActivityFilter, setActiveActivityFilter] = useState<string>("Semua");
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalTutorials: 0,
    totalCodingLabs: 0,
    totalActivities: 0,
    totalAnnouncements: 0,
    totalGalleryItems: 0,
    totalAssignments: 0,
    completedAssignments: 0,
    upcomingEventsToday: 0,
    upcomingEventsThisWeek: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const [shouldRenderVanta, setShouldRenderVanta] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLottieLoaded, setIsLottieLoaded] = useState(false);

  const prefersReducedMotion = usePrefersReducedMotion();
  useParallaxMotion({ disabled: prefersReducedMotion });

  useKeyboardNavigation({
    onEnter: () => {
      const sections = [
        "hero",
        "features",
        "stats",
        "activities",
        "announcements",
        "gallery",
        "cta",
      ];
      const currentIndex = sections.indexOf(activeSection);
      const nextIndex = (currentIndex + 1) % sections.length;
      setActiveSection(sections[nextIndex]);
      document.getElementById(sections[nextIndex])?.focus();
    },
    onEscape: () => setActiveSection("hero"),
  });

  const fetchPublicData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch both public data and stats in parallel
      const [publicResponse, statsResponse] = await Promise.all([
        fetch(`/api/public`, {
          next: { revalidate: 3600 }, // ISR: revalidate every 1 hour
        }),
        fetch(`/api/public-stats`, {
          next: { revalidate: 3600 }, // ISR: revalidate every 1 hour
        }),
      ]);

      if (publicResponse.ok) {
        const data = await publicResponse.json();
        if (data.success) {
          setActivities(data.data.activities ?? []);
          setAnnouncements(data.data.announcements ?? []);
          setGallery(data.data.gallery ?? []);
        }
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData.success) {
          setStats(statsData.data);
        }
      }
    } catch (error) {
      console.error("Error fetching public data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublicData().catch(() => null);
  }, [fetchPublicData]);

  // Activate scroll reveal for all [data-scroll-reveal] elements
  useScrollReveal({
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
    once: true,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const updateShouldRender = () => {
      setShouldRenderVanta(!prefersReducedMotion && !mobileQuery.matches);
    };
    updateShouldRender();
    const handleChange = () => updateShouldRender();
    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", handleChange);
    } else if (typeof mobileQuery.addListener === "function") {
      mobileQuery.addListener(handleChange);
    }
    return () => {
      if (typeof mobileQuery.removeEventListener === "function") {
        mobileQuery.removeEventListener("change", handleChange);
      } else if (typeof mobileQuery.removeListener === "function") {
        mobileQuery.removeListener(handleChange);
      }
    };
  }, [prefersReducedMotion]);

  // Simple JS typewriter effect (native, no library)
  useEffect(() => {
    if (!typedRef.current || prefersReducedMotion) {
      if (typedRef.current) {
        typedRef.current.textContent = typedPhrases[0];
      }
      return;
    }

    let currentPhraseIndex = 0;
    const interval = setInterval(() => {
      currentPhraseIndex = (currentPhraseIndex + 1) % typedPhrases.length;
      if (typedRef.current) {
        typedRef.current.textContent = typedPhrases[currentPhraseIndex];
      }
    }, 3000);

    typedRef.current.textContent = typedPhrases[0];

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  // Hero animations now use native CSS (hero-title, hero-subtitle, hero-cta classes)

  useEffect(() => {
    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      setScrollProgress(total > 0 ? scrollTop / total : 0);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  const handleFeaturePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (prefersReducedMotion) {
        return;
      }

      const card = event.currentTarget;
      const rect = card.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      const rotateY = ((offsetX / rect.width) - 0.5) * 10;
      const rotateX = (0.5 - offsetY / rect.height) * 10;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.01)`;
      card.style.setProperty("--spotlight-x", `${offsetX}px`);
      card.style.setProperty("--spotlight-y", `${offsetY}px`);
    },
    [prefersReducedMotion],
  );

  const handleFeaturePointerLeave = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const card = event.currentTarget;
      card.style.transform = "";
      card.style.setProperty("--spotlight-x", "50%");
      card.style.setProperty("--spotlight-y", "50%");
    },
    [],
  );

  // Feature cards animation now handled by useScrollReveal hook + CSS
  // Native Intersection Observer triggers .scroll-reveal animations with stagger delays

  const statsItems = useMemo(
    () => [
      {
        label: "Siswa Aktif",
        value: stats.totalStudents,
        suffix: "+",
        description: "Teman-teman yang lagi asik belajar coding bareng di GEMA setiap hari.",
        emoji: "👨‍💻",
        icon: Users,
        color: "#6366F1", // Indigo - community & trust
        gradient: "from-[#6366F1] to-[#06B6D4]",
      },
      {
        label: "Materi Pembelajaran",
        value: stats.totalTutorials,
        suffix: "+",
        description: "Tutorial dan artikel interaktif yang bikin belajar coding jadi lebih asik!",
        emoji: "📚",
        icon: BookOpenCheck,
        color: "#06B6D4", // Cyan - exploration & ideas
        gradient: "from-[#06B6D4] to-[#10B981]",
      },
      {
        label: "Coding Lab Interaktif",
        value: stats.totalCodingLabs,
        suffix: "+",
        description: "Lab coding yang langsung kasih feedback — tulis code, langsung ngerti hasilnya.",
        emoji: "⚡",
        icon: Code2,
        color: "#F59E0B", // Amber - energy & action
        gradient: "from-[#F59E0B] to-[#EF4444]",
      },
      {
        label: "Tugas Berhasil",
        value: stats.completedAssignments,
        suffix: "+",
        description: "Setiap minggu, banyak banget tugas coding yang berhasil diselesaikan! 💪",
        emoji: "🎯",
        icon: GraduationCap,
        color: "#EC4899", // Pink - achievement & passion
        gradient: "from-[#EC4899] to-[#A855F7]",
      },
    ],
    [stats],
  );

  useEffect(() => {
    if (!statsRef.current) {
      return;
    }

    if (prefersReducedMotion) {
      statsItems.forEach((stat, index) => {
        const target = countersRef.current[index];
        if (target) {
          target.textContent = formatStatValue(stat.value, stat.suffix);
        }
      });
      return;
    }

    // Stats counter animation using native JS (no GSAP)
    let observer: IntersectionObserver | null = null;
    let hasTriggered = false;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggered) {
            hasTriggered = true;
            statsItems.forEach((stat, index) => {
              const counterElement = countersRef.current[index];
              if (!counterElement || stat.value === undefined) {
                return;
              }
              
              // Enhanced counter animation with ease-out-quint + stagger
              const duration = 2500; // 2.5 seconds for smoother animation
              const startTime = Date.now() + (index * 200); // 0.2s delay per card
              const targetValue = stat.value ?? 0;
              
              // Ease-out-quint easing function
              const easeOutQuint = (t: number): number => {
                return 1 - Math.pow(1 - t, 5);
              };
              
              const animate = () => {
                const now = Date.now();
                const elapsed = Math.max(0, now - startTime);
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutQuint(progress);
                const currentValue = Math.round(easedProgress * targetValue);
                
                counterElement.textContent = formatStatValue(currentValue, stat.suffix);
                
                if (progress < 1) {
                  requestAnimationFrame(animate);
                } else {
                  // Counter finished - trigger confetti for last card
                  counterElement.textContent = formatStatValue(targetValue, stat.suffix);
                  const cardElement = counterElement.closest('.group\\/stat');
                  if (cardElement) {
                    cardElement.classList.add('counter-finished');
                    // Trigger confetti animation for assignment card (last one)
                    if (index === statsItems.length - 1) {
                      const iconElement = cardElement.querySelector('.stat-icon');
                      if (iconElement) {
                        iconElement.classList.add('icon-confetti-pop');
                        setTimeout(() => {
                          iconElement?.classList.remove('icon-confetti-pop');
                        }, 600);
                      }
                    }
                  }
                }
              };
              
              requestAnimationFrame(animate);
            });
            observer?.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );

    if (statsRef.current) {
      observer.observe(statsRef.current as Element);
    }

    return () => {
      observer?.disconnect();
    };
  }, [prefersReducedMotion, statsItems]);

  useEffect(() => {
    const button = ctaButtonRef.current;
    if (!button) {
      return;
    }

    if (prefersReducedMotion) {
      button.style.boxShadow = "0 0 0 rgba(127, 127, 255, 0)";
      return;
    }

  // CTA glow animation removed for performance - can use CSS animation if needed
  }, [prefersReducedMotion]);

  // Lottie animation removed - using static illustration instead
  useEffect(() => {
    setIsLottieLoaded(true); // Mark as loaded immediately for static content
  }, []);

  // ScrollReveal replaced with native Intersection Observer
  // Using useScrollReveal hook for scroll-triggered animations
  useEffect(() => {
    // Scroll animations now handled by CSS + Intersection Observer
    // See: useScrollReveal hook and .scroll-reveal CSS classes in globals.css
  }, []);

  const heroGradientOverlay = useMemo(
    () =>
      resolvedTheme === "dark"
        ? "absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_18%,_rgba(34,211,238,0.18),transparent_58%)]"
        : "absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_18%,_rgba(99,102,241,0.12),transparent_68%)]",
    [resolvedTheme],
  );

  const heroBackdropOverlay = useMemo(
    () =>
      resolvedTheme === "dark"
        ? "absolute inset-0 pointer-events-none bg-gradient-to-br from-[#0a0a1a]/85 via-[#080816]/65 to-[#0c0e20]/90"
        : "absolute inset-0 pointer-events-none bg-gradient-to-br from-[#F9FAFB]/92 via-[#EEF2FF]/70 to-[#E0F2FE]/90",
    [resolvedTheme],
  );

  const featuredActivities = useMemo(() => {
    const filtered = activeActivityFilter === "Semua" 
      ? activities 
      : activities.filter(a => a.category === activeActivityFilter);
    return filtered.slice(0, 6);
  }, [activities, activeActivityFilter]);
  
  const activityCategories = ["Semua", "Workshop", "Bootcamp", "Community", "Competition"];
  
  const categoryIcons: Record<string, string> = {
    Semua: "🌟",
    Workshop: "💻",
    Bootcamp: "⚡",
    Community: "🤝",
    Competition: "🏆"
  };
  const latestAnnouncements = useMemo(() => announcements.slice(0, 3), [announcements]);
  const highlightedGallery = useMemo(() => gallery.slice(0, 6), [gallery]);
  
  const [activeGalleryFilter, setActiveGalleryFilter] = useState<string>("Semua");
  const galleryCategories = ["Semua", "Workshop", "Prestasi", "Sosial", "Keagamaan", "Umum"];
  
  const [gallerySortBy, setGallerySortBy] = useState<string>("terbaru");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  const filteredGallery = useMemo(() => {
    let filtered = gallery;
    
    // Apply category filter
    if (activeGalleryFilter !== "Semua") {
      filtered = filtered.filter(item => 
        item.category?.toLowerCase() === activeGalleryFilter.toLowerCase()
      );
    }
    
    // Apply sorting
    if (gallerySortBy === "terbaru") {
      filtered = [...filtered].reverse(); // Assume array is already sorted by ID
    } else if (gallerySortBy === "populer") {
      // For now, keep original order (can add views field later)
      filtered = [...filtered];
    }
    
    return filtered;
  }, [gallery, activeGalleryFilter, gallerySortBy]);
  
  const heroGallery = filteredGallery[0];
  const gridGallery = filteredGallery.slice(1, 7); // 6 items for grid
  
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };
  
  const nextPhoto = () => {
    setLightboxIndex((prev) => (prev + 1) % filteredGallery.length);
  };
  
  const prevPhoto = () => {
    setLightboxIndex((prev) => (prev - 1 + filteredGallery.length) % filteredGallery.length);
  };
  
  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, lightboxIndex, filteredGallery.length]);

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      if (diffMins < 1) return { text: "🟢 Baru saja", color: "text-emerald-500", fresh: true };
      return { text: `🟢 ${diffMins} menit lalu`, color: "text-emerald-500", fresh: true };
    } else if (diffHours < 24) {
      return { text: `🟢 ${diffHours} jam lalu`, color: "text-emerald-500", fresh: true };
    } else if (diffDays < 7) {
      return { text: `📅 ${diffDays} hari lalu`, color: "text-slate-500", fresh: false };
    } else {
      return { text: `📅 ${formatDate(dateString)}`, color: "text-slate-500", fresh: false };
    }
  };

  const featuredAnnouncement = latestAnnouncements[0];
  const secondaryAnnouncements = latestAnnouncements.slice(1);
  
  const [activeAnnouncementFilter, setActiveAnnouncementFilter] = useState<string>("Semua");
  const announcementCategories = ["Semua", "Info", "Penting", "Kegiatan", "Prestasi"];
  
  const filteredLatestAnnouncements = useMemo(() => {
    if (activeAnnouncementFilter === "Semua") return latestAnnouncements;
    
    const filterMap: Record<string, string[]> = {
      "Info": ["info"],
      "Penting": ["warning", "highlight"],
      "Kegiatan": ["event"],
      "Prestasi": ["achievement", "success"],
    };
    
    const types = filterMap[activeAnnouncementFilter] || [];
    return latestAnnouncements.filter(a => types.includes(a.type));
  }, [latestAnnouncements, activeAnnouncementFilter]);
  
  const filteredFeaturedAnnouncement = filteredLatestAnnouncements[0];
  const filteredSecondaryAnnouncements = filteredLatestAnnouncements.slice(1);
  
  const getUrgencyBadge = (type: string) => {
    if (type === "warning") return { text: "‼️ Penting", show: true };
    if (type === "highlight") return { text: "⚡ Segera Dibaca", show: true };
    return { text: "", show: false };
  };

  if (loading) {
    return (
      <>
        <SkipLink href="#main-content">Lewati ke konten utama</SkipLink>
        <div className="min-h-screen bg-gradient-to-b from-[#f6f7ff] via-white to-[#e9f6ff] text-slate-900 transition-colors duration-500 dark:from-[#040321] dark:via-[#050513] dark:to-[#0a0c1d] dark:text-white">
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <SkeletonGrid />
        </div>
      </>
    );
  }

  return (
    <>
      <SkipLink href="#main-content">Lewati ke konten utama</SkipLink>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-1 bg-slate-900/10 transition-colors duration-500 dark:bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-[#6C63FF] via-[#5EEAD4] to-[#96f7d6] transition-all duration-300"
          style={{ width: `${Math.min(scrollProgress * 100, 100).toFixed(2)}%` }}
        />
      </div>
      <main
        id="main-content"
        className="bg-gradient-to-b from-[#f6f7ff] via-white to-[#e9f6ff] text-slate-900 transition-colors duration-500 dark:from-[#040321] dark:via-[#050513] dark:to-[#0a0c1d] dark:text-white"
      >
        <section
          id="hero"
          ref={heroRef}
          className="relative overflow-hidden will-change-transform"
          aria-labelledby="hero-heading"
          data-parallax-root
          style={{ transform: 'translateZ(0)' }}
        >
          <div className="absolute inset-0">
            {shouldRenderVanta ? (
              <InteractiveBackgroundBoundary>
                <VantaBackground className="absolute inset-0" theme={resolvedTheme} />
              </InteractiveBackgroundBoundary>
            ) : (
              <div className={`absolute inset-0 ${gradientBackground}`} aria-hidden="true" />
            )}
            <div className={heroGradientOverlay} aria-hidden="true" />
            <div className={heroBackdropOverlay} aria-hidden="true" />
            <div className="absolute inset-0 pointer-events-none">
              {/* Joyful Floating Blobs */}
              <div
                data-parallax="0.25"
                className="absolute -top-24 right-16 h-64 w-64 bg-gradient-to-br from-[#6366F1]/40 to-transparent blur-3xl floating-blob blob-shape-1"
              />
              <div
                data-parallax="0.2"
                className="absolute bottom-0 left-16 h-72 w-72 bg-gradient-to-br from-[#22D3EE]/35 to-transparent blur-3xl floating-blob blob-shape-2"
                style={{ animationDelay: '2s' }}
              />
              <div
                data-parallax="0.35"
                className="absolute -bottom-20 right-24 h-44 w-44 border-2 border-[#22D3EE]/40 blob-morph"
              />
              <div
                data-parallax="0.3"
                className="absolute top-32 left-32 h-56 w-56 bg-gradient-to-br from-[#FBBF24]/25 to-transparent blur-3xl floating-blob blob-shape-3"
                style={{ animationDelay: '4s' }}
              />
              <div
                data-parallax="0.28"
                className="absolute top-1/2 right-1/4 h-40 w-40 bg-gradient-to-br from-[#10B981]/20 to-transparent blur-2xl floating-blob blob-shape-4"
                style={{ animationDelay: '6s' }}
              />
            </div>
          </div>

          <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-16 px-6 pb-32 pt-32 section-spacing-lg sm:px-10 md:flex-row md:items-center md:gap-20 md:pb-40 md:pt-40 lg:gap-24">
            {/* Left Column - Content (Asymmetric 55%) */}
            <div className="flex-1 md:w-[55%]" data-parallax="0.1">
              {/* Animated Logo with fallbacks */}
              <div
                className="mb-8 animate-scale-in"
                style={{ animationDelay: "0.1s" }}
              >
                <LogoAnimated 
                  size="md" 
                  priority 
                  className="hover-lift icon-wiggle cursor-pointer" 
                />
              </div>
              <p className="type-caption text-[#0891B2] dark:text-[#22D3EE] inline-flex items-center gap-3" data-parallax="0.15" role="doc-subtitle">
                Learning Management System
                <span className="h-px w-10 bg-[#0891B2]/60 dark:bg-[#22D3EE]/40" aria-hidden="true" />
              </p>
              <h1
                id="hero-heading"
                ref={heroTitleRef}
                className="type-h1 hero-title mt-6 text-slate-900 transition-colors duration-500 dark:text-white"
                data-parallax="0.12"
                role="heading"
                aria-level={1}
              >
                Belajar{" "}
                <span className="text-highlight font-extrabold" role="emphasis">Coding</span> Jadi{" "}
                <span className="text-gradient-primary font-extrabold" role="emphasis">
                  Seru <span role="img" aria-label="roket">🚀</span>
                </span>{" "}
                dan{" "}
                <span className="text-gradient-primary font-extrabold" role="emphasis">
                  Gampang Banget!
                </span>
              </h1>
              <p
                ref={heroSubtitleRef}
                className="type-body hero-subtitle mt-8 max-w-xl text-slate-700 transition-colors duration-500 dark:text-slate-200"
                data-parallax="0.18"
                role="doc-subtitle"
              >
                <strong className="font-semibold text-slate-900 dark:text-white">
                  <abbr title="Generasi Muda Informatika" className="no-underline">GEMA</abbr> (Generasi Muda Informatika)
                </strong> adalah 
                platform belajar coding khusus buat kamu yang lagi belajar Informatika di SMA! 
                Ada <span className="font-medium text-slate-900 dark:text-slate-100">
                  lab coding interaktif <span role="img" aria-label="kilat">⚡</span>
                </span> yang langsung bisa dicoba, 
                tutorial gampang dipahami, dan nilai langsung keluar otomatis.
              </p>

              <div
                ref={heroButtonsRef}
                className="hero-cta mt-10 flex flex-col gap-5 sm:flex-row sm:items-center"
                data-parallax="0.2"
              >
                {/* Primary CTA - Emotional & Clear Result */}
                <Link
                  href="/student/register"
                  ref={ctaButtonRef}
                  className="group cta-button button-ripple inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] via-[#4F46E5] to-[#22D3EE] px-10 py-5 font-outfit text-lg font-bold text-white shadow-brand-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-brand-xl focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#22D3EE] glow-brand pulse-glow"
                  aria-label="Mulai petualangan coding bersama GEMA - Daftar sebagai siswa baru"
                  role="button"
                  tabIndex={0}
                >
                  <Sparkles className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-180" aria-hidden="true" />
                  <span className="sr-only">Daftar sekarang: </span>
                  Mulai Petualangan Codingmu!
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110" aria-hidden="true" />
                </Link>
                
                {/* Secondary CTA - Exploratory */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4" role="group" aria-label="Opsi eksplorasi">
                  <Link
                    href="/tutorial"
                    className="group inline-flex items-center gap-3 rounded-full border-2 border-[#4338CA]/30 bg-white/90 px-6 py-3 font-inter text-base font-semibold text-[#4338CA] backdrop-blur-sm transition-all duration-300 hover:border-[#4F46E5] hover:bg-[#4F46E5]/10 hover:shadow-brand-md dark:border-[#0891B2]/30 dark:bg-slate-700/90 dark:text-[#0891B2] dark:hover:border-[#22D3EE] dark:hover:bg-[#22D3EE]/10 focus-visible:outline focus-visible:outline-4 focus-visible:outline-[#4F46E5]"
                    aria-label="Lihat tutorial pembelajaran coding lengkap"
                    role="button"
                  >
                    <BookOpenCheck className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                    Lihat Tutorial
                  </Link>
                  <Link
                    href="/gallery"
                    className="group inline-flex items-center gap-2 font-inter text-sm font-medium text-slate-700 transition-all duration-300 hover:text-[#EC4899] dark:text-slate-300 dark:hover:text-[#F472B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#EC4899]"
                    aria-label="Lihat galeri kegiatan GEMA"
                  >
                    <Camera className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                    Lihat Galeri
                    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              </div>
              
              {/* Value Proposition - Clear Benefits */}
              <div 
                className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border-2 border-[#6366F1]/20 bg-gradient-to-r from-[#6366F1]/8 to-[#22D3EE]/8 p-4 backdrop-blur-sm dark:border-[#22D3EE]/20 dark:from-[#6366F1]/10 dark:to-[#22D3EE]/10" 
                data-parallax="0.22"
                role="list"
                aria-label="Benefit utama GEMA"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100" role="listitem">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#10B981]/30 dark:bg-[#10B981]/40" aria-hidden="true">
                    <span className="text-lg font-bold text-[#059669]" role="img" aria-label="centang">✓</span>
                  </div>
                  <span>Gratis untuk siswa</span>
                </div>
                <span className="text-slate-500 dark:text-slate-400" aria-hidden="true">•</span>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100" role="listitem">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FBBF24]/30 dark:bg-[#FBBF24]/40" aria-hidden="true">
                    <span className="text-lg" role="img" aria-label="kilat">⚡</span>
                  </div>
                  <span>Hasil langsung terlihat</span>
                </div>
                <span className="text-slate-500 dark:text-slate-400" aria-hidden="true">•</span>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100" role="listitem">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6366F1]/30 dark:bg-[#6366F1]/40" aria-hidden="true">
                    <span className="text-lg" role="img" aria-label="topi wisuda">🎓</span>
                  </div>
                  <span>Sertifikat resmi</span>
                </div>
              </div>

              {/* Social Proof & Dynamic Text */}
              <div className="mt-10 flex flex-wrap items-center gap-5" data-parallax="0.24">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-[#6366F1] to-[#22D3EE] dark:border-slate-900"
                        style={{ zIndex: 10 - i }}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-[#4F46E5] dark:text-[#22D3EE]">{stats.totalStudents}+</span> siswa aktif
                  </p>
                </div>
                <span className="text-slate-400">•</span>
                <span ref={typedRef} className="font-outfit text-base font-bold text-[#4F46E5] dark:text-[#22D3EE]" aria-live="polite" />
              </div>

              {/* Feature Indicators with Progressive Disclosure */}
              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400" data-scroll-reveal data-parallax="0.26">
                <span className="inline-flex items-center gap-2 font-inter font-medium transition-all duration-300 hover:text-[#4F46E5] hover:scale-110 cursor-pointer">
                  <Code2 className="h-4 w-4 text-[#4F46E5] icon-bounce" /> 
                  <span className="font-semibold text-[#4F46E5] dark:text-[#818CF8]">{stats.totalCodingLabs}</span> Coding Lab
                </span>
                <span className="text-slate-400 animate-pulse">•</span>
                <span className="inline-flex items-center gap-2 font-inter font-medium transition-all duration-300 hover:text-[#22D3EE] hover:scale-110 cursor-pointer">
                  <BookOpenCheck className="h-4 w-4 text-[#22D3EE] icon-bounce" /> 
                  <span className="font-semibold text-[#22D3EE] dark:text-[#5EEAD4]">{stats.totalTutorials}</span> Tutorial
                </span>
                <span className="text-slate-400 animate-pulse">•</span>
                <span className="inline-flex items-center gap-2 font-inter font-medium transition-all duration-300 hover:text-[#FBBF24] hover:scale-110 cursor-pointer">
                  <BarChart3 className="h-4 w-4 text-[#FBBF24] icon-bounce" /> Auto Grading
                </span>
              </div>
            </div>

            {/* Right Column - Lottie Animation (Asymmetric 45%) */}
            <div className="relative flex-1 md:w-[45%] pointer-events-none" data-parallax="0.25">
              <div 
                ref={lottieContainerRef}
                className="relative flex items-center justify-center pointer-events-none"
              >
                {/* Decorative joyful blobs */}
                <div className="absolute -left-16 top-20 h-64 w-64 bg-[#6366F1]/25 blur-3xl blob-shape-1 animate-breathe pointer-events-none" data-parallax="0.3" />
                <div className="absolute -right-12 bottom-16 h-52 w-52 bg-[#22D3EE]/25 blur-3xl blob-shape-2 animate-breathe pointer-events-none" data-parallax="0.28" style={{ animationDelay: '1s' }} />
                <div className="absolute top-40 right-20 h-40 w-40 bg-[#FBBF24]/20 blur-2xl blob-shape-3 animate-breathe pointer-events-none" data-parallax="0.32" style={{ animationDelay: '2s' }} />
                
                {/* Lottie Animation Container - Scaled 2x desktop, 1.2x mobile */}
                <div className="hero-lottie relative z-10 scale-[1.2] md:scale-[2] pointer-events-none" style={{ transformOrigin: 'center' }}>
                  <dotlottie-wc 
                    src="https://lottie.host/3d2f4808-10b3-440a-bed8-687a32569b66/kxkNTFuOxU.lottie"
                    style={{ width: '500px', height: '500px', pointerEvents: 'none' } as CSSProperties}
                    autoplay 
                    loop
                  />
                </div>

                {/* Floating badges - Hidden on mobile to avoid collision */}
                <div 
                  className="floating-card absolute left-4 top-24 animate-float p-4 shadow-brand-lg hover-lift cursor-pointer group hidden md:block pointer-events-auto" 
                  style={{ animationDelay: '0s' }}
                  title="Coding Lab Interactive"
                >
                  <Code2 className="h-8 w-8 text-[#4F46E5] transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                </div>
                <div 
                  className="floating-card absolute -right-4 top-40 animate-float p-4 shadow-cyan-md hover-lift cursor-pointer group hidden md:block pointer-events-auto" 
                  style={{ animationDelay: '1s' }}
                  title="Sparkles & Magic"
                >
                  <Sparkles className="h-8 w-8 text-[#22D3EE] transition-transform duration-300 group-hover:scale-125 group-hover:rotate-180" />
                </div>
                <div 
                  className="floating-card absolute bottom-32 left-12 animate-float p-4 shadow-warm-md hover-lift cursor-pointer group hidden md:block pointer-events-auto" 
                  style={{ animationDelay: '2s' }}
                  title="Achievement Unlocked"
                >
                  <GraduationCap className="h-8 w-8 text-[#FBBF24] transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-12" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards Below Hero - Progressive Disclosure */}
          <div className="relative z-10 mx-auto max-w-7xl section-spacing px-6 sm:px-10">
            <div className="mb-8 text-center" data-scroll-reveal>
              <p className="type-caption text-[#22D3EE]">Kenapa Memilih GEMA?</p>
              <h2 className="type-h2 mt-2 text-slate-900 dark:text-white">
                Platform All-in-One untuk Pembelajaran Coding
              </h2>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              <Link href="/tutorial">
                <div 
                  className="floating-card group p-6 shadow-brand-md hover:shadow-brand-lg card-pop cursor-pointer" 
                  data-scroll-reveal
                  style={{ animationDelay: '0.1s' }}
                >
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366F1]/20 to-[#22D3EE]/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <BookOpenCheck className="h-6 w-6 text-[#4F46E5] transition-transform duration-300 group-hover:scale-125" />
                  </div>
                  <h3 className="font-outfit text-lg font-bold text-slate-900 transition-colors duration-500 dark:text-white">
                    Fitur Lengkap & Terpadu
                  </h3>
                  <p className="type-body mt-2 text-slate-600 dark:text-slate-300">
                    Coding lab, tutorial articles, quiz system, dan assignment management dalam satu platform.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#4F46E5] dark:text-[#22D3EE]">
                    <span>Lihat Tutorial</span>
                    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
              <Link href="/student/register">
                <div 
                  className="floating-card group p-6 shadow-cyan-md hover:shadow-brand-lg card-pop cursor-pointer" 
                  data-scroll-reveal
                  style={{ animationDelay: '0.2s' }}
                >
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#22D3EE]/20 to-[#10B981]/20 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3">
                    <Users className="h-6 w-6 text-[#22D3EE] transition-transform duration-300 group-hover:scale-125" />
                  </div>
                  <h3 className="font-outfit text-lg font-bold text-slate-900 transition-colors duration-500 dark:text-white">
                    Portal Guru & Siswa
                  </h3>
                  <p className="type-body mt-2 text-slate-600 dark:text-slate-300">
                    Dashboard terpisah untuk guru dan siswa dengan role management yang fleksibel.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#22D3EE]">
                    <span>Daftar Sekarang</span>
                    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Trust Signals & Quick Stats - Progressive Disclosure */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3" data-scroll-reveal>
                {heroSpotlightCards.map((card, index) => (
                  <div
                    key={card.title}
                    className="group rounded-2xl border border-white/10 bg-white/90 p-4 text-left shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-white/5 animate-slide-up cursor-pointer"
                    style={{
                      borderColor: `${card.accent}33`,
                      boxShadow: `0 12px 28px ${card.accent}26`,
                      animationDelay: prefersReducedMotion ? "0s" : `${0.3 + index * 0.1}s`,
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <p className="font-inter text-sm font-semibold text-slate-900 transition-colors duration-500 dark:text-white">{card.title}</p>
                      <Sparkles className="h-4 w-4 text-[#FBBF24] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                    <p className="type-caption mt-2 !normal-case !tracking-normal opacity-80 text-slate-600 transition-colors duration-500 dark:text-slate-200/75">{card.caption}</p>
                  </div>
                ))}
              </div>
              
              {/* Urgency Indicator - Limited Time */}
              <div 
                className="mt-8 flex items-center justify-center gap-3 rounded-full border border-[#FBBF24]/30 bg-gradient-to-r from-[#FBBF24]/10 to-[#F43F5E]/10 px-6 py-3 backdrop-blur-sm animate-pulse" 
                data-scroll-reveal
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F43F5E] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F43F5E]"></span>
                </span>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <span className="text-[#F43F5E]">🔥 Promo Akhir Tahun:</span> Daftar sekarang dapat akses penuh gratis!
                </p>
              </div>
            </div>

            {/* Additional Hero Content - Video Animation Centered */}
            <div className="relative flex-1">
              <div className="max-w-3xl mx-auto">
                {/* Video Animation */}
                <div className="relative rounded-3xl border border-white/20 bg-white/95 p-6 backdrop-blur-lg transition-colors duration-500 dark:border-white/10 dark:bg-white/5">
                  <div className="absolute inset-0 rounded-3xl border border-white/10" aria-hidden="true" />
                  <div className="mb-4 flex items-center justify-between text-sm font-semibold uppercase tracking-[0.35em] text-[#5EEAD4]/80">
                    <span>Harmoni Digital</span>
                    <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-200/70">
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                      Live
                    </span>
                  </div>
                  <VideoLogo
                    src="/videos/gema-animation.mp4"
                    width={560}
                    height={320}
                    className="overflow-hidden rounded-2xl"
                    fallbackImage="/gema.svg"
                  />
                  <p className="mt-4 text-sm text-slate-600 dark:text-slate-200/75">
                    Visualisasi modul pembelajaran dan kolaborasi coding yang digunakan dalam sesi kelas
                    interaktif GEMA.
                  </p>
                </div>
              </div>

              {/* Tentang GEMA - Optimized for 3-col grid */}
              <div className="max-w-4xl mx-auto mt-6">
                <div className="rounded-2xl border border-white/20 bg-white/90 p-6 sm:p-8 backdrop-blur transition-colors duration-500 dark:border-white/10 dark:bg-white/5">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Tentang GEMA
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-200/80">
                    GEMA (Generasi Muda Informatika) adalah tempat belajar coding online yang bikin kamu makin jago ngoding! 
                    Cocok banget buat siswa SMA yang mau belajar Informatika dengan cara yang asik dan nggak bikin ngantuk.
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#6C63FF]/10 text-[#6C63FF]">
                        <Code2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Lab Coding Interaktif</p>
                        <p className="text-xs text-slate-600 dark:text-slate-200/70">
                          Nulis code langsung dapat nilai
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#5EEAD4]/10 text-[#5EEAD4]">
                        <BookOpenCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Tutorial Step by Step</p>
                        <p className="text-xs text-slate-600 dark:text-slate-200/70">
                          Materi rapi dari dasar sampai mahir
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#FF99CC]/10 text-[#FF99CC]">
                        <BarChart3 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Pantau Progres Belajar</p>
                        <p className="text-xs text-slate-600 dark:text-slate-200/70">
                          Liat perkembangan belajarmu kapan aja
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </section>

        <section
          id="features"
          className="relative overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-[#EEF2FF] py-24 transition-colors duration-500 sm:py-32 dark:from-[#06081C] dark:to-[#0F0A1F]"
          aria-labelledby="features-heading"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(99,102,241,0.06),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,_rgba(99,102,241,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(236,72,153,0.06),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,_rgba(236,72,153,0.1),transparent_50%)]" />
          </div>
          
          {/* Top Border Glow */}
          <div
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6366F1]/30 to-transparent dark:via-[#6366F1]/50"
            aria-hidden="true"
          />
          
          <div className="relative mx-auto max-w-7xl px-6 sm:px-10">
            {/* Section Header */}
            <div className="mx-auto max-w-3xl text-center" data-scroll-reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#6366F1]/20 bg-white/60 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#6366F1] backdrop-blur-sm dark:border-[#6366F1]/30 dark:bg-white/5 dark:text-[#A5B4FC]">
                ✨ Learning Journey
              </span>
              <h2
                id="features-heading"
                className="mt-6 font-['Clash_Display',_'Satoshi',_system-ui] text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white"
              >
                Setiap siswa punya{" "}
                <span className="bg-gradient-to-r from-[#6366F1] via-[#06B6D4] to-[#EC4899] bg-clip-text text-transparent animate-shimmer">
                  perjalanan belajar
                </span>{" "}
                sendiri
              </h2>
              <p className="mx-auto mt-6 max-w-2xl font-['Inter'] text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                GEMA bantuin kamu belajar dari <span className="font-semibold text-[#6366F1] dark:text-[#A5B4FC]">nol banget</span> sampai{" "}
                <span className="font-semibold text-[#EC4899] dark:text-[#F9A8D4]">jago coding</span> lewat 3 tahap yang seru dan gampang diikuti.
              </p>
              
              {/* Animated Progress Ribbon */}
              <div className="mx-auto mt-8 h-1 w-32 overflow-hidden rounded-full bg-gradient-to-r from-[#6366F1]/20 via-[#06B6D4]/20 to-[#EC4899]/20">
                <div 
                  className="h-full w-1/3 rounded-full bg-gradient-to-r from-[#6366F1] via-[#06B6D4] to-[#EC4899]"
                  style={{
                    animation: 'slideRight 3s ease-in-out infinite',
                    filter: 'blur(1px)',
                  }}
                />
              </div>
            </div>

            {/* Learning Journey Timeline */}
            <div
              ref={featuresRef}
              className="mt-16 relative"
              aria-live="polite"
              aria-busy="false"
            >
              {/* Timeline Progress Line (Desktop) */}
              <div className="absolute top-[4.5rem] left-0 right-0 hidden h-1 md:block" aria-hidden="true">
                <div className="mx-auto max-w-5xl px-12">
                  <div className="h-full bg-gradient-to-r from-[#6366F1]/20 via-[#06B6D4]/20 to-[#EC4899]/20 dark:from-[#6366F1]/30 dark:via-[#06B6D4]/30 dark:to-[#EC4899]/30" />
                  {/* Animated Progress Indicator */}
                  <div className="absolute inset-0 h-full w-0 animate-[progressFlow_3s_ease-in-out_infinite] bg-gradient-to-r from-[#6366F1] via-[#06B6D4] to-[#EC4899] opacity-50 blur-sm" 
                    style={{ animation: 'progressFlow 4s ease-in-out infinite' }} />
                </div>
              </div>

              {/* Journey Steps Grid */}
              <div className="grid gap-8 md:grid-cols-3 md:gap-6"
              >
              {featuresData.map((feature, index) => {
                const Icon = feature.icon;
                const isFirst = index === 0;
                const isLast = index === featuresData.length - 1;
                
                const cardStyle = {
                  boxShadow: feature.accent.shadow,
                  borderColor: `${feature.accent.primary}40`,
                  "--card-accent-primary": feature.accent.primary,
                  "--card-accent-secondary": feature.accent.secondary,
                  "--card-accent-tertiary": feature.accent.spotlight,
                  "--card-shadow-hover": feature.accent.hoverShadow,
                  "--spotlight-x": "50%",
                  "--spotlight-y": "50%",
                  animationDelay: `${index * 0.2}s`,
                } as CSSProperties;

                return (
                  <article
                    key={feature.title}
                    data-feature-card
                    data-scroll-reveal
                    className="group feature-card relative flex h-full flex-col overflow-hidden rounded-3xl border-2 bg-white/95 p-8 shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-[6px] hover:scale-[1.02] will-change-transform focus-within:ring-4 focus-within:ring-offset-2 dark:bg-slate-900/90 sm:p-10"
                    style={{
                      ...cardStyle,
                      '--hover-shadow': '0 8px 30px rgba(99, 102, 241, 0.15)',
                    } as CSSProperties}
                    onPointerMove={handleFeaturePointerMove}
                    onPointerLeave={handleFeaturePointerLeave}
                    onPointerUp={handleFeaturePointerLeave}
                    role="article"
                    tabIndex={0}
                  >
                    {/* Glow Effect on Hover */}
                    <div 
                      className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at var(--spotlight-x) var(--spotlight-y), ${feature.accent.spotlight}, transparent 60%)`,
                      }}
                      aria-hidden="true"
                    />

                    {/* Timeline Connector Dot + Badge */}
                    <div className="relative mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Glowing Timeline Dot */}
                        <div 
                          className="relative h-3 w-3 rounded-full transition-all duration-500 group-hover:scale-125"
                          style={{
                            background: `linear-gradient(135deg, ${feature.accent.primary}, ${feature.accent.secondary})`,
                            boxShadow: `0 0 15px ${feature.accent.spotlight}`,
                          }}
                        >
                          <div 
                            className="absolute inset-0 rounded-full animate-ping opacity-75"
                            style={{
                              background: feature.accent.primary,
                            }}
                          />
                        </div>
                        
                        {/* Step Badge */}
                        <span 
                          className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-300 group-hover:scale-105"
                          style={{
                            background: `linear-gradient(135deg, ${feature.accent.primary}, ${feature.accent.secondary})`,
                          }}
                        >
                          {feature.accent.emoji}
                          <span className="hidden sm:inline">{feature.accent.label}</span>
                        </span>
                      </div>
                      
                      {/* Enhanced Connection Line with Glow (Desktop Only) */}
                      {!isLast && (
                        <div className="absolute -right-4 top-1/2 hidden h-1 w-8 md:block" aria-hidden="true">
                          <div 
                            className="relative h-full overflow-hidden rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${feature.accent.secondary}, ${featuresData[index + 1].accent.primary})`,
                              opacity: 0.4,
                            }}
                          >
                            {/* Animated glow effect */}
                            <div 
                              className="absolute inset-0 h-full w-1/2 animate-[slideRight_2s_ease-in-out_infinite]"
                              style={{
                                background: `linear-gradient(90deg, transparent, ${feature.accent.secondary})`,
                                filter: 'blur(2px)',
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Icon with Glow Effect */}
                    <div className="relative mb-5">
                      <div
                        className="inline-flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                        style={{
                          background: `linear-gradient(135deg, ${feature.accent.primary}, ${feature.accent.secondary})`,
                          filter: 'drop-shadow(0 0 0px transparent)',
                        }}
                      >
                        <Icon 
                          className="h-8 w-8 transition-all duration-500" 
                          style={{
                            filter: `drop-shadow(0 0 15px ${feature.accent.spotlight})`,
                          }}
                          aria-hidden="true" 
                        />
                      </div>
                      {/* Pulsing glow ring on hover */}
                      <div 
                        className="absolute inset-0 -z-10 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60"
                        style={{
                          background: `linear-gradient(135deg, ${feature.accent.primary}, ${feature.accent.secondary})`,
                        }}
                      />
                    </div>

                    {/* Title */}
                    <h3 className="font-['Poppins',_system-ui] text-2xl font-semibold text-slate-900 transition-colors duration-500 dark:text-white">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-4 font-['Inter'] text-base leading-relaxed text-slate-600 dark:text-slate-300">
                      {feature.description}
                    </p>

                    {/* Highlights Tags with Tooltips */}
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {feature.highlights.map((highlight, highlightIndex) => {
                        const tooltips = {
                          "Progress Real-time": "Lihat progres belajarmu update langsung setiap hari",
                          "Analitik Visual": "Grafik dan chart yang mudah dipahami",
                          "Badge Achievement": "Kumpulkan badge setiap selesai materi",
                          "Auto-grading": "Kode kamu dinilai otomatis dalam hitungan detik",
                          "Multi-language": "Python, JavaScript, HTML/CSS — pilih sesukamu",
                          "Instant Feedback": "Error? Langsung tau dimana dan gimana benerin",
                          "Kurikulum Lengkap": "Dari dasar sampai advanced, step by step",
                          "Video Tutorial": "Penjelasan visual yang bikin kamu cepat paham",
                          "Interactive Quiz": "Quiz yang seru buat ngecek pemahamanmu",
                        };
                        
                        return (
                          <li
                            key={highlight}
                            className="group/tag relative inline-flex items-center rounded-full border px-3 py-1.5 font-['Inter'] text-xs font-medium uppercase tracking-wide transition-all duration-300 hover:scale-105 cursor-help"
                            style={{
                              borderColor: `${feature.accent.primary}30`,
                              color: feature.accent.primary,
                              backgroundColor: `${feature.accent.primary}10`,
                              animationDelay: `${(index * 0.2) + (highlightIndex * 0.1)}s`,
                            }}
                            title={tooltips[highlight as keyof typeof tooltips]}
                          >
                            {highlight}
                            {/* Tooltip on hover */}
                            <span 
                              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tag:block w-max max-w-xs rounded-lg px-3 py-2 text-xs font-normal normal-case tracking-normal text-white shadow-xl z-50 pointer-events-none"
                              style={{
                                background: `linear-gradient(135deg, ${feature.accent.primary}, ${feature.accent.secondary})`,
                              }}
                            >
                              {tooltips[highlight as keyof typeof tooltips]}
                              {/* Tooltip arrow */}
                              <span 
                                className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
                                style={{
                                  borderTopColor: feature.accent.primary,
                                }}
                              />
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    {/* CTA Link with Enhanced Interaction */}
                    <div className="relative mt-auto pt-8">
                      <Link
                        href={isFirst ? "/student/dashboard" : isLast ? "/tutorial" : "/student/coding-lab"}
                        className="group/cta inline-flex items-center gap-2 font-['Inter'] text-sm font-semibold transition-all duration-300 hover:gap-3 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg px-4 py-2 -ml-4"
                        style={{ 
                          color: feature.accent.primary,
                          '--ring-color': feature.accent.primary,
                        } as CSSProperties}
                        aria-label={`${isFirst ? "Lihat Progresku" : isLast ? "Jelajahi Materi" : "Mulai Tantangan"}`}
                      >
                        {isFirst ? "Lihat Progresku" : isLast ? "Jelajahi Materi" : "Mulai Tantangan"}
                        <ArrowRight 
                          className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" 
                          aria-hidden="true" 
                        />
                        {/* Underline animation */}
                        <span 
                          className="absolute bottom-1.5 left-4 right-4 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover/cta:scale-x-100"
                          style={{ backgroundColor: feature.accent.primary }}
                        />
                      </Link>
                      
                      {/* Confetti celebration for last card on hover */}
                      {isLast && (
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none">
                          <dotlottie-wc 
                            src="https://lottie.host/aaf47914-4948-429a-a847-7c4a6fc42756/BaVwXUiAmV.lottie"
                            style={{ width: '150px', height: '150px' } as CSSProperties}
                            autoplay
                            loop
                          />
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
              </div>
            </div>
          </div>
        </section>

        <section
          id="stats"
          ref={statsRef}
          className="relative overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-[#EEF2FF] py-24 transition-colors duration-500 sm:py-32 dark:from-[#050513] dark:to-[#0F0A1F]"
          aria-labelledby="stats-heading"
          data-parallax-root
        >
          {/* Living Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(99,102,241,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_30%_30%,_rgba(99,102,241,0.12),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_rgba(6,182,212,0.06),transparent_60%)] dark:bg-[radial-gradient(circle_at_70%_70%,_rgba(6,182,212,0.1),transparent_60%)]" />
          </div>
          
          {/* Animated Particles */}
          <div className="absolute inset-0 opacity-40">
            <div
              data-parallax="0.15"
              className="absolute right-20 top-16 h-32 w-32 rounded-full border-2 border-[#6366F1]/20 dark:border-[#6366F1]/30"
              style={{ animation: 'float 6s ease-in-out infinite' }}
            />
            <div
              data-parallax="0.25"
              className="absolute left-16 bottom-20 h-48 w-48 rounded-full bg-gradient-to-br from-[#06B6D4]/10 via-[#EC4899]/10 to-transparent blur-2xl"
              style={{ animation: 'float 8s ease-in-out infinite 1s' }}
            />
          </div>
          
          <div className="stats-grid relative mx-auto max-w-7xl px-6 sm:px-10">
            {/* Living Community Header */}
            <div className="mx-auto max-w-3xl text-center" data-scroll-reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#6366F1]/20 bg-white/60 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#6366F1] backdrop-blur-sm dark:border-[#6366F1]/30 dark:bg-white/5 dark:text-[#A5B4FC]">
                🌍 Living Community
              </span>
              <h2 
                id="stats-heading" 
                className="mt-6 font-['Clash_Display',_'Satoshi',_system-ui] text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white"
              >
                Setiap angka mewakili{" "}
                <span className="bg-gradient-to-r from-[#6366F1] via-[#06B6D4] to-[#EC4899] bg-clip-text text-transparent">
                  kisah pertumbuhan nyata
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-2xl font-['Inter'] text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                Setiap hari komunitas GEMA bertumbuh — makin banyak siswa yang{" "}
                <span className="font-semibold text-[#6366F1] dark:text-[#A5B4FC]">belajar</span>,{" "}
                <span className="font-semibold text-[#06B6D4] dark:text-[#22D3EE]">berbagi</span>, dan{" "}
                <span className="font-semibold text-[#EC4899] dark:text-[#F9A8D4]">berkreasi</span>.
              </p>
              
              {/* Animated Progress Indicator */}
              <div className="mx-auto mt-8 flex items-center justify-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#6366F1] animate-pulse" />
                <div className="h-2 w-2 rounded-full bg-[#06B6D4] animate-pulse" style={{ animationDelay: '0.3s' }} />
                <div className="h-2 w-2 rounded-full bg-[#EC4899] animate-pulse" style={{ animationDelay: '0.6s' }} />
              </div>
            </div>

            {/* Living Stats Grid */}
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:gap-8">
              {statsItems.map((stat, index) => {
                const Icon = stat.icon;
                const isFirst = index === 0;
                const isLast = index === statsItems.length - 1;
                
                // Icon animation classes based on card type
                const iconAnimationClass = index === 0 ? 'icon-pulse-glow' :
                                          index === 1 ? 'icon-flip-book' : '';
                
                return (
                  <article
                    key={stat.label}
                    data-scroll-reveal
                    className="stat-card group/stat relative flex flex-col overflow-hidden rounded-3xl border-2 bg-white/95 p-8 shadow-xl backdrop-blur-xl stat-card-animate transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] dark:bg-slate-900/90 sm:p-10"
                    style={{
                      borderColor: `${stat.color}40`,
                      boxShadow: `0 20px 50px ${stat.color}15`,
                      animationDelay: `${index * 0.15}s`,
                    } as CSSProperties}
                  >
                    {/* Glowing Background on Hover */}
                    <div 
                      className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/stat:opacity-100 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${stat.color}10, transparent 70%)`,
                      }}
                    />

                    {/* Emoji Badge */}
                    <div className="absolute -right-4 -top-4 text-6xl opacity-10 transition-all duration-500 group-hover/stat:opacity-20 group-hover/stat:scale-110">
                      {stat.emoji}
                    </div>

                    {/* Icon with Glow, Shimmer & Personality Animation */}
                    <div className="relative mb-6 flex items-center gap-4">
                      <div className="relative">
                        {/* Confetti Background for Card 4 - OUTSIDE icon container */}
                        {isLast && (
                          <div className="absolute inset-0 -z-10 scale-150 pointer-events-none">
                            <dotlottie-wc 
                              src="https://lottie.host/aaf47914-4948-429a-a847-7c4a6fc42756/BaVwXUiAmV.lottie"
                              style={{ width: '100%', height: '100%' } as CSSProperties}
                              autoplay
                              loop
                            />
                          </div>
                        )}
                        
                        <div
                          data-shimmer
                          className={`stat-icon relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 group-hover/stat:scale-110 group-hover/stat:rotate-3 ${iconAnimationClass}`}
                          style={{
                            background: `linear-gradient(135deg, ${stat.color}, ${stat.color}CC)`,
                          }}
                        >
                          <Icon className="relative z-10 h-8 w-8 text-white transition-transform duration-500 group-hover/stat:scale-110" aria-hidden="true" />
                          
                          {/* Pulsing ring */}
                          <div 
                            className="absolute inset-0 -z-10 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover/stat:opacity-60"
                            style={{
                              background: `linear-gradient(135deg, ${stat.color}, ${stat.color}80)`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Label with Growth Indicator */}
                      <div className="flex-1">
                        <p className="font-['Inter'] text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {stat.label}
                        </p>
                        {/* Growth Indicator on Hover */}
                        <p className="growth-indicator mt-1 font-['Inter'] text-xs font-medium text-slate-400 dark:text-slate-500">
                          📈 +{index === 0 ? '5' : index === 1 ? '3' : index === 2 ? '8' : '2'} minggu terakhir
                        </p>
                      </div>
                    </div>

                    {/* Giant Gradient Number with Gradient Shine */}
                    <div className="relative mb-4">
                      <p 
                        className={`stat-number-gradient font-['Clash_Display',_'Satoshi',_system-ui] text-6xl font-bold leading-none bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent sm:text-7xl`}
                      >
                        <span
                          ref={(element) => {
                            countersRef.current[index] = element;
                            if (prefersReducedMotion && element) {
                              element.textContent = formatStatValue(stat.value, stat.suffix);
                            }
                          }}
                        >
                          {prefersReducedMotion ? formatStatValue(stat.value, stat.suffix) : "0"}
                        </span>
                      </p>
                    </div>

                    {/* Description */}
                    <p className="font-['Inter'] text-base leading-relaxed text-slate-600 dark:text-slate-300">
                      {stat.description}
                    </p>

                    {/* Special Badge for First Card */}
                    {isFirst && stats.upcomingEventsToday > 0 && (
                      <div className="mt-6 flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-300 hover:scale-105"
                        style={{
                          borderColor: `${stat.color}30`,
                          backgroundColor: `${stat.color}08`,
                          color: stat.color,
                        }}
                      >
                        <Sparkles className="h-4 w-4" aria-hidden="true" />
                        <span>
                          {stats.upcomingEventsToday} kegiatan hari ini
                        </span>
                      </div>
                    )}


                  </article>
                );
              })}
            </div>

            {/* CTA Section with Animated Entry */}
            <div className="cta-animate relative mt-16 text-center">
              {/* Lottie Background Spark - More Visible */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-20 dark:opacity-15 pointer-events-none">
                <dotlottie-wc 
                  src="https://lottie.host/4df3916f-b2ba-40ef-ad01-4da7298ca301/v7payaGOaf.lottie"
                  style={{ width: '400px', height: '400px' } as CSSProperties}
                  autoplay
                  loop
                />
              </div>
              
              <p className="font-['Inter'] text-base font-medium text-slate-700 dark:text-slate-300">
                Gabung komunitas GEMA dan{" "}
                <span className="font-semibold text-[#6366F1] dark:text-[#A5B4FC]">tumbuh bareng</span>{" "}
                teman-teman codingmu! 🚀
              </p>
              <Link
                href="/student/register"
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366F1] to-[#06B6D4] px-8 py-4 font-['Inter'] text-base font-bold text-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[#6366F1]/50 focus:outline-none focus:ring-4 focus:ring-[#6366F1]/30"
              >
                <Sparkles className="h-5 w-5 transition-transform duration-300 group-hover:rotate-180" />
                Gabung Sekarang
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </div>
          </div>
        </section>

        <section
          id="activities"
          ref={activitiesRef}
          className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-sky-50/30 to-white py-20 transition-colors duration-500 sm:py-24 dark:from-[#06081C] dark:via-[#050513] dark:to-[#06081C]"
          aria-labelledby="activities-heading"
        >
          {/* Animated background blobs */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-pink-400/15 to-violet-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
          </div>
          
          {/* Floating particles effect */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-full opacity-40"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>
          
          <div className="relative mx-auto max-w-7xl px-6 sm:px-10">
            {/* Header Section */}
            <div className="text-center mb-12" data-scroll-reveal>
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-cyan-400/10 border border-indigo-500/20 backdrop-blur-sm">
                <span className="text-2xl animate-bounce" style={{ animationDuration: '2s' }}>🎯</span>
                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  Learning Playground
                </span>
              </div>
              <h2
                id="activities-heading"
                className="inline-block bg-gradient-to-r from-[#6C63FF] to-[#5EEAD4] bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl leading-tight"
              >
                Ayo Gabung di Kegiatan Seru!
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-200/80 leading-relaxed">
                Temukan kegiatan seru tiap pekan. Belajar bareng, bikin proyek, dan tunjukkan ide kamu 💡
              </p>
              
              {/* Motivational microcopy */}
              <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500 dark:text-slate-400 italic">
                &ldquo;Setiap proyek kecil di GEMA bisa jadi langkah besar buat karirmu 🚀&rdquo;
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-12" data-scroll-reveal>
              {activityCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveActivityFilter(category)}
                  className={`
                    group relative px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300
                    ${activeActivityFilter === category
                      ? 'text-white scale-105 shadow-lg'
                      : 'text-slate-600 dark:text-slate-300 hover:scale-105 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10'
                    }
                  `}
                  style={activeActivityFilter === category ? {
                    background: category === "Semua" 
                      ? 'linear-gradient(135deg, #6C63FF, #5EEAD4)'
                      : category === "Workshop"
                      ? 'linear-gradient(135deg, #6366f1, #06b6d4)'
                      : category === "Bootcamp"
                      ? 'linear-gradient(135deg, #fbbf24, #f97316)'
                      : category === "Community"
                      ? 'linear-gradient(135deg, #ec4899, #8b5cf6)'
                      : 'linear-gradient(135deg, #3b82f6, #a855f7)',
                  } : undefined}
                >
                  <span className="flex items-center gap-2">
                    <span className={activeActivityFilter === category ? 'animate-bounce' : ''} style={{ animationDuration: '1s' }}>
                      {categoryIcons[category]}
                    </span>
                    {category}
                  </span>
                  
                  {/* Underline animation */}
                  {activeActivityFilter === category && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/50 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {featuredActivities.length === 0 ? (
                <div className="col-span-3 text-center py-12" data-scroll-reveal>
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
                    Belum ada kegiatan saat ini
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-200/80">
                    Pantau terus update terbaru atau gabung di komunitas!
                  </p>
                </div>
              ) : (
                featuredActivities.map((activity, index) => {
                  const accent = activityAccents[index % activityAccents.length];
                  const activityStyle = {
                    borderColor: `${accent.primary}26`,
                    boxShadow: `0 20px 40px -12px ${accent.primary}40`,
                  } as CSSProperties;
                  
                  const participants = activity.participants || 0;
                  const capacity = activity.capacity || 100;
                  const percentage = (participants / capacity) * 100;
                  const isFull = participants >= capacity;
                  
                  let urgencyMessage = `👥 ${participants} siswa sudah bergabung!`;
                  let urgencyColor = "text-blue-500";
                  if (percentage >= 90) {
                    urgencyMessage = "🔥 Slot hampir penuh!";
                    urgencyColor = "text-red-500";
                  } else if (percentage >= 70) {
                    urgencyMessage = "⚡ Buruan daftar!";
                    urgencyColor = "text-orange-500";
                  }

                  return (
                    <article
                      key={activity.id}
                      data-scroll-reveal
                      className="group activities-card relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/90 shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 dark:border-white/10 dark:bg-white/5"
                      style={activityStyle}
                      onPointerMove={prefersReducedMotion ? undefined : handleFeaturePointerMove}
                      onPointerLeave={prefersReducedMotion ? undefined : handleFeaturePointerLeave}
                      onPointerUp={prefersReducedMotion ? undefined : handleFeaturePointerLeave}
                    >
                      {/* Gradient Banner with Icon */}
                      <div 
                        className="relative h-36 flex items-center justify-center overflow-hidden group-hover:h-40 transition-all duration-500"
                        style={{
                          background: `linear-gradient(135deg, ${accent.primary}dd, ${accent.secondary}dd)`,
                        }}
                      >
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500" />
                        
                        {/* Shine effect on hover */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        
                        <div className="relative z-10">
                          <Calendar className="w-16 h-16 text-white/90 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500" />
                        </div>
                        
                        {/* Floating particles */}
                        <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                          <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full animate-pulse" />
                          <div className="absolute bottom-6 right-8 w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
                          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                          <div className="absolute top-8 right-12 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.45s' }} />
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6 flex flex-col flex-1">
                        {/* Category Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="group/badge inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-md"
                            style={{
                              background: `linear-gradient(135deg, ${accent.primary}20, ${accent.secondary}10)`,
                              color: accent.primary,
                            }}
                          >
                            <span className="h-2 w-2 rounded-full group-hover/badge:animate-ping" style={{ background: accent.primary }} />
                            <span className="h-2 w-2 rounded-full -ml-2" style={{ background: accent.primary }} />
                            {activity.category}
                          </div>
                          {isFull && (
                            <span className="text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-full animate-pulse">
                              PENUH
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl sm:text-[22px] font-bold text-slate-900 dark:text-white leading-tight line-clamp-2 min-h-[3.5rem]">
                          {activity.title}
                        </h3>

                        {/* Description */}
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-200/80 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                          {activity.description}
                        </p>

                        {/* Meta Info */}
                        <dl className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-200/70">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" aria-hidden="true" style={{ color: accent.primary }} />
                            <dd>
                              {formatDate(activity.date)} · {activity.time}
                            </dd>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" aria-hidden="true" style={{ color: accent.primary }} />
                            <dd className="truncate">{activity.location}</dd>
                          </div>
                        </dl>

                        {/* Participants Progress */}
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5 text-slate-500" />
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {participants}/{capacity} peserta
                              </span>
                            </div>
                            <span className="text-[10px] font-semibold text-slate-500">
                              {Math.round(percentage)}%
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                            <div
                              className="h-full rounded-full transition-all duration-1000 ease-out"
                              style={{
                                width: `${Math.min(percentage, 100)}%`,
                                background: `linear-gradient(90deg, ${accent.primary}, ${accent.secondary})`,
                              }}
                              aria-label={`${Math.round(percentage)}% terisi`}
                            />
                          </div>
                        </div>

                        {/* Urgency Message */}
                        <div className={`mt-3 text-xs font-semibold ${urgencyColor} flex items-center gap-1`}>
                          <span>{urgencyMessage}</span>
                        </div>

                        {/* CTA Button */}
                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Link
                            href={`/activities/${activity.id}`}
                            className={`
                              group/cta relative overflow-hidden block w-full text-center py-3 rounded-xl font-semibold text-sm text-white
                              transform transition-all duration-300
                              hover:shadow-xl hover:scale-[1.02]
                              ${isFull ? 'opacity-50 cursor-not-allowed bg-slate-400' : ''}
                            `}
                            style={!isFull ? {
                              background: `linear-gradient(135deg, ${accent.primary}, ${accent.secondary})`,
                            } : undefined}
                            onClick={isFull ? (e) => e.preventDefault() : undefined}
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              {isFull ? "Sudah Penuh" : "Ikuti Sekarang"}
                              {!isFull && <span className="group-hover/cta:translate-x-1 transition-transform duration-300">→</span>}
                            </span>
                            
                            {/* Shine effect on button hover */}
                            {!isFull && (
                              <div className="absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                            )}
                          </Link>
                        </div>
                      </div>

                      {/* Glow effect on hover */}
                      <div 
                        className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10 blur-2xl"
                        style={{
                          background: `linear-gradient(135deg, ${accent.primary}80, ${accent.secondary}80)`,
                        }}
                      />
                      
                      {/* Border shine effect */}
                      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            {/* Stats / Progress Gamification (if user has participated) */}
            {activities.length > 0 && (
              <div className="mt-12 mx-auto max-w-2xl" data-scroll-reveal>
                <div className="rounded-2xl bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 border border-indigo-500/10 p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        🎉 Komunitas GEMA Aktif!
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {activities.length} event tersedia bulan ini
                      </p>
                    </div>
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold"
                        >
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-gradient-to-br from-pink-400 to-violet-400 flex items-center justify-center text-white text-xs font-bold">
                        +{Math.max(0, activities.reduce((sum, a) => sum + (a.participants || 0), 0) - 3)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom CTA - Join Community */}
            <div className="mt-16 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-8 sm:p-12 text-center border border-indigo-500/20" data-scroll-reveal>
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                Belum Gabung di GEMA?
              </h3>
              <p className="text-slate-600 dark:text-slate-200/80 mb-6 max-w-xl mx-auto">
                Daftar sekarang dan dapatkan akses ke semua kegiatan, workshop eksklusif, dan komunitas developer muda!
              </p>
              <Link
                href="/student/register"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-pink-500/50 hover:scale-105"
              >
                <Users className="w-4 h-4" />
                Daftar Jadi Member GEMA
              </Link>
            </div>
          </div>
        </section>

        <section
          id="announcements"
          ref={announcementsRef}
          className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 py-20 transition-colors duration-500 sm:py-24 dark:from-[#050513] dark:via-[#06081C] dark:to-[#050513]"
          aria-labelledby="announcements-heading"
        >
          {/* Animated background effects */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-cyan-400/15 to-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-indigo-400/10 to-violet-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />
          </div>
          
          <div className="relative mx-auto max-w-7xl px-6 sm:px-10">
            {/* Header Section */}
            <div className="text-center mb-12" data-scroll-reveal>
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-emerald-400/10 border border-cyan-500/20 backdrop-blur-sm">
                <span className="text-2xl animate-pulse" style={{ animationDuration: '2s' }}>📢</span>
                <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                  Update Terkini
                </span>
              </div>
              <h2
                id="announcements-heading"
                className="inline-block bg-gradient-to-r from-cyan-600 to-emerald-500 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl leading-tight"
              >
                Kabar Terbaru dari Tim GEMA 💡
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-200/80 leading-relaxed">
                Simak kegiatan terbaru, pengumuman penting, dan prestasi keren dari komunitas GEMA!
              </p>
              
              {/* Motivational quote */}
              <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500 dark:text-slate-400 italic">
                Sudah lihat update minggu ini? 💻 Klik untuk tahu selengkapnya!
              </p>
            </div>

            {/* Filter Tabs */}
            {latestAnnouncements.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 mb-12" data-scroll-reveal>
                {announcementCategories.map((category) => {
                  const categoryIcons: Record<string, string> = {
                    "Semua": "🌟",
                    "Info": "ℹ️",
                    "Penting": "⚠️",
                    "Kegiatan": "📅",
                    "Prestasi": "🏆",
                  };
                  
                  return (
                    <button
                      key={category}
                      onClick={() => setActiveAnnouncementFilter(category)}
                      className={`
                        group relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
                        ${activeAnnouncementFilter === category
                          ? 'text-white scale-105 shadow-lg'
                          : 'text-slate-600 dark:text-slate-300 hover:scale-105 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10'
                        }
                      `}
                      style={activeAnnouncementFilter === category ? {
                        background: category === "Semua"
                          ? 'linear-gradient(135deg, #0ea5e9, #10b981)'
                          : category === "Info"
                          ? 'linear-gradient(135deg, #0ea5e9, #22d3ee)'
                          : category === "Penting"
                          ? 'linear-gradient(135deg, #fbbf24, #f97316)'
                          : category === "Kegiatan"
                          ? 'linear-gradient(135deg, #6C63FF, #8F83FF)'
                          : 'linear-gradient(135deg, #10b981, #22c55e)',
                      } : undefined}
                      aria-pressed={activeAnnouncementFilter === category}
                      aria-label={`Filter ${category}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={activeAnnouncementFilter === category ? 'animate-bounce' : ''} style={{ animationDuration: '1s' }}>
                          {categoryIcons[category]}
                        </span>
                        {category}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {filteredLatestAnnouncements.length === 0 ? (
              <div className="col-span-3 text-center py-16" data-scroll-reveal>
                <div className="text-7xl mb-6 animate-bounce" style={{ animationDuration: '3s' }}>📭</div>
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Belum ada pengumuman {activeAnnouncementFilter !== "Semua" ? activeAnnouncementFilter : ""} saat ini
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-200/80 mb-6">
                  Pantau terus halaman ini untuk update dari tim GEMA atau coba filter lain
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold text-sm shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
                >
                  <Megaphone className="w-4 h-4" />
                  Kirim Pertanyaan
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Hero Announcement */}
                {filteredFeaturedAnnouncement && (
                  <article
                    data-scroll-reveal
                    className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 dark:border-white/10 dark:bg-white/5"
                    style={{
                      borderColor: `${announcementAccentMap[filteredFeaturedAnnouncement.type]?.primary || "#6C63FF"}40`,
                      boxShadow: `0 25px 50px -12px ${announcementAccentMap[filteredFeaturedAnnouncement.type]?.primary || "#6C63FF"}30`,
                    }}
                  >
                    {/* Accent Stripe */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-1 group-hover:w-1.5 transition-all duration-300"
                      style={{
                        background: `linear-gradient(180deg, ${announcementAccentMap[filteredFeaturedAnnouncement.type]?.primary || "#6C63FF"}, ${announcementAccentMap[filteredFeaturedAnnouncement.type]?.secondary || "#5EEAD4"})`,
                      }}
                    />
                    
                    {/* Background Gradient */}
                    <div 
                      className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${announcementAccentMap[filteredFeaturedAnnouncement.type]?.primary || "#6C63FF"}20, transparent 60%)`,
                      }}
                    />
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    
                    <div className="relative p-8 sm:p-10">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm uppercase tracking-wider"
                            style={{
                              background: `linear-gradient(135deg, ${announcementAccentMap[filteredFeaturedAnnouncement.type]?.primary || "#6C63FF"}15, ${announcementAccentMap[filteredFeaturedAnnouncement.type]?.secondary || "#5EEAD4"}10)`,
                              color: announcementAccentMap[filteredFeaturedAnnouncement.type]?.primary || "#6C63FF",
                            }}
                          >
                            <span className="text-xl">{announcementAccentMap[filteredFeaturedAnnouncement.type]?.emoji || "✨"}</span>
                            <span>FEATURED UPDATE</span>
                          </div>
                          
                          {/* Urgency Badge */}
                          {getUrgencyBadge(filteredFeaturedAnnouncement.type).show && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold animate-pulse">
                              {getUrgencyBadge(filteredFeaturedAnnouncement.type).text}
                            </span>
                          )}
                        </div>
                        
                        <div className={`flex items-center gap-1.5 text-xs font-semibold ${getTimeAgo(filteredFeaturedAnnouncement.publishedAt).color}`}>
                          {getTimeAgo(filteredFeaturedAnnouncement.publishedAt).fresh && (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                          )}
                          <time dateTime={filteredFeaturedAnnouncement.publishedAt}>
                            {getTimeAgo(filteredFeaturedAnnouncement.publishedAt).text}
                          </time>
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
                        {filteredFeaturedAnnouncement.title}
                      </h3>
                      
                      {/* Content Preview */}
                      <p className="text-base text-slate-600 dark:text-slate-200/80 leading-relaxed mb-6 italic">
                        &ldquo;{filteredFeaturedAnnouncement.content.substring(0, 150)}{filteredFeaturedAnnouncement.content.length > 150 ? "..." : ""}&rdquo;
                      </p>
                      
                      {/* Meta Footer */}
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                        Diposting oleh: <span className="font-semibold">Tim GEMA</span>
                      </div>
                      
                      {/* CTAs */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          className="group/cta inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:shadow-lg hover:scale-105 relative overflow-hidden"
                          style={{
                            background: `linear-gradient(135deg, ${announcementAccentMap[filteredFeaturedAnnouncement.type]?.primary || "#6C63FF"}, ${announcementAccentMap[filteredFeaturedAnnouncement.type]?.secondary || "#5EEAD4"})`,
                          }}
                        >
                          <span className="relative z-10">Baca Selengkapnya</span>
                          <ChevronRight className="w-4 h-4 relative z-10 group-hover/cta:translate-x-1 transition-transform duration-300" />
                          <div className="absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                        </button>
                        
                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border-2 transition-all duration-300 hover:scale-105"
                          style={{
                            borderColor: announcementAccentMap[filteredFeaturedAnnouncement.type]?.primary || "#6C63FF",
                            color: announcementAccentMap[filteredFeaturedAnnouncement.type]?.primary || "#6C63FF",
                          }}
                        >
                          <Megaphone className="w-4 h-4" />
                          Hubungi Tim
                        </Link>
                      </div>
                    </div>
                    
                    {/* Glow effect */}
                    <div 
                      className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${announcementAccentMap[filteredFeaturedAnnouncement.type]?.primary || "#6C63FF"}60, ${announcementAccentMap[filteredFeaturedAnnouncement.type]?.secondary || "#5EEAD4"}60)`,
                      }}
                    />
                  </article>
                )}
                
                {/* Secondary Announcements */}
                {filteredSecondaryAnnouncements.length > 0 && (
                  <div>
                    {/* Desktop/Tablet Grid */}
                    <div className="hidden sm:grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredSecondaryAnnouncements.map((announcement, index) => {
                      const accent = announcementAccentMap[announcement.type] ?? {
                        primary: "#6C63FF",
                        secondary: "#5EEAD4",
                        glow: "0 20px 45px rgba(108, 99, 255, 0.2)",
                        surface: "",
                        label: "Update",
                        emoji: "✨",
                      };
                      const timeAgo = getTimeAgo(announcement.publishedAt);
                      const urgency = getUrgencyBadge(announcement.type);

                      return (
                        <article
                          key={announcement.id}
                          data-scroll-reveal
                          className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 dark:border-white/10 dark:bg-white/5"
                          style={{
                            borderColor: `${accent.primary}30`,
                            boxShadow: `0 15px 35px -10px ${accent.primary}25`,
                          }}
                        >
                          {/* Accent Stripe */}
                          <div 
                            className="absolute left-0 top-0 bottom-0 w-1 group-hover:w-1.5 transition-all duration-300"
                            style={{
                              background: `linear-gradient(180deg, ${accent.primary}, ${accent.secondary})`,
                            }}
                          />
                          
                          {/* Urgency Badge - Top Right */}
                          {urgency.show && (
                            <div className="absolute top-4 right-4 px-2 py-1 rounded-md bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold animate-pulse">
                              {urgency.text}
                            </div>
                          )}
                          
                          {/* Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider group-hover:scale-105 transition-transform duration-300"
                              style={{
                                background: `linear-gradient(135deg, ${accent.primary}20, ${accent.secondary}10)`,
                                color: accent.primary,
                              }}
                            >
                              <span className="text-base group-hover:animate-bounce">{accent.emoji}</span>
                              <span>{accent.label}</span>
                            </div>
                            
                            <time className={`text-xs font-semibold ${timeAgo.color}`} dateTime={announcement.publishedAt}>
                              {timeAgo.text}
                            </time>
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-3 line-clamp-2">
                            {announcement.title}
                          </h3>
                          
                          {/* Content */}
                          <p className="text-sm text-slate-600 dark:text-slate-200/80 leading-relaxed mb-3 line-clamp-3 flex-1">
                            {announcement.content}
                          </p>
                          
                          {/* Meta Footer */}
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 mb-4">
                            Diposting oleh: Tim GEMA
                          </div>
                          
                          {/* CTA */}
                          <button
                            className="group/btn inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300"
                            style={{ color: accent.primary }}
                            aria-label={`Lihat detail ${announcement.title}`}
                          >
                            <span>Lihat Detail</span>
                            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </button>
                          
                          {/* Glow on hover */}
                          <div 
                            className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
                            style={{
                              background: `linear-gradient(135deg, ${accent.primary}40, ${accent.secondary}40)`,
                            }}
                          />
                        </article>
                      );
                    })}
                    </div>
                    
                    {/* Mobile Carousel with Snap Scroll */}
                    <div className="sm:hidden relative">
                      <div 
                        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
                        style={{
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none',
                        }}
                      >
                        {filteredSecondaryAnnouncements.map((announcement, index) => {
                          const accent = announcementAccentMap[announcement.type] ?? {
                            primary: "#6C63FF",
                            secondary: "#5EEAD4",
                            glow: "0 20px 45px rgba(108, 99, 255, 0.2)",
                            surface: "",
                            label: "Update",
                            emoji: "✨",
                          };
                          const timeAgo = getTimeAgo(announcement.publishedAt);
                          const urgency = getUrgencyBadge(announcement.type);

                          return (
                            <article
                              key={announcement.id}
                              className="group relative flex-none w-[85%] flex flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/90 p-6 shadow-xl backdrop-blur-xl snap-center"
                              style={{
                                borderColor: `${accent.primary}30`,
                                boxShadow: `0 15px 35px -10px ${accent.primary}25`,
                              }}
                            >
                              {/* Accent Stripe */}
                              <div 
                                className="absolute left-0 top-0 bottom-0 w-1"
                                style={{
                                  background: `linear-gradient(180deg, ${accent.primary}, ${accent.secondary})`,
                                }}
                              />
                              
                              {/* Urgency Badge */}
                              {urgency.show && (
                                <div className="absolute top-4 right-4 px-2 py-1 rounded-md bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold animate-pulse">
                                  {urgency.text}
                                </div>
                              )}
                              
                              {/* Header */}
                              <div className="flex items-center justify-between mb-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider"
                                  style={{
                                    background: `linear-gradient(135deg, ${accent.primary}20, ${accent.secondary}10)`,
                                    color: accent.primary,
                                  }}
                                >
                                  <span className="text-base">{accent.emoji}</span>
                                  <span>{accent.label}</span>
                                </div>
                                
                                <time className={`text-xs font-semibold ${timeAgo.color}`} dateTime={announcement.publishedAt}>
                                  {timeAgo.text}
                                </time>
                              </div>
                              
                              {/* Title */}
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-3">
                                {announcement.title}
                              </h3>
                              
                              {/* Content */}
                              <p className="text-sm text-slate-600 dark:text-slate-200/80 leading-relaxed mb-3 flex-1 line-clamp-4">
                                {announcement.content}
                              </p>
                              
                              {/* Meta */}
                              <div className="text-[11px] text-slate-400 dark:text-slate-500 mb-4">
                                Diposting oleh: Tim GEMA
                              </div>
                              
                              {/* CTA */}
                              <button
                                className="inline-flex items-center gap-2 text-sm font-semibold"
                                style={{ color: accent.primary }}
                              >
                                <span>Lihat Detail</span>
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </article>
                          );
                        })}
                      </div>
                      
                      {/* Scroll Indicators */}
                      <div className="flex justify-center gap-2 mt-4">
                        {filteredSecondaryAnnouncements.map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"
                            aria-label={`Slide ${i + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* "Kirim Pertanyaan" CTA - Prominent Position */}
            {filteredLatestAnnouncements.length > 0 && (
              <div className="mt-12 grid gap-6 sm:grid-cols-2 items-center" data-scroll-reveal>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Punya Pertanyaan? 💬
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-200/80">
                    Tim GEMA siap membantu menjawab pertanyaan kamu seputar kegiatan, program, atau apapun!
                  </p>
                </div>
                <div className="text-center sm:text-right">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 text-white font-bold text-base shadow-2xl transition-all duration-300 hover:shadow-pink-500/50 hover:scale-105"
                  >
                    <Megaphone className="w-5 h-5" />
                    Kirim Pertanyaan
                  </Link>
                </div>
              </div>
            )}
            
            {/* View All CTA */}
            {filteredLatestAnnouncements.length > 0 && (
              <div className="mt-8 text-center" data-scroll-reveal>
                <Link
                  href="/announcements"
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold text-base shadow-2xl transition-all duration-300 hover:shadow-cyan-500/50 hover:scale-105 relative overflow-hidden"
                  aria-label="Lihat semua pengumuman GEMA"
                >
                  <span className="relative z-10">Lihat Semua Pengumuman</span>
                  <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </Link>
              </div>
            )}
          </div>
        </section>

        <section
          id="gallery"
          ref={galleryRef}
          className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-sky-50 py-20 transition-colors duration-500 sm:py-24 dark:from-[#06081C] dark:via-[#050513] dark:to-[#06081C]"
          aria-labelledby="gallery-heading"
        >
          {/* Animated ambient particles */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-indigo-400/20 to-cyan-400/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${10 + Math.random() * 15}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  filter: 'blur(2px)',
                }}
              />
            ))}
          </div>
          
          {/* Ambient glow blobs */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-400/10 to-blue-400/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          </div>
          
          <div className="relative mx-auto max-w-7xl px-6 sm:px-10">
            {/* Header Section */}
            <div className="text-center mb-12" data-scroll-reveal>
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-400/10 border border-purple-500/20 backdrop-blur-sm">
                <span className="text-2xl">🎥</span>
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  Living Showcase
                </span>
              </div>
              <h2
                id="gallery-heading"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl leading-tight"
              >
                Hidupkan Kembali Momen Komunitas 💫
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-200/80 leading-relaxed">
                Potret kolaborasi, eksplorasi, dan kebanggaan visual dari setiap kegiatan GEMA
              </p>
              
              {/* Motivational quote */}
              <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500 dark:text-slate-400 italic">
                &ldquo;Setiap foto bercerita — bukan hanya dokumentasi&rdquo;
              </p>
              
              {/* Storytelling Context */}
              <div className="mx-auto mt-8 max-w-3xl p-6 rounded-2xl bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 border border-purple-200/30 dark:border-purple-500/20">
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
                  Di balik setiap foto, ada <span className="font-semibold text-purple-600 dark:text-purple-400">kisah siswa yang belajar, berkarya, dan berkolaborasi</span>. Jelajahi momen terbaik komunitas GEMA di sini — dari workshop coding hingga perayaan prestasi bersama 🌟
                </p>
              </div>
            </div>
            
            {/* Filters + Sorting Bar */}
            {gallery.length > 0 && (
              <div className="mb-12 space-y-6" data-scroll-reveal>
                {/* Category Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-3">
                  {galleryCategories.map((category) => {
                  const categoryData = category === "Semua" ? null : galleryCategoryMap[category.toLowerCase()];
                  const icon = category === "Semua" ? "🌟" : categoryData?.emoji || "📸";
                  
                  return (
                    <button
                      key={category}
                      onClick={() => setActiveGalleryFilter(category)}
                      className={`
                        group relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
                        ${activeGalleryFilter === category
                          ? 'text-white scale-105 shadow-lg'
                          : 'text-slate-600 dark:text-slate-300 hover:scale-105 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10'
                        }
                      `}
                      style={activeGalleryFilter === category && categoryData ? {
                        background: `linear-gradient(135deg, ${categoryData.primary}, ${categoryData.secondary})`,
                      } : activeGalleryFilter === category ? {
                        background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                      } : undefined}
                      aria-pressed={activeGalleryFilter === category}
                      aria-label={`Filter ${category}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={activeGalleryFilter === category ? 'animate-bounce' : ''} style={{ animationDuration: '1s' }}>
                          {icon}
                        </span>
                        {category}
                      </span>
                    </button>
                  );
                })}
                </div>
                
                {/* Sorting Dropdown */}
                <div className="flex justify-center items-center gap-3">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Urutkan:</span>
                  <div className="relative">
                    <select
                      value={gallerySortBy}
                      onChange={(e) => setGallerySortBy(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer transition-all duration-300 hover:border-purple-400 dark:hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      aria-label="Urutkan galeri"
                    >
                      <option value="terbaru">🕓 Terbaru</option>
                      <option value="populer">🔥 Terpopuler</option>
                      <option value="kategori">🌈 Kategori</option>
                    </select>
                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            {filteredGallery.length === 0 ? (
              <div className="text-center py-16" data-scroll-reveal>
                <div className="text-7xl mb-6">📷</div>
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Belum ada dokumentasi {activeGalleryFilter !== "Semua" ? activeGalleryFilter : ""} saat ini
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-200/80 mb-6">
                  Dokumentasi akan muncul setelah kegiatan berlangsung
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Hero Gallery - Featured */}
                {heroGallery && (
                  <article
                    data-scroll-reveal
                    onClick={() => openLightbox(0)}
                    className="group relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-700 hover:-translate-y-2 cursor-pointer"
                  >
                    {/* Hero Image Container */}
                    <div className="relative h-[400px] sm:h-[500px] overflow-hidden">
                      <OptimizedImage
                        src={heroGallery.image}
                        alt={heroGallery.title}
                        width={1200}
                        height={500}
                        className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:blur-[2px] saturate-[0.9] contrast-105"
                      />
                      
                      {/* Gradient Overlay - intensifies on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />
                      
                      {/* Category Badge - Top Left */}
                      {heroGallery.category && galleryCategoryMap[heroGallery.category.toLowerCase()] && (
                        <div className="absolute top-6 left-6 z-10">
                          <div 
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md font-bold text-sm uppercase tracking-wider shadow-lg transition-all duration-300 group-hover:scale-110"
                            style={{
                              background: `linear-gradient(135deg, ${galleryCategoryMap[heroGallery.category.toLowerCase()].primary}cc, ${galleryCategoryMap[heroGallery.category.toLowerCase()].secondary}cc)`,
                              boxShadow: `0 8px 24px ${galleryCategoryMap[heroGallery.category.toLowerCase()].primary}40`,
                            }}
                          >
                            <span className="text-xl text-white">{galleryCategoryMap[heroGallery.category.toLowerCase()].emoji}</span>
                            <span className="text-white">{galleryCategoryMap[heroGallery.category.toLowerCase()].label}</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Content - slides up on hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10 transform transition-transform duration-500 group-hover:translate-y-0 translate-y-2">
                        {/* Title */}
                        <h3 className="text-2xl sm:text-4xl font-bold text-white leading-tight mb-4 transition-all duration-500 opacity-100 group-hover:opacity-100">
                          {heroGallery.title}
                        </h3>
                        
                        {/* Description - fades in on hover */}
                        <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 max-w-2xl">
                          {heroGallery.description}
                        </p>
                        
                        {/* CTA - appears on hover */}
                        <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200">
                          <button 
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold text-sm hover:bg-white/30 transition-all duration-300"
                            aria-label={`Lihat detail ${heroGallery.title}`}
                          >
                            <span>Lihat Detail</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Ambient glow matching category */}
                      {heroGallery.category && galleryCategoryMap[heroGallery.category.toLowerCase()] && (
                        <div 
                          className="absolute -inset-1 opacity-0 group-hover:opacity-30 transition-opacity duration-700 -z-10 blur-3xl"
                          style={{
                            background: `radial-gradient(circle, ${galleryCategoryMap[heroGallery.category.toLowerCase()].primary}, ${galleryCategoryMap[heroGallery.category.toLowerCase()].secondary})`,
                          }}
                        />
                      )}
                    </div>
                  </article>
                )}
                
                {/* Asymmetric Grid Gallery */}
                {gridGallery.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 auto-rows-[200px]">
                    {gridGallery.map((item, index) => {
                      // Asymmetric sizing - create visual rhythm
                      const getGridClass = (idx: number) => {
                        // Pattern: large, medium, small, medium, large, small
                        const pattern = idx % 6;
                        if (pattern === 0) return "col-span-2 row-span-2"; // Large
                        if (pattern === 1) return "col-span-1 row-span-2"; // Tall
                        if (pattern === 2) return "col-span-1 row-span-1"; // Small
                        if (pattern === 3) return "col-span-2 row-span-1"; // Wide
                        if (pattern === 4) return "col-span-2 row-span-2"; // Large
                        return "col-span-1 row-span-1"; // Small
                      };
                      
                      const categoryData = item.category ? galleryCategoryMap[item.category.toLowerCase()] : null;
                      
                      return (
                        <article
                          key={item.id}
                          data-scroll-reveal
                          onClick={() => openLightbox(index + 1)}
                          style={{ animationDelay: `${index * 100}ms` }}
                          className={`
                            group relative overflow-hidden rounded-2xl shadow-lg
                            transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl cursor-pointer
                            ${getGridClass(index)}
                          `}
                        >
                          {/* Image */}
                          <OptimizedImage
                            src={item.image}
                            alt={item.title}
                            width={600}
                            height={400}
                            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-[1px] saturate-[0.95] contrast-[1.03]"
                          />
                          
                          {/* Overlay gradient - appears on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-60 group-hover:opacity-95 transition-opacity duration-500" />
                          
                          {/* Category Badge - with glow */}
                          {categoryData && (
                            <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div 
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg backdrop-blur-md text-xs font-bold uppercase tracking-wider"
                                style={{
                                  background: `linear-gradient(135deg, ${categoryData.primary}dd, ${categoryData.secondary}dd)`,
                                  boxShadow: `0 0 20px ${categoryData.primary}60`,
                                  animation: 'glow-pulse 2s ease-in-out infinite',
                                }}
                              >
                                <span>{categoryData.emoji}</span>
                                <span className="text-white text-[10px]">{categoryData.label}</span>
                              </div>
                            </div>
                          )}
                          
                          {/* Content - slides up */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 transform transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                            <h3 className="text-base sm:text-lg font-bold text-white leading-tight mb-2 line-clamp-2">
                              {item.title}
                            </h3>
                            
                            <p className="text-xs sm:text-sm text-white/80 leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100 line-clamp-2">
                              {item.description}
                            </p>
                            
                            {/* Lihat Detail CTA - small */}
                            <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-white">
                                Lihat Detail
                                <ChevronRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                          
                          {/* Glow effect on hover */}
                          {categoryData && (
                            <div 
                              className="absolute -inset-0.5 opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10 blur-xl"
                              style={{
                                background: `linear-gradient(135deg, ${categoryData.primary}, ${categoryData.secondary})`,
                              }}
                            />
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            {/* Bottom CTAs */}
            {filteredGallery.length > 0 && (
              <div className="mt-16 grid gap-6 sm:grid-cols-2" data-scroll-reveal>
                {/* Lihat Semua */}
                <div className="text-center sm:text-left">
                  <Link
                    href="/gallery"
                    className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-base shadow-2xl transition-all duration-300 hover:shadow-purple-500/50 hover:scale-105 relative overflow-hidden"
                  >
                    <span className="relative z-10">Lihat Semua Dokumentasi</span>
                    <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </Link>
                </div>
                
                {/* Kirim Karya */}
                <div className="text-center sm:text-right">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-purple-500 text-purple-600 dark:text-purple-400 font-bold text-base transition-all duration-300 hover:bg-purple-500 hover:text-white hover:scale-105"
                  >
                    <span className="text-xl">📸</span>
                    Kirim Karya Kamu
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Lightbox Modal */}
        {lightboxOpen && filteredGallery[lightboxIndex] && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
          >
            {/* White flash effect on photo change */}
            <div 
              key={lightboxIndex}
              className="absolute inset-0 bg-white pointer-events-none"
              style={{
                animation: 'flash 150ms ease-out',
                opacity: 0,
              }}
            />
            
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
              aria-label="Tutup lightbox"
            >
              <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Navigation Arrows */}
            {filteredGallery.length > 1 && (
              <>
                {/* Previous */}
                <button
                  onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
                  aria-label="Foto sebelumnya"
                >
                  <ChevronRight className="w-8 h-8 rotate-180" />
                </button>
                
                {/* Next */}
                <button
                  onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
                  aria-label="Foto selanjutnya"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
            
            {/* Content Container */}
            <div
              className="relative max-w-6xl mx-auto px-6 sm:px-10 w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Container with scale animation */}
              <div 
                className="relative mb-6 rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  animation: 'scaleIn 500ms ease-out',
                }}
              >
                <OptimizedImage
                  src={filteredGallery[lightboxIndex].image}
                  alt={filteredGallery[lightboxIndex].title}
                  width={1200}
                  height={800}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
                
                {/* Category Badge */}
                {filteredGallery[lightboxIndex].category && galleryCategoryMap[filteredGallery[lightboxIndex].category.toLowerCase()] && (
                  <div className="absolute top-4 left-4">
                    <div 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md font-bold text-sm uppercase tracking-wider shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${galleryCategoryMap[filteredGallery[lightboxIndex].category.toLowerCase()].primary}dd, ${galleryCategoryMap[filteredGallery[lightboxIndex].category.toLowerCase()].secondary}dd)`,
                      }}
                    >
                      <span className="text-xl text-white">{galleryCategoryMap[filteredGallery[lightboxIndex].category.toLowerCase()].emoji}</span>
                      <span className="text-white">{galleryCategoryMap[filteredGallery[lightboxIndex].category.toLowerCase()].label}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Description Below Image */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 
                    id="lightbox-title"
                    className="text-2xl sm:text-3xl font-bold text-white leading-tight"
                  >
                    {filteredGallery[lightboxIndex].title}
                  </h3>
                  <div className="text-sm text-white/60">
                    {lightboxIndex + 1} / {filteredGallery.length}
                  </div>
                </div>
                
                <p className="text-base sm:text-lg text-white/80 leading-relaxed">
                  {filteredGallery[lightboxIndex].description}
                </p>
                
                {/* Optional metadata - commented until createdAt added to type
                {filteredGallery[lightboxIndex].createdAt && (
                  <div className="mt-4 pt-4 border-t border-white/10 text-sm text-white/60">
                    📅 {formatDate(filteredGallery[lightboxIndex].createdAt)}
                  </div>
                )}
                */}
              </div>
              
              {/* Keyboard hints */}
              <div className="mt-4 flex justify-center gap-6 text-xs text-white/40">
                <span>← → Navigasi</span>
                <span>ESC Tutup</span>
              </div>
            </div>
          </div>
        )}

        <section
          id="cta"
          className="relative overflow-hidden bg-gradient-to-br from-[#f7f8ff] via-[#eef7ff] to-[#e6fbff] py-20 transition-colors duration-500 sm:py-24 dark:from-[#050513] dark:via-[#06081C] dark:to-[#0b0f2b]"
          aria-labelledby="cta-heading"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(108,99,255,0.18),transparent_65%)] dark:bg-[radial-gradient(circle_at_bottom,_rgba(108,99,255,0.2),transparent_65%)]" />
          <div className="relative mx-auto max-w-5xl px-6 sm:px-10">
            <div
              data-scroll-reveal
              className="relative overflow-hidden rounded-4xl border border-white/30 bg-white/95 p-10 shadow-2xl shadow-[#040410]/15 backdrop-blur-xl transition-colors duration-500 dark:border-white/10 dark:bg-gradient-to-br dark:from-[#6C63FF]/25 dark:via-[#06081C]/85 dark:to-[#5EEAD4]/25 dark:shadow-[#040410]/70 sm:p-12"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(108,99,255,0.22),transparent_65%)] opacity-70 dark:bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.24),transparent_60%)]"
              />
              <div className="relative flex flex-col items-start gap-6 text-slate-900 dark:text-white md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#5EEAD4]">
                    Ajukan Kolaborasi
                  </span>
                  <h2 id="cta-heading" className="mt-4 text-3xl font-semibold text-slate-900 transition-colors duration-500 dark:text-white sm:text-4xl">
                    Siap membawa energi baru ke laboratorium inovasi GEMA?
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-100/80 sm:text-base">
                    Daftarkan dirimu, dapatkan modul eksklusif, dan nikmati suasana belajar yang
                    memadukan kreativitas, spiritualitas, dan teknologi.
                  </p>
                </div>
                <div className="flex w-full flex-col gap-4 md:w-auto md:items-end">
                  <Link
                    href="/student/register"
                    className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white px-6 py-3 text-base font-semibold text-[#050513] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    aria-label="Daftar sebagai siswa baru"
                  >
                    Daftar Sekarang
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Link>
                  <p className="text-xs text-slate-500 dark:text-slate-100/70">
                    Mulai belajar dengan platform LMS modern untuk Informatika SMA.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
