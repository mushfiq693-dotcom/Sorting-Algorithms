import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Sorting Algorithm Visualizer — Interactive DSA Learning",
  description:
    "An interactive educational web app that teaches how sorting algorithms work internally with real-time visualization, synchronized C++ code highlighting, and complexity analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} font-sans bg-background text-foreground min-h-screen flex flex-col antialiased`}>
        {children}
      </body>
    </html>
  );
}
