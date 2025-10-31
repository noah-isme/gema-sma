"use client";

import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";

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

interface ActivitiesSectionProps {
  activities: Activity[];
  loading: boolean;
}

export function ActivitiesSection({ activities, loading }: ActivitiesSectionProps) {
  return (
    <section
      id="activities"
      data-reveal
      className="relative z-10 px-6 py-16 sm:px-10 md:py-24"
      aria-labelledby="activities-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2
            id="activities-heading"
            className="inline-block bg-gradient-to-r from-[#6C63FF] to-[#5EEAD4] bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl"
          >
            Kegiatan Terkini
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-200/80">
            Ikuti berbagai kegiatan seru dan edukatif yang dirancang khusus untuk mengembangkan skill
            teknologi kamu!
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-live="polite">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-block h-64 w-full animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {activities.slice(0, 6).map((activity) => (
              <article
                key={activity.id}
                className="interactive-card group rounded-2xl border border-white/10 bg-white/90 p-6 shadow-lg backdrop-blur transition-colors duration-500 dark:bg-white/5"
                role="listitem"
              >
                <div className="mb-3 inline-flex rounded-xl bg-gradient-to-br from-[#6C63FF]/20 to-[#5EEAD4]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#6C63FF] dark:text-[#5EEAD4]">
                  {activity.category}
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                  {activity.title}
                </h3>
                <p className="mb-4 text-sm text-slate-600 dark:text-slate-200/80">
                  {activity.description.substring(0, 100)}
                  {activity.description.length > 100 ? "..." : ""}
                </p>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-200/70">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    <time dateTime={activity.date}>
                      {new Date(activity.date).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      · {activity.time}
                    </time>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    <span>{activity.location}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span>
                      {activity.participants}/{activity.capacity} peserta
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 mx-3">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#5EEAD4]"
                        style={{
                          width: `${Math.min((activity.participants / activity.capacity) * 100, 100)}%`,
                        }}
                        aria-label={`${Math.round((activity.participants / activity.capacity) * 100)}% terisi`}
                      />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/90 p-12 text-center backdrop-blur dark:bg-white/5">
            <p className="text-slate-600 dark:text-slate-200/80">
              Belum ada kegiatan yang tersedia saat ini. Pantau terus update terbaru!
            </p>
          </div>
        )}

        {activities.length > 6 && (
          <div className="mt-10 text-center">
            <Link
              href="/activities"
              className="interactive-button inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#5EEAD4] px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl"
            >
              Lihat Semua Kegiatan
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
