"use client";

import { Megaphone, ChevronRight } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  publishedAt: string;
}

interface AnnouncementsSectionProps {
  announcements: Announcement[];
  loading: boolean;
}

export function AnnouncementsSection({ announcements, loading }: AnnouncementsSectionProps) {
  const getAnnouncementTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "urgent":
      case "penting":
        return "from-red-500/20 to-orange-500/10 text-red-600 dark:text-red-400";
      case "info":
      case "informasi":
        return "from-blue-500/20 to-cyan-500/10 text-blue-600 dark:text-blue-400";
      case "event":
      case "acara":
        return "from-purple-500/20 to-pink-500/10 text-purple-600 dark:text-purple-400";
      default:
        return "from-[#6C63FF]/20 to-[#5EEAD4]/10 text-[#6C63FF] dark:text-[#5EEAD4]";
    }
  };

  return (
    <section
      id="announcements"
      data-reveal
      className="relative z-10 px-6 py-16 sm:px-10 md:py-24"
      aria-labelledby="announcements-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2
            id="announcements-heading"
            className="inline-block bg-gradient-to-r from-[#6C63FF] to-[#5EEAD4] bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl"
          >
            Pengumuman
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-200/80">
            Tetap update dengan informasi terkini seputar GEMA dan kegiatan-kegiatan mendatang.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4" aria-busy="true" aria-live="polite">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-block h-32 w-full animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : announcements.length > 0 ? (
          <div className="space-y-4" role="list">
            {announcements.slice(0, 5).map((announcement) => (
              <article
                key={announcement.id}
                className="interactive-card group rounded-2xl border border-white/10 bg-white/90 p-6 shadow-lg backdrop-blur transition-colors duration-500 dark:bg-white/5"
                role="listitem"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6C63FF]/20 to-[#5EEAD4]/10">
                    <Megaphone className="h-6 w-6 text-[#6C63FF] dark:text-[#5EEAD4]" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-lg bg-gradient-to-br px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${getAnnouncementTypeColor(announcement.type)}`}
                      >
                        {announcement.type}
                      </span>
                      <time
                        dateTime={announcement.publishedAt}
                        className="text-xs text-slate-500 dark:text-slate-200/60"
                      >
                        {new Date(announcement.publishedAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-200/80">
                      {announcement.content.substring(0, 200)}
                      {announcement.content.length > 200 ? "..." : ""}
                    </p>
                    <button
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#6C63FF] transition-colors hover:text-[#5EEAD4] dark:text-[#5EEAD4] dark:hover:text-[#6C63FF]"
                      aria-label={`Baca selengkapnya tentang ${announcement.title}`}
                    >
                      Baca selengkapnya
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/90 p-12 text-center backdrop-blur dark:bg-white/5">
            <p className="text-slate-600 dark:text-slate-200/80">
              Belum ada pengumuman terbaru. Cek kembali nanti!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
