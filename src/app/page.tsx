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
  ChevronRight,
  Code2,
  GraduationCap,
  MapPin,
  Megaphone,
  MonitorPlay,
  Sparkles,
  Users,
} from "lucide-react";

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
  totalAchievements: number;
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
    title: "Dashboard & Progress Tracking",
    description:
      "Monitor progress belajar siswa secara real-time dengan visualisasi yang jelas. Lihat statistik, achievement, dan area yang perlu improvement.",
    highlights: ["Progress real-time", "Analitik mendalam", "Export laporan"],
    icon: BarChart3,
    accent: {
      primary: "#6C63FF",
      secondary: "#7F7FFF",
      spotlight: "rgba(108, 99, 255, 0.28)",
      shadow: "0 18px 45px rgba(108, 99, 255, 0.18)",
      hoverShadow: "0 24px 55px rgba(108, 99, 255, 0.28)",
      emoji: "📊",
      label: "Dashboard",
    },
  },
  {
    title: "Interactive Coding Lab",
    description:
      "Platform coding lab dengan code editor powerful, test case otomatis, dan feedback instant. Mendukung Python, JavaScript, dan HTML/CSS.",
    highlights: ["Auto-grading", "Multiple languages", "Instant feedback"],
    icon: Code2,
    accent: {
      primary: "#5EEAD4",
      secondary: "#50B0FF",
      spotlight: "rgba(94, 234, 212, 0.32)",
      shadow: "0 18px 45px rgba(80, 176, 255, 0.18)",
      hoverShadow: "0 24px 55px rgba(80, 176, 255, 0.26)",
      emoji: "💻",
      label: "Coding Lab",
    },
  },
  {
    title: "Tutorial & Learning Path",
    description:
      "Materi pembelajaran terstruktur dengan video, artikel, dan latihan interaktif. Siswa belajar sesuai pace mereka sendiri.",
    highlights: ["Kurikulum lengkap", "Video tutorial", "Interactive quiz"],
    icon: MonitorPlay,
    accent: {
      primary: "#FF99CC",
      secondary: "#FDB9FF",
      spotlight: "rgba(255, 153, 204, 0.3)",
      shadow: "0 18px 45px rgba(255, 153, 204, 0.22)",
      hoverShadow: "0 24px 55px rgba(255, 153, 204, 0.3)",
      emoji: "📚",
      label: "Tutorial",
    },
  },
];

const heroSpotlightCards = [
  {
    title: "Auto-Grading System",
    caption: "Sistem penilaian otomatis untuk coding assignments dan quiz.",
    accent: "#5EEAD4",
  },
  {
    title: "Multi-Language Support",
    caption: "Mendukung Python, JavaScript, HTML/CSS untuk pembelajaran lengkap.",
    accent: "#F4B5FF",
  },
  {
    title: "Real-Time Analytics",
    caption: "Dashboard komprehensif untuk tracking progress dan performa siswa.",
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
    surface: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(239,238,255,0.92) 100%)",
    label: "Aktif",
    emoji: "🚀",
  },
  {
    primary: "#5EEAD4",
    secondary: "#53C8FF",
    tertiary: "rgba(94, 234, 212, 0.2)",
    glow: "0 22px 55px rgba(83, 200, 255, 0.2)",
    surface: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(228,250,249,0.9) 100%)",
    label: "Kolaborasi",
    emoji: "🤝",
  },
  {
    primary: "#FFB347",
    secondary: "#FFCF86",
    tertiary: "rgba(255, 179, 71, 0.24)",
    glow: "0 22px 55px rgba(255, 179, 71, 0.22)",
    surface: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,247,232,0.92) 100%)",
    label: "Pembelajaran",
    emoji: "📘",
  },
  {
    primary: "#FF99CC",
    secondary: "#FFB4E3",
    tertiary: "rgba(255, 153, 204, 0.24)",
    glow: "0 22px 55px rgba(255, 153, 204, 0.2)",
    surface: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,241,248,0.92) 100%)",
    label: "Prestasi",
    emoji: "🏆",
  },
];

