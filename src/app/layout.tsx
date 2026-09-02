import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import { DeveloperCredit } from "@/components/brand/DeveloperCredit";
import { AtmosphericOverlay } from "@/components/ui/AtmosphericOverlay";

// 1. Heading Font: Cormorant Garamond 600 (High-contrast serif for hero & headings)
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// 2. Sans & Body Font: Manrope (Clean geometric sans for UI, subtitle, buttons, badges, & body)
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

// 3. Monospace Font: JetBrains Mono (For code blocks & algorithms)
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://algo-hub-eight.vercel.app"
  ),
  title: "AlgoHub — Interactive Algorithm Learning Platform",
  description:
    "Interactive algorithm learning platform with real-time visualization, code execution, debugging, and hands-on practice.",
  keywords: [
    "algorithm visualizer",
    "data structures and algorithms",
    "sorting algorithms",
    "interactive DSA learning",
    "algorithm debugger",
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
    title: "AlgoHub — Interactive Algorithm Learning Platform",
    description:
      "Don't just learn Algorithms. See them. Break them. Fix them. Master them.",
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
        className={`${cormorantGaramond.variable} ${manrope.variable} ${jetbrainsMono.variable} font-sans font-normal bg-background text-foreground min-h-screen flex flex-col antialiased selection:bg-[#C9A962]/35 selection:text-[#1C1714]`}
      >
        <AtmosphericOverlay />
        {children}
        <DeveloperCredit />
        <FeedbackWidget />
      </body>
    </html>
  );
}
