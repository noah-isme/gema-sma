import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengumuman GEMA - SMA Wahidiyah Kediri",
  description:
    "Tetap update dengan pengumuman terbaru GEMA! Event, tugas, nilai, dan informasi penting lainnya untuk siswa SMA Wahidiyah Kediri.",
  keywords: [
    "pengumuman GEMA",
    "SMA Wahidiyah",
    "event sekolah",
    "tugas",
    "nilai",
    "informasi siswa",
  ],
  openGraph: {
    title: "Pengumuman GEMA - SMA Wahidiyah Kediri",
    description:
      "Tetap update dengan pengumuman terbaru! Event, tugas, nilai, dan informasi penting lainnya.",
    type: "website",
  },
};

export default function AnnouncementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
