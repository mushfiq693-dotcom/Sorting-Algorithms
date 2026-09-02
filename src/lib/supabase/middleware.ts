import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Database } from "../../../backend/database/types/database.types";

/**
 * Updates user session on incoming Edge requests and enforces Beta Access Rules.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const pathname = request.nextUrl.pathname;

  // List of public routes that bypass authentication (Public Recruiter Sandbox Mode)
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/learn" ||
    pathname.startsWith("/algorithms") ||
    pathname.startsWith("/compare") ||
    pathname.startsWith("/docs") ||
    pathname.startsWith("/visualizer") ||
    pathname.startsWith("/course-material") ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/public") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".");

  // Check if any Supabase auth cookies exist in request
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(
    (cookie) =>
      cookie.name.includes("auth-token") ||
      cookie.name.startsWith("sb-")
  );

  // FAST PATH: If no auth cookies exist
  if (!hasAuthCookie) {
    if (isPublicRoute) {
      return supabaseResponse;
    }
    // If not a public route and no cookies, redirect immediately without remote network roundtrip
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Only authenticate via network when auth cookies are present
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is unauthenticated (token invalid/expired) and attempting to access protected routes
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // If accessing /admin routes, verify user is an Administrator
  if (user && pathname.startsWith("/admin")) {
    const { data: profile } = await (supabase.from("profiles") as any)
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // If accessing /mentor routes, verify user is a Mentor or Admin
  if (user && pathname.startsWith("/mentor")) {
    const { data: profile } = await (supabase.from("profiles") as any)
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "mentor" && profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // If user is authenticated, check their Beta Access status in PostgreSQL
  if (user && !isPublicRoute && !pathname.startsWith("/admin")) {
    const { data: betaAccess } = await (supabase.from("beta_access") as any)
      .select("status")
      .eq("user_id", user.id)
      .single();

    const status = betaAccess?.status || "pending";

    if (status === "pending" && pathname !== "/auth/pending") {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/pending";
      return NextResponse.redirect(url);
    }

    if (status === "rejected" && pathname !== "/auth/rejected") {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/rejected";
      return NextResponse.redirect(url);
    }

    if (status === "suspended" && pathname !== "/auth/suspended") {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/suspended";
      return NextResponse.redirect(url);
    }
  }

  // If user is already authenticated & approved, and visits /auth/login, redirect to /learn
  if (user && pathname === "/auth/login") {
    const { data: betaAccess } = await (supabase.from("beta_access") as any)
      .select("status")
      .eq("user_id", user.id)
      .single();

    if (betaAccess?.status === "approved") {
      const url = request.nextUrl.clone();
      url.pathname = "/learn";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
