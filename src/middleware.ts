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
    "/admin/:path*",
    "/mentor/:path*",
    "/dashboard/:path*",
    "/notifications/:path*",
    "/auth/:path*",
  ],
};