const activityAccents: AccentPalette[] = [
  {
    primary: "#6C63FF",
    secondary: "#8B7CFF",
    glow: "0 24px 60px rgba(108, 99, 255, 0.22)",
    surface: "linear-gradient(165deg, rgba(255,255,255,0.95) 0%, rgba(240,242,ff,0.9) 100%)",
    label: "Bootcamp",
  },
  {
    primary: "#5EEAD4",
    secondary: "#58D3FF",
    glow: "0 24px 60px rgba(94, 234, 212, 0.22)",
    surface: "linear-gradient(165deg, rgba(255,255,255,0.95) 0%, rgba(229,250,249,0.92) 100%)",
    label: "Workshop",
  },
  {
    primary: "#FF99CC",
    secondary: "#FFB3E2",
    glow: "0 24px 60px rgba(255, 153, 204, 0.22)",
    surface: "linear-gradient(165deg, rgba(255,255,255,0.95) 0%, rgba(255,240,248,0.92) 100%)",
    label: "Community",
  },
];

const announcementAccentMap: Record<string, AccentPalette> = {
  event: {
    primary: "#6C63FF",
    secondary: "#8F83FF",
    glow: "0 20px 45px rgba(108, 99, 255, 0.2)",
    surface: "linear-gradient(165deg, rgba(255,255,255,0.94) 0%, rgba(239,241,ff,0.92) 100%)",
    label: "Event",
    emoji: "📅",
  },
  achievement: {
    primary: "#FFB347",
    secondary: "#FFCF86",
    glow: "0 20px 45px rgba(255, 179, 71, 0.22)",
    surface: "linear-gradient(165deg, rgba(255,255,255,0.94) 0%, rgba(255,246,230,0.92) 100%)",
    label: "Prestasi",
    emoji: "🌟",
  },
  info: {
    primary: "#5EEAD4",
    secondary: "#63B8FF",
    glow: "0 20px 45px rgba(94, 234, 212, 0.2)",
    surface: "linear-gradient(165deg, rgba(255,255,255,0.94) 0%, rgba(232,250,245,0.92) 100%)",
    label: "Info",
    emoji: "ℹ️",
  },
};

const galleryAccents: AccentPalette[] = [
  {
    primary: "#6C63FF",
    secondary: "#5EEAD4",
    glow: "0 20px 45px rgba(108, 99, 255, 0.18)",
    surface: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(237,240,255,0.92) 100%)",
    label: "Labs",
  },
  {
    primary: "#FF99CC",
    secondary: "#FFD1DC",
    glow: "0 20px 45px rgba(255, 153, 204, 0.2)",
    surface: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,240,248,0.92) 100%)",
    label: "Kolaborasi",
  },
  {
    primary: "#5EEAD4",
    secondary: "#6DB2FF",
    glow: "0 20px 45px rgba(94, 234, 212, 0.2)",
    surface: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(233,248,255,0.92) 100%)",
    label: "Eksplorasi",
  },
];


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

