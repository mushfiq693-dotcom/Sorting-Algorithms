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
  openGraph: {
    title: "AlgoHub — Interactive Algorithm Learning Platform",
    description:
      "Don't just learn Algorithms. See them. Break them. Fix them. Master them.",
    type: "website",
    siteName: "AlgoHub",
  },
};

import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${outfit.variable} ${jetbrainsMono.variable} font-sans bg-[#050811] text-foreground min-h-screen flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200`}>
        {children}
        <FeedbackWidget />
      </body>
    </html>
  );
}
