import { Client } from "pg";

async function runPublicLaunchMigration() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("❌ Error: Missing DATABASE_URL environment variable.");
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("✓ Connected to Supabase PostgreSQL.");

  // 1. Update the handle_new_user trigger function
  await client.query(`
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    DECLARE
      v_full_name TEXT;
      v_department TEXT;
      v_student_id TEXT;
      v_avatar_url TEXT;
    BEGIN
      v_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        ''
      );
      v_department := COALESCE(NEW.raw_user_meta_data->>'department', 'General');
      v_student_id := COALESCE(NEW.raw_user_meta_data->>'student_id', '');
      v_avatar_url := COALESCE(
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'picture',
        ''
      );

      INSERT INTO public.profiles (
        id,
        email,
        full_name,
        department,
        student_id,
        avatar_url,
        role
      ) VALUES (
        NEW.id,
        NEW.email,
        v_full_name,
        v_department,
        v_student_id,
        v_avatar_url,
        'student'
      ) ON CONFLICT (id) DO UPDATE SET
        full_name = CASE WHEN profiles.full_name IS NULL OR profiles.full_name = '' THEN EXCLUDED.full_name ELSE profiles.full_name END,
        avatar_url = CASE WHEN profiles.avatar_url IS NULL OR profiles.avatar_url = '' THEN EXCLUDED.avatar_url ELSE profiles.avatar_url END;

      INSERT INTO public.beta_access (
        user_id,
        status,
        approved_at,
        notes
      ) VALUES (
        NEW.id,
        'approved',
        timezone('utc'::text, now()),
        'Public Launch Auto-Approved'
      ) ON CONFLICT (user_id) DO UPDATE SET
        status = 'approved',
        approved_at = COALESCE(beta_access.approved_at, timezone('utc'::text, now()));

      INSERT INTO public.user_progress (
        user_id,
        completed_steps,
        completed_docs,
        quiz_scores
      ) VALUES (
        NEW.id,
        '[]'::jsonb,
        '[]'::jsonb,
        '{}'::jsonb
      ) ON CONFLICT (user_id) DO NOTHING;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
  `);
  console.log("✓ Updated handle_new_user() trigger function in PostgreSQL.");

  // 2. Auto-approve all existing users in beta_access (except suspended)
  const updateRes = await client.query(`
    UPDATE public.beta_access
    SET status = 'approved',
        approved_at = COALESCE(approved_at, timezone('utc'::text, now())),
        notes = COALESCE(notes, 'Public Launch Auto-Approved')
    WHERE status != 'suspended';
  `);
  console.log(`✓ Updated ${updateRes.rowCount} user(s) in beta_access to 'approved'.`);

  // 3. Print all users and their status
  const profiles = await client.query(`
    SELECT p.id, p.email, p.full_name, p.role, b.status 
    FROM public.profiles p
    LEFT JOIN public.beta_access b ON p.id = b.user_id;
  `);

  console.log("\n=========================================");
  console.log("  ALL USERS AFTER PUBLIC LAUNCH UPDATE:  ");
  console.log("=========================================");
  profiles.rows.forEach((p) => {
    console.log(`  User: ${p.email} | Name: "${p.full_name}" | Role: ${p.role} | Status: ${p.status}`);
  });
  console.log("=========================================\n");

  await client.end();
}

runPublicLaunchMigration().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