const formatStatValue = (value: number, suffix = "") =>
  `${value.toLocaleString("id-ID")}${suffix}`;

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
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalTutorials: 0,
    totalCodingLabs: 0,
    totalActivities: 0,
    totalAnnouncements: 0,
    totalGalleryItems: 0,
    totalAssignments: 0,
    totalAchievements: 0,
    upcomingEventsToday: 0,
    upcomingEventsThisWeek: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const [shouldRenderVanta, setShouldRenderVanta] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLottieLoaded, setIsLottieLoaded] = useState(false);

  const prefersReducedMotion = usePrefersReducedMotion();

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

  // Parallax removed - simplified for performance (can use CSS transform if needed)

  // Feature cards animation now handled by useScrollReveal hook + CSS
  // Native Intersection Observer triggers .scroll-reveal animations with stagger delays

  const statsItems = useMemo(
    () => [
      {
        label: "Siswa Terdaftar",
        value: stats.totalStudents,
        suffix: "+",
        description: "siswa yang aktif menggunakan platform GEMA untuk belajar.",
        icon: Users,
      },
      {
        label: "Tutorial & Materi",
        value: stats.totalTutorials,
        suffix: "+",
        description: "artikel tutorial dan materi pembelajaran terstruktur.",
        icon: BookOpenCheck,
      },
      {
        label: "Coding Lab",
        value: stats.totalCodingLabs,
        suffix: "+",
        description: "latihan coding interaktif dengan auto-grading system.",
        icon: Code2,
      },
      {
        label: "Assignment Selesai",
        value: stats.totalAchievements,
        suffix: "+",
        description: "tugas yang telah diselesaikan siswa dengan sukses.",
        icon: GraduationCap,
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
              if (!counterElement) {
                return;
              }
              
              // Native JS counter animation
              const duration = 2000; // 2 seconds
              const steps = 60;
              const increment = stat.value / steps;
              let currentValue = 0;
              let step = 0;
              
              const timer = setInterval(() => {
                step++;
                currentValue = Math.min(currentValue + increment, stat.value);
                counterElement.textContent = formatStatValue(
                  Math.round(currentValue),
                  stat.suffix,
                );
                
                if (step >= steps) {
                  clearInterval(timer);
                  counterElement.textContent = formatStatValue(stat.value, stat.suffix);
                }
              }, duration / steps);
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
        ? "absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_18%,_rgba(94,234,212,0.18),transparent_58%)]"
        : "absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_18%,_rgba(108,99,255,0.12),transparent_68%)]",
    [resolvedTheme],
  );

  const heroBackdropOverlay = useMemo(
    () =>
      resolvedTheme === "dark"
        ? "absolute inset-0 pointer-events-none bg-gradient-to-br from-[#070721]/85 via-[#050513]/65 to-[#021119]/90"
        : "absolute inset-0 pointer-events-none bg-gradient-to-br from-[#ffffff]/92 via-[#eef3ff]/70 to-[#e6faff]/90",
    [resolvedTheme],
  );

  const featuredActivities = useMemo(() => activities.slice(0, 3), [activities]);
  const latestAnnouncements = useMemo(() => announcements.slice(0, 3), [announcements]);
  const highlightedGallery = useMemo(() => gallery.slice(0, 6), [gallery]);

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
          className="relative overflow-hidden"
          aria-labelledby="hero-heading"
          data-parallax-root
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
              <div
                data-parallax="0.25"
                className="absolute -top-24 right-16 h-64 w-64 rounded-full bg-gradient-to-br from-[#6C63FF]/45 to-transparent blur-3xl"
              />
              <div
                data-parallax="0.2"
                className="absolute bottom-0 left-16 h-72 w-72 rounded-full bg-gradient-to-br from-[#5EEAD4]/35 to-transparent blur-3xl"
              />
              <div
                data-parallax="0.35"
                className="absolute -bottom-20 right-24 h-44 w-44 rounded-full border border-[#5EEAD4]/40"
              />
            </div>
          </div>

          <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-20 pt-24 sm:px-10 md:flex-row md:items-center md:pb-28 md:pt-32">
            <div className="flex-1">
              <div
                className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur animate-scale-in"
                style={{ animationDelay: "0.1s" }}
              >
                <Image
                  src="/gema.svg"
                  alt="Logo GEMA - Learning Management System"
                  width={48}
                  height={48}
                  priority
                />
              </div>
              <p className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.3em] text-[#5EEAD4]/80">
                Learning Management System
                <span className="h-px w-10 bg-[#5EEAD4]/40" aria-hidden="true" />
              </p>
              <h1
                id="hero-heading"
                ref={heroTitleRef}
                className="hero-title mt-5 text-4xl font-semibold leading-tight text-slate-900 transition-colors duration-500 dark:text-white sm:text-5xl md:text-6xl"
              >
                Platform LMS Informatika yang Bikin Belajar Coding Jadi Seru dan Interaktif
              </h1>
              <p
                ref={heroSubtitleRef}
                className="hero-subtitle mt-6 max-w-xl text-base leading-relaxed text-slate-600 transition-colors duration-500 dark:text-slate-200/85 sm:text-lg"
              >
                <strong className="text-slate-900 dark:text-white">GEMA (Generasi Muda Informatika)</strong> adalah 
                Learning Management System modern untuk mata pelajaran Informatika SMA. 
                Dengan fitur coding lab interaktif, tutorial terstruktur, dan sistem penilaian otomatis 
                yang membantu siswa belajar pemrograman dengan cara yang menyenangkan.
              </p>

              <ul className="mt-6 flex items-center gap-3 text-xl sm:gap-4" aria-hidden="true">
                {heroEmojis.map((emoji) => (
                  <li key={emoji.label} className="hero-emoji" title={emoji.label}>
                    {emoji.symbol}
                  </li>
                ))}
              </ul>

              <div
                ref={heroButtonsRef}
                className="hero-cta mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6"
              >
                <Link
                  href="/student/register"
                  ref={ctaButtonRef}
                  className="cta-button inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#5EEAD4] px-8 py-4 text-base font-semibold text-[#0b0b1c] shadow-lg transition-transform duration-300 hover:-translate-y-0.5 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5EEAD4]"
                  aria-label="Daftar sebagai siswa baru"
                >
                  Gabung Sekarang
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
                <Link
                  href="/tutorial"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#5EEAD4] transition-colors duration-300 hover:text-[#6ff0df] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5EEAD4]"
                >
                  Jelajahi Kurikulum
                  <span aria-hidden="true" className="h-px w-8 bg-[#5EEAD4]/50" />
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4 text-base">
                <span className="rounded-full bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#5EEAD4]">
                  Platform LMS Informatika
                </span>
                <span ref={typedRef} className="text-xl font-semibold text-[#5EEAD4]" aria-live="polite" />
              </div>

              <div className="mt-8 grid gap-4 text-sm text-slate-600 transition-colors duration-500 dark:text-slate-200/70 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/80 p-4 backdrop-blur-sm dark:bg-white/5">
                  <p className="font-semibold text-slate-900 dark:text-white">Comprehensive Features</p>
                  <p className="mt-1">
                    Coding lab, tutorial articles, quiz system, dan assignment management dalam satu platform.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/80 p-4 backdrop-blur-sm dark:bg-white/5">
                  <p className="font-semibold text-slate-900 dark:text-white">Teacher & Student Portal</p>
                  <p className="mt-1">
                    Dashboard terpisah untuk guru dan siswa dengan role management yang fleksibel.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {heroSpotlightCards.map((card, index) => (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-white/10 bg-white/90 p-4 text-left shadow-lg shadow-[#03030f]/20 backdrop-blur transition-colors duration-500 dark:bg-white/5 dark:shadow-[#03030f]/40 animate-slide-up"
                    style={{
                      borderColor: `${card.accent}33`,
                      boxShadow: `0 12px 28px ${card.accent}26`,
                      animationDelay: prefersReducedMotion ? "0s" : `${0.2 + index * 0.12}s`,
                    }}
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{card.title}</p>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-200/75">{card.caption}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex-1 space-y-6">
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

              <div className="flex flex-col gap-5 rounded-3xl border border-white/20 bg-white/95 p-6 backdrop-blur-lg transition-colors duration-500 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6C63FF]/90 to-[#5EEAD4]/60 text-[#050513]">
                    <Calendar className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Agenda Pekan Ini</p>
                    <p className="text-xs text-slate-500 dark:text-slate-200/70">
                      {stats.upcomingEventsThisWeek} kegiatan siap diikuti
                    </p>
                  </div>
                </div>
                <div
                  ref={lottieContainerRef}
                  className="relative h-40 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#6C63FF]/20 via-transparent to-[#5EEAD4]/10 lottie-shell"
                  role="presentation"
                  aria-hidden="true"
                >
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center gap-2 text-xs font-semibold text-slate-600 transition-opacity duration-300 dark:text-slate-200/70 ${
                      isLottieLoaded && !prefersReducedMotion ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <div className="lottie-placeholder-grid">
                      <span className="lottie-placeholder-dot" />
                      <span className="lottie-placeholder-dot" />
                      <span className="lottie-placeholder-dot" />
                    </div>
                    <span>Visual animatif akan tampil di sini</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/90 p-6 backdrop-blur transition-colors duration-500 dark:border-white/10 dark:bg-white/5">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Tentang GEMA
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-200/80">
                    GEMA (Generasi Muda Informatika) adalah platform Learning Management System yang dirancang khusus untuk pembelajaran Informatika tingkat SMA.
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#6C63FF]/10 text-[#6C63FF]">
                        <Code2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Interactive Coding Lab</p>
                        <p className="text-xs text-slate-600 dark:text-slate-200/70">
                          Editor code dengan auto-grading dan instant feedback
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#5EEAD4]/10 text-[#5EEAD4]">
                        <BookOpenCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Structured Learning Path</p>
                        <p className="text-xs text-slate-600 dark:text-slate-200/70">
                          Tutorial, artikel, dan quiz terstruktur sesuai kurikulum
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FF99CC]/10 text-[#FF99CC]">
                        <BarChart3 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Real-Time Analytics</p>
                        <p className="text-xs text-slate-600 dark:text-slate-200/70">
                          Dashboard komprehensif untuk tracking progress siswa
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="relative overflow-hidden bg-[#eef3ff] py-20 transition-colors duration-500 sm:py-24 dark:bg-[#06081C]"
          aria-labelledby="features-heading"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(108,99,255,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(108,99,255,0.12),transparent_60%)]" />
          <div
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6C63FF]/30 to-transparent dark:via-white/20"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
            <div className="max-w-2xl" data-scroll-reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#5EEAD4]/80">
                Program Unggulan
              </span>
              <h2
                id="features-heading"
                className="mt-5 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl"
              >
                Jalur belajar modern yang mengalir dari teori ke praktik
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-200/80">
                Setiap fitur dirancang untuk menjaga fokus siswa, mempermudah guru memantau progres,
                serta mempercepat ide menjadi prototipe nyata.
              </p>
            </div>

            <div
              ref={featuresRef}
              className="mt-12 grid gap-6 md:grid-cols-3 lg:[grid-template-columns:1.1fr_1fr_0.95fr]"
              aria-live="polite"
              aria-busy="false"
            >
              {featuresData.map((feature, index) => {
                const Icon = feature.icon;
                const cardStyle = {
                  boxShadow: feature.accent.shadow,
                  borderColor: `${feature.accent.primary}26`,
                  background: "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(247,249,255,0.95) 100%)",
                  "--card-accent-primary": feature.accent.primary,
                  "--card-accent-secondary": feature.accent.secondary,
                  "--card-accent-tertiary": feature.accent.spotlight,
                  "--card-shadow-hover": feature.accent.hoverShadow,
                  "--spotlight-x": "50%",
                  "--spotlight-y": "50%",
                } as CSSProperties;

                return (
                  <article
                    key={feature.title}
                    data-feature-card
                    data-scroll-reveal
                    className="group feature-card relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/90 p-8 shadow-xl shadow-[#050513]/10 backdrop-blur-xl transition-colors duration-500 will-change-transform dark:border-white/10 dark:bg-white/5 dark:shadow-[#050513]/40 sm:p-9"
                    style={cardStyle}
                    onPointerMove={handleFeaturePointerMove}
                    onPointerLeave={handleFeaturePointerLeave}
                    onPointerUp={handleFeaturePointerLeave}
                  >
                    <div className="absolute inset-0 pointer-events-none">
                      <span className="feature-card-ornament" aria-hidden="true" />
                    </div>
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-200/70">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/40 px-3 py-1 text-[0.65rem] font-semibold dark:bg-white/10">
                        {feature.accent.emoji} {feature.accent.label}
                      </span>
                      <span className="hidden text-[0.65rem] font-semibold text-[#5EEAD4]/80 sm:inline">
                        #{(index + 1).toString().padStart(2, "0")}
                      </span>
                    </div>
                    <div className="relative mt-4 flex items-center gap-4">
                      <div
                        className="feature-card-icon flex h-12 w-12 items-center justify-center rounded-2xl text-[#050513] shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${feature.accent.primary}, ${feature.accent.secondary})`,
                        }}
                      >
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                    </div>
                    <p className="relative mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-200/80">
                      {feature.description}
                    </p>
                    <ul className="relative mt-6 flex flex-wrap gap-2 text-xs text-[#5EEAD4]/90">
                      {feature.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="rounded-full border border-[#5EEAD4]/30 bg-[#06081C]/60 px-3 py-1"
                        >
                          {highlight}
                        </li>
                      ))}
                    </ul>
                    <div className="relative mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-[#5EEAD4]/80">
                      Selengkapnya
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="stats"
          ref={statsRef}
          className="relative overflow-hidden bg-[#f7f9ff] py-20 transition-colors duration-500 sm:py-24 dark:bg-[#050513]"
          aria-labelledby="stats-heading"
          data-parallax-root
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(94,234,212,0.16),transparent_70%)] dark:bg-[radial-gradient(circle_at_center,_rgba(94,234,212,0.14),transparent_65%)]" />
          <div className="absolute inset-0 opacity-75">
            <div
              data-parallax="0.18"
              className="absolute right-16 top-12 h-48 w-48 rounded-full border border-[#6C63FF]/30"
            />
            <div
              data-parallax="0.28"
              className="absolute -left-10 bottom-8 h-60 w-60 rounded-full bg-gradient-to-br from-[#6C63FF]/30 to-transparent blur-3xl"
            />
          </div>
          <div className="stats-grid relative mx-auto max-w-6xl px-6 sm:px-10">
            <div className="text-center" data-scroll-reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#5EEAD4]/80">
                Dampak Komunitas
              </span>
              <h2 id="stats-heading" className="mt-5 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
                Pertumbuhan ekosistem belajar yang terukur dan kolaboratif
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-200/75">
                Data berikut diperbarui secara realtime dari dashboard komunitas, memberikan gambaran
                nyata bagaimana siswa dan guru berinteraksi dalam program GEMA.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {statsItems.map((stat, index) => {
                const Icon = stat.icon;
                const accent = statsAccents[index % statsAccents.length];
                const statCardStyle = {
                  background: accent.surface,
                  borderColor: `${accent.primary}26`,
                  boxShadow: accent.glow,
                } as CSSProperties;
                return (
                  <article
                    key={stat.label}
                    data-scroll-reveal
                    className="stat-card relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-white/20 bg-white/90 p-8 shadow-xl shadow-[#040410]/10 backdrop-blur-xl transition-colors duration-500 dark:border-white/10 dark:bg-white/5 dark:shadow-[#040410]/60"
                    style={statCardStyle}
                  >
                    <div
                      className="relative flex items-center gap-4"
                      data-shimmer
                    >
                      <div
                        className="stat-card-icon relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl"
                        style={{
                          background: `linear-gradient(135deg, ${accent.primary}, ${accent.secondary})`,
                        }}
                      >
                        <Icon className="h-7 w-7 text-[#050513]" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-medium uppercase tracking-wide text-slate-600 dark:text-slate-200/70">
                          {stat.label}
                        </p>
                        <p className="mt-1 flex items-baseline gap-2 text-3xl font-semibold text-slate-900 dark:text-white">
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
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.45em] text-slate-500 dark:text-slate-300/80">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/40 px-3 py-1 text-[0.6rem] dark:bg-white/10">
                        {accent.emoji ?? "✨"} {accent.label}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-200/70">{stat.description}</p>
                    {index === 0 && (
                      <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/80 px-4 py-3 text-xs text-slate-600 transition-colors duration-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-200/70">
                        <Sparkles className="h-4 w-4 text-[#5EEAD4]" aria-hidden="true" />
                        {stats.upcomingEventsToday} agenda berlangsung hari ini ·{" "}
                        {stats.upcomingEventsThisWeek} agenda dalam satu pekan
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="activities"
          ref={activitiesRef}
          className="relative overflow-hidden bg-[#f2f5ff] py-20 transition-colors duration-500 sm:py-24 dark:bg-[#06081C]"
          aria-labelledby="activities-heading"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(108,99,255,0.08),transparent_65%)] dark:bg-[radial-gradient(circle_at_top,_rgba(108,99,255,0.08),transparent_65%)]" />
          <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl" data-scroll-reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#5EEAD4]/80">
                  Kegiatan Komunitas
                </span>
                <h2
                  id="activities-heading"
                  className="mt-5 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl"
                >
                  Agenda dan project yang membuat belajar semakin nyata
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-200/80">
                  Dari kelas mini, bootcamp, hingga showcase produk—semua dirancang untuk membangun
                  budaya eksplorasi dan kolaborasi.
                </p>
              </div>
              <Link
                href="/tutorial"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#5EEAD4] transition-colors hover:text-[#7cf1e2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5EEAD4]"
              >
                Lihat roadmap lengkap
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {featuredActivities.length === 0 ? (
                <p className="text-sm text-slate-600 dark:text-slate-200/70" data-scroll-reveal>
                  Belum ada kegiatan terbaru. Tim kami sedang menyiapkan agenda berikutnya.
                </p>
              ) : (
                featuredActivities.map((activity, index) => {
                  const accent = activityAccents[index % activityAccents.length];
                  const activityStyle = {
                    background: accent.surface,
                    borderColor: `${accent.primary}26`,
                    boxShadow: accent.glow,
                  } as CSSProperties;

                  return (
                    <article
                      key={activity.id}
                      data-scroll-reveal
                      className="activities-card relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/90 p-6 shadow-xl shadow-[#040410]/10 backdrop-blur-xl transition-transform duration-300 dark:border-white/10 dark:bg-white/5 dark:shadow-[#040410]/40"
                      style={activityStyle}
                      onPointerMove={prefersReducedMotion ? undefined : handleFeaturePointerMove}
                      onPointerLeave={prefersReducedMotion ? undefined : handleFeaturePointerLeave}
                      onPointerUp={prefersReducedMotion ? undefined : handleFeaturePointerLeave}
                    >
                      <div className="absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60" aria-hidden="true" />
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-200/70">
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full" style={{ background: accent.primary }} />
                          {activity.category}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-200/70">
                          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                          {formatDate(activity.date)}
                        </span>
                      </div>
                      <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">{activity.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-200/75">
                        {activity.description}
                      </p>
                      <dl className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-200/60">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" aria-hidden="true" style={{ color: accent.primary }} />
                          <dd>{activity.location}</dd>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" aria-hidden="true" style={{ color: accent.primary }} />
                          <dd>
                            {activity.participants}/{activity.capacity} peserta
                          </dd>
                        </div>
                      </dl>
                      <div className="mt-auto flex items-center justify-between pt-6 text-xs text-[#5EEAD4]/80">
                        <span className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-200/70">
                          <span className="rounded-full bg-white/50 px-2 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.35em] dark:bg-white/10">
                            {accent.label}
                          </span>
                        </span>
                        <span className="text-slate-500 dark:text-slate-200/70">{activity.time}</span>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </section>

        <section
          id="announcements"
          ref={announcementsRef}
          className="relative overflow-hidden bg-[#f7f8ff] py-20 transition-colors duration-500 sm:py-24 dark:bg-[#050513]"
          aria-labelledby="announcements-heading"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(94,234,212,0.12),transparent_60%)] dark:bg-[radial-gradient(circle_at_bottom,_rgba(94,234,212,0.1),transparent_60%)]" />
          <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl" data-scroll-reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#5EEAD4]/80">
                  Pengumuman
                </span>
                <h2
                  id="announcements-heading"
                  className="mt-5 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl"
                >
                  Update terbaru dari tim GEMA
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-200/80">
                  Informasi kegiatan, prestasi siswa, dan highlight program dirangkum agar kamu tetap
                  terhubung dengan ekosistem komunitas.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#5EEAD4] transition-colors hover:text-[#7cf1e2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5EEAD4]"
              >
                Kirim pertanyaan
                <Megaphone className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {latestAnnouncements.length === 0 ? (
                <p className="text-sm text-slate-600 dark:text-slate-200/70" data-scroll-reveal>
                  Belum ada pengumuman baru. Pantau terus laman ini untuk informasi selanjutnya.
                </p>
              ) : (
                latestAnnouncements.map((announcement) => {
                  const accent = announcementAccentMap[announcement.type] ?? {
                    primary: "#6C63FF",
                    secondary: "#5EEAD4",
                    glow: "0 20px 45px rgba(108, 99, 255, 0.2)",
                    surface: "linear-gradient(165deg, rgba(255,255,255,0.94) 0%, rgba(241,244,ff,0.92) 100%)",
                    label: "Update",
                    emoji: "✨",
                  };

                  const announcementStyle = {
                    background: accent.surface,
                    borderColor: `${accent.primary}26`,
                    boxShadow: accent.glow,
                    "--announcement-glow": accent.glow,
                  } as CSSProperties;

                  return (
                    <article
                      key={announcement.id}
                      data-scroll-reveal
                      className="announcement-card relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-white/20 bg-white/90 p-6 shadow-xl shadow-[#040410]/10 backdrop-blur-xl transition-colors duration-500 dark:border-white/10 dark:bg-white/5 dark:shadow-[#040410]/40"
                      style={announcementStyle}
                    >
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[#5EEAD4]/80">
                        <span>
                          {accent.emoji} {announcement.type}
                        </span>
                        <time
                          dateTime={announcement.publishedAt}
                          className="text-[11px] text-slate-500 dark:text-slate-200/70"
                        >
                          {formatDate(announcement.publishedAt)}
                        </time>
                      </div>
                      <span data-label className="text-[#5EEAD4]/80">
                        {accent.label}
                      </span>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{announcement.title}</h3>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-200/75">
                        {announcement.content}
                      </p>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </section>

        <section
          id="gallery"
          ref={galleryRef}
          className="relative overflow-hidden bg-[#f3f4ff] py-20 transition-colors duration-500 sm:py-24 dark:bg-[#06081C]"
          aria-labelledby="gallery-heading"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(108,99,255,0.12),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(108,99,255,0.1),transparent_60%)]" />
          <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
            <div className="max-w-2xl" data-scroll-reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#5EEAD4]/80">
                Galeri Kegiatan
              </span>
              <h2
                id="gallery-heading"
                className="mt-5 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl"
              >
                Sekilas dokumentasi karya dan eksplorasi komunitas
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-200/80">
                Potret momen kolaborasi, sesi mentoring, hingga showcase proyek yang menggambarkan
                suasana belajar yang hidup.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {highlightedGallery.length === 0 ? (
                <p className="text-sm text-slate-600 dark:text-slate-200/70" data-scroll-reveal>
                  Dokumentasi akan segera hadir setelah kegiatan terbaru berlangsung.
                </p>
              ) : (
                highlightedGallery.map((item, index) => {
                  const accent = galleryAccents[index % galleryAccents.length];
                  const galleryStyle = {
                    boxShadow: accent.glow,
                    borderColor: `${accent.primary}26`,
                    background: accent.surface,
                    "--gallery-primary": accent.primary,
                    "--gallery-secondary": accent.secondary,
                  } as CSSProperties;

                  return (
                    <article
                      key={item.id}
                      data-scroll-reveal
                      className="gallery-card group relative overflow-hidden rounded-3xl border border-white/20 bg-white/95 shadow-xl shadow-[#040410]/10 backdrop-blur-xl transition-transform duration-300 dark:border-white/10 dark:bg-white/5 dark:shadow-[#040410]/40"
                      style={galleryStyle}
                    >
                      <div className="relative h-56 overflow-hidden">
                        <OptimizedImage
                          src={item.image}
                          alt={item.title}
                          width={600}
                          height={360}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="gallery-card-overlay absolute inset-0" />
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-200">
                              {item.category}
                            </p>
                            <h3 className="mt-2 text-lg font-semibold text-white dark:text-white">
                              {item.title}
                            </h3>
                          </div>
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/10 text-sm font-semibold text-white">
                            {(accent.label ?? " ").slice(0, 1)}
                          </span>
                        </div>
                      </div>
                      <p className="p-6 text-sm leading-relaxed text-slate-600 dark:text-slate-200/75">{item.description}</p>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </section>

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
                  <h2 id="cta-heading" className="mt-4 text-3xl font-semibold sm:text-4xl">
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
