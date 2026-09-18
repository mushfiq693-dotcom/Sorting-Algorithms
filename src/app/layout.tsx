import type { Metadata, Viewport } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import { DeveloperCredit } from "@/components/brand/DeveloperCredit";
import { AtmosphericOverlay } from "@/components/ui/AtmosphericOverlay";
import { UserPresenceTracker } from "@/components/telemetry/UserPresenceTracker";

// 1. Primary & Heading Font: Outfit
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// 2. Monospace Font: JetBrains Mono
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1C1714" },
    { media: "(prefers-color-scheme: light)", color: "#FAF6F0" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://algo-hub-eight.vercel.app"
  ),
  title: "AlgoHub — Interactive Data Structures & Algorithms (DSA) Learning Platform",
  description:
    "Master Data Structures & Algorithms (DSA) with real-time interactive visualizers, step-by-step memory tracers (Linked Lists, Stacks, Arrays), C++ debugging, Bengali explanations, and textbook problem solutions.",
  keywords: [
    "data structures visualizer",
    "algorithm visualizer",
    "data structures and algorithms",
    "sorting algorithms",
    "interactive DSA learning",
    "linked list visualizer",
    "stack visualizer",
    "binary search simulator",
    "algorithm debugger",
    "DSA in Bangla",
    "Lipschutz data structures solutions",
    "AlgoHub",
  ],
  authors: [{ name: "AlgoHub Team" }],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "AlgoHub — Interactive Data Structures & Algorithms (DSA) Learning Platform",
    description:
      "Don't just memorize DSA codes. See them. Break them. Fix them. Master them.",
    type: "website",
    siteName: "AlgoHub",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "AlgoHub Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('algohub_theme');
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} font-sans font-normal bg-background text-foreground min-h-screen flex flex-col antialiased selection:bg-[#C9A962]/35 selection:text-[#1C1714]`}
      >
        <AtmosphericOverlay />
        <UserPresenceTracker />
        {children}
        <DeveloperCredit />
        <FeedbackWidget />
      </body>
    </html>
  );
}
