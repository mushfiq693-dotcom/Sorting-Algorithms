import type { NextConfig } from "next";
import path from "node:path";

/**
 * Tailored Content Security Policy (CSP) for AlgoHub
 *
 * Directives:
 * - default-src 'self': Restrict all fallback resource loading to same origin.
 * - script-src 'self' 'unsafe-inline' 'unsafe-eval': Allows Next.js runtime, bundled scripts,
 *   and student code compilation (new Function) inside Web Worker scopes.
 * - style-src 'self' 'unsafe-inline': Allows Next.js bundled CSS & Tailwind / Framer Motion dynamic style calculations.
 * - img-src 'self' blob: data:: Allows SVG icons, local assets, Canvas Confetti particle canvases, and Blob images.
 * - font-src 'self' data:: Allows self-hosted Google Fonts (Outfit, JetBrains Mono) via next/font.
 * - connect-src 'self': Restricts data fetching to own origin.
 * - worker-src 'self' blob:: Explicitly allows dynamic Web Worker sandbox instantiated via inline Blob URLs.
 * - frame-ancestors 'none': Prevents clickjacking by forbidding embedding in iframes (modern equivalent of X-Frame-Options: DENY).
 * - object-src 'none': Disables legacy Flash/Java plugins.
 * - base-uri 'self': Prevents DOM base tag injection.
 * - form-action 'self': Restricts form submissions.
 */
const contentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self' data:;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co;
  worker-src 'self' blob:;
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
`
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(__dirname),
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "prismjs",
      "@supabase/ssr",
      "canvas-confetti",
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
