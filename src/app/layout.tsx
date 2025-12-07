import type { Metadata } from "next";
import { Outfit, Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Display Font - Bold & Playful untuk Headlines
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

// Body Font - Clean & Readable untuk Content
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// Code Font - Monospace untuk Code Snippets
const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gema-sma.tech'),
  title: {
    default: "GEMA - Generasi Muda Informatika | Platform LMS untuk SMA",
    template: "%s | GEMA LMS"
  },
  description: "Platform Learning Management System (LMS) modern untuk pembelajaran Informatika SMA di seluruh Indonesia. Dilengkapi coding lab interaktif, tutorial terstruktur, quiz otomatis, dan sistem penilaian komprehensif untuk pembelajaran pemrograman yang efektif.",
  applicationName: "GEMA LMS",
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
    "coding education platform",
    "pendidikan informatika Indonesia",
    "belajar pemrograman SMA"
  ],
  authors: [
    { name: "GEMA Development Team" }
  ],
  creator: "GEMA - Learning Management System",
  publisher: "GEMA Platform",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://gema-sma.tech",
    title: "GEMA - Platform LMS Informatika untuk Seluruh SMA",
    description: "Platform Learning Management System modern untuk pembelajaran Informatika dengan coding lab interaktif, tutorial terstruktur, quiz otomatis, dan sistem penilaian komprehensif. Untuk semua SMA di Indonesia.",
    siteName: "GEMA LMS",
    images: [
      {
        url: "/gema.svg",
        width: 1200,
        height: 630,
        alt: "GEMA - Generasi Muda Informatika"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "GEMA - Platform LMS Informatika untuk Seluruh SMA", 
    description: "Platform LMS modern untuk pembelajaran Informatika dengan coding lab interaktif, tutorial terstruktur, dan sistem penilaian otomatis untuk seluruh SMA di Indonesia.",
    images: ["/gema.svg"]
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
  },
  category: "Education",
  alternates: {
    canonical: "https://gema-sma.tech",
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/favicon.ico'
  },
  manifest: '/manifest.json'
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
        
        {/* Lottie Web Component */}
        <script src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.5/dist/dotlottie-wc.js" type="module" async></script>
        
        {/* Preload critical assets */}
        <link rel="preload" href="/gema.svg" as="image" type="image/svg+xml" />
        
        {/* Prefetch likely next pages for faster navigation */}
        <link rel="prefetch" href="/student/login" />
        <link rel="prefetch" href="/student/register" />
        <link rel="prefetch" href="/contact" />
      </head>
      <body
        className={`${outfit.variable} ${inter.variable} ${firaCode.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
