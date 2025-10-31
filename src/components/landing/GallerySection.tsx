"use client";

import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: string;
  description: string;
}

interface GallerySectionProps {
  gallery: GalleryItem[];
  loading: boolean;
}

export function GallerySection({ gallery, loading }: GallerySectionProps) {
  return (
    <section
      id="gallery"
      data-reveal
      className="relative z-10 px-6 py-16 sm:px-10 md:py-24"
      aria-labelledby="gallery-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2
            id="gallery-heading"
            className="inline-block bg-gradient-to-r from-[#6C63FF] to-[#5EEAD4] bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl"
          >
            Galeri Kegiatan
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-200/80">
            Lihat momen-momen seru dari berbagai kegiatan dan project yang telah kami lakukan.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-live="polite">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton-block aspect-[4/3] w-full animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : gallery.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {gallery.slice(0, 6).map((item) => (
              <article
                key={item.id}
                className="interactive-card group relative overflow-hidden rounded-2xl"
                role="listitem"
              >
                <div className="aspect-[4/3]">
                  <OptimizedImage
                    src={item.image}
                    alt={item.description || item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="mb-2 inline-block rounded-lg bg-gradient-to-br from-[#6C63FF]/90 to-[#5EEAD4]/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    {item.description && (
                      <p className="mt-2 text-sm text-white/90">{item.description}</p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/90 p-12 text-center backdrop-blur dark:bg-white/5">
            <p className="text-slate-600 dark:text-slate-200/80">
              Galeri sedang dalam pengembangan. Segera hadir dengan dokumentasi kegiatan terbaru!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
