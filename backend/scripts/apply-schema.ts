import { Client } from "pg";

async function runMigration() {
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

  // Backfill registered users who registered before the trigger was created
  const authUsersRes = await client.query(`
    SELECT id, email, raw_user_meta_data FROM auth.users;
  `);

  console.log(`Found ${authUsersRes.rowCount} registered auth user(s).`);

  for (const user of authUsersRes.rows) {
    const fullName = user.raw_user_meta_data?.full_name || "";
    const dept = user.raw_user_meta_data?.department || "CSE";
    const studentId = user.raw_user_meta_data?.student_id || "";

    await client.query(
      `
      INSERT INTO public.profiles (id, email, full_name, department, student_id, role)
      VALUES ($1, $2, $3, $4, $5, 'student')
      ON CONFLICT (id) DO NOTHING;
    `,
      [user.id, user.email, fullName, dept, studentId]
    );

    await client.query(
      `
      INSERT INTO public.beta_access (user_id, status)
      VALUES ($1, 'pending')
      ON CONFLICT (user_id) DO NOTHING;
    `,
      [user.id]
    );

    await client.query(
      `
      INSERT INTO public.user_progress (user_id, completed_steps, completed_docs, quiz_scores)
      VALUES ($1, '[]'::jsonb, '[]'::jsonb, '{}'::jsonb)
      ON CONFLICT (user_id) DO NOTHING;
    `,
      [user.id]
    );

    console.log(`✓ Backfilled profile, beta_access, and progress for user: ${user.email}`);
  }

  // Check profiles
  const profiles = await client.query(`
    SELECT p.id, p.email, p.full_name, p.role, b.status 
    FROM public.profiles p
    LEFT JOIN public.beta_access b ON p.id = b.user_id;
  `);

  console.log("\n=========================================");
  console.log("  CURRENT USERS & BETA ACCESS IN CLOUD:  ");
  console.log("=========================================");
  profiles.rows.forEach((p) => {
    console.log(`  User: ${p.email} | Name: "${p.full_name}" | Role: ${p.role} | Status: ${p.status}`);
  });
  console.log("=========================================\n");

  await client.end();
}

runMigration().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
