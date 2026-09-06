import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../../../backend/client/server";

/**
 * PKCE Auth Callback Route Handler for Supabase Auth
 *
 * Exchanges the auth code from email confirmation or OAuth redirect for a persistent
 * session cookie and redirects user based on their PostgreSQL beta access status.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/learn";

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Special case: If user is completing a password reset flow, forward to reset-password page
        if (next === "/auth/reset-password" || next.startsWith("/auth/reset-password")) {
          return NextResponse.redirect(`${origin}/auth/reset-password`);
        }

        // Query PostgreSQL beta_access status for all normal sign-in / sign-up confirmation redirects
        const { data: betaAccess } = await (supabase.from("beta_access") as any)
          .select("status")
          .eq("user_id", user.id)
          .single();

        const status = betaAccess?.status || "pending";

        if (status === "suspended") {
          return NextResponse.redirect(`${origin}/auth/suspended`);
        }

        return NextResponse.redirect(`${origin}${next}`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error or login page with an error parameter
  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`);
}
