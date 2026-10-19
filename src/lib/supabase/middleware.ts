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

  // List of public routes that bypass authentication
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/public") ||
    pathname.startsWith("/visualizer") ||
    pathname.startsWith("/compare") ||
    pathname.startsWith("/docs") ||
    pathname.startsWith("/learn") ||
    pathname.startsWith("/algorithms") ||
    pathname.startsWith("/course-material") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".");

  // Check if any Supabase auth cookies exist in request
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(
    (cookie) =>
      cookie.name.includes("auth-token") ||
      cookie.name.startsWith("sb-")
  );

  // FAST PATH: All public routes (except /auth/login where authenticated users might need redirect)
  // return immediately without blocking on remote auth network roundtrips.
  if (isPublicRoute && pathname !== "/auth/login") {
    return supabaseResponse;
  }

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

  // Helper to ensure network calls never block edge execution if Supabase is slow or unreachable
  const withTimeout = async <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
    let timer: NodeJS.Timeout | undefined;
    const timeoutPromise = new Promise<T>((resolve) => {
      timer = setTimeout(() => resolve(fallback), ms);
    });
    try {
      return await Promise.race([promise, timeoutPromise]);
    } catch {
      return fallback;
    } finally {
      if (timer) clearTimeout(timer);
    }
  };

  // Only authenticate via network when auth cookies are present and route requires check
  const {
    data: { user },
  } = await withTimeout(
    supabase.auth.getUser(),
    800,
    { data: { user: null } } as any
  );

  // If user is unauthenticated (token invalid/expired/timed out) and attempting to access protected routes
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // If accessing /admin routes, verify user is an Administrator
  if (user && pathname.startsWith("/admin")) {
    const { data: profile } = await withTimeout(
      (supabase.from("profiles") as any)
        .select("role")
        .eq("id", user.id)
        .maybeSingle(),
      800,
      { data: null as any }
    );

    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // If accessing /mentor routes, verify user is a Mentor or Admin
  if (user && pathname.startsWith("/mentor")) {
    const { data: profile } = await withTimeout(
      (supabase.from("profiles") as any)
        .select("role")
        .eq("id", user.id)
        .maybeSingle(),
      800,
      { data: null as any }
    );

    if (profile?.role !== "mentor" && profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // If user is suspended by admin, redirect to suspended notice
  if (user && !isPublicRoute && !pathname.startsWith("/admin")) {
    const { data: betaAccess } = await withTimeout(
      (supabase.from("beta_access") as any)
        .select("status")
        .eq("user_id", user.id)
        .maybeSingle(),
      800,
      { data: null as any }
    );

    if (betaAccess?.status === "suspended" && pathname !== "/auth/suspended") {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/suspended";
      return NextResponse.redirect(url);
    }
  }

  // If user is already authenticated and visits /auth/login, redirect to next param or /
  if (user && pathname === "/auth/login") {
    const rawNext = request.nextUrl.searchParams.get("next") || "/";
    const safeNext =
      rawNext.startsWith("/") && !rawNext.startsWith("//") && !rawNext.includes("\\")
        ? rawNext
        : "/";
    const url = request.nextUrl.clone();
    url.pathname = safeNext;
    url.searchParams.delete("next");
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
