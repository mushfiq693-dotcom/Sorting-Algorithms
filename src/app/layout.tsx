import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://algo-hub-eight.vercel.app"
  ),
  title: "AlgoHub — Interactive Algorithm Learning Platform",
  description:
    "Learn algorithms step by step through interactive visualization, code execution, debugging, comparison, and hands-on practice.",
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

import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import { DeveloperCredit } from "@/components/brand/DeveloperCredit";

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
      <body className={`${outfit.variable} ${jetbrainsMono.variable} font-sans bg-background dark:bg-[#050811] text-foreground min-h-screen flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200`}>
        {children}
        <DeveloperCredit />
        <FeedbackWidget />
      </body>
    </html>
  );
}
