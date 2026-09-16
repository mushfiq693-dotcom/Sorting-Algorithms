import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../../../../../backend/client/server";

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    // 1. Authenticate calling user
    const {
      data: { user: currentUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !currentUser) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to continue." },
        { status: 401 }
      );
    }

    // 2. Verify admin role in profiles
    const { data: profile, error: profileError } = await (supabase.from("profiles") as any)
      .select("role")
      .eq("id", currentUser.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Administrator privileges required." },
        { status: 403 }
      );
    }

    // 3. Parse request payload
    const body = await request.json();
    const { userId, status, notes } = body;

    if (!userId || !status) {
      return NextResponse.json(
        { error: "Bad Request: Missing userId or status in payload." },
        { status: 400 }
      );
    }

    const validStatuses = ["approved", "pending", "rejected", "suspended"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Bad Request: Invalid status '${status}'. Must be one of ${validStatuses.join(", ")}.` },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const isApproved = status === "approved";

    // 4. Upsert beta_access record
    const { data, error: upsertError } = await (supabase.from("beta_access") as any)
      .upsert(
        {
          user_id: userId,
          status,
          approved_by: isApproved ? currentUser.id : null,
          approved_at: isApproved ? now : null,
          notes: notes !== undefined ? notes : null,
          updated_at: now,
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (upsertError) {
      return NextResponse.json(
        { error: `Database error: ${upsertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
