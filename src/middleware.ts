import { type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

/**
 * Next.js Edge Middleware for AlgoHub
 *
 * Intercepts requests to refresh Supabase Auth session tokens and protect
 * interactive learning routes (/learn, /algorithms/*, /compare, /docs/*).
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
