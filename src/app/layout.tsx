import type { Metadata } from "next";
import { Poppins, Fira_Code } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gema-lms.vercel.app'),
  title: "GEMA (Generasi Muda Informatika) - LMS untuk Informatika SMA",
  description: "GEMA (Generasi Muda Informatika) adalah platform LMS modern untuk mata pelajaran Informatika SMA. Dilengkapi coding lab interaktif, tutorial terstruktur, quiz otomatis, dan sistem penilaian komprehensif untuk pembelajaran pemrograman yang efektif.",
  keywords: [
    "GEMA",
    "Generasi Muda Informatika",
    "LMS Informatika",
    "Learning Management System",
    "platform belajar coding",
    "LMS SMA",
    "coding lab interaktif",
    "tutorial pemrograman",
    "sistem penilaian otomatis",
    "belajar coding online",
    "platform edukasi teknologi",
    "LMS programming",
    "e-learning informatika",
    "coding education platform"
  ],
  authors: [{ name: "GEMA Development Team" }],
  creator: "GEMA - Learning Management System",
  publisher: "GEMA Platform",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://gema-lms.vercel.app",
    title: "GEMA - Learning Management System untuk Informatika SMA",
    description: "Platform LMS modern untuk pembelajaran Informatika dengan coding lab interaktif dan sistem penilaian otomatis",
    siteName: "GEMA LMS",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GEMA - Generasi Muda Informatika"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "GEMA - Learning Management System untuk Informatika SMA", 
    description: "Platform LMS modern untuk pembelajaran Informatika dengan coding lab interaktif dan sistem penilaian otomatis",
    images: ["/og-image.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: {
    google: "your-google-verification-code"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        {/* Preconnect to critical origins for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for potential third-party resources */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://picsum.photos" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/gema.svg" as="image" type="image/svg+xml" />
        
        {/* Prefetch likely next pages for faster navigation */}
        <link rel="prefetch" href="/student/login" />
        <link rel="prefetch" href="/student/register" />
        <link rel="prefetch" href="/contact" />
      </head>
      <body
        className={`${poppins.variable} ${firaCode.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
