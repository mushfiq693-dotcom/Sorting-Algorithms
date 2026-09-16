import { Client } from "pg";
import * as fs from "fs";
import * as path from "path";

// Load .env.local manually if not in process.env
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim();
        process.env[key] = value;
      }
    }
  }
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("Missing DATABASE_URL");
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("=== CONNECTED TO LIVE SUPABASE POSTGRESQL ===");

  // 1. Apply Migration 008 to live database
  const migration008Path = path.resolve(__dirname, "../database/migrations/008_performance_and_scalability_indexes.sql");
  if (fs.existsSync(migration008Path)) {
    const sql = fs.readFileSync(migration008Path, "utf-8");
    console.log("\n--- Applying Migration 008 to Live DB ---");
    await client.query(sql);
    console.log("✓ Migration 008 applied successfully.");
  }

  // 2. Fetch live pg_indexes
  console.log("\n=== LIVE DATABASE INDEXES (pg_indexes) ===");
  const indexRes = await client.query(`
    SELECT tablename, indexname, indexdef 
    FROM pg_indexes 
    WHERE schemaname = 'public' 
    ORDER BY tablename, indexname;
  `);

  console.log(JSON.stringify(indexRes.rows, null, 2));

  // 3. Get a real user_id from profiles for realistic EXPLAIN ANALYZE
  const userRes = await client.query(`SELECT id FROM public.profiles LIMIT 1;`);
  const sampleUserId = userRes.rows[0]?.id || "00000000-0000-0000-0000-000000000000";

  console.log(`\n=== EXPLAIN ANALYZE QUERIES (Sample User: ${sampleUserId}) ===`);

  // Query 1: Dashboard Profile & Progress Fetch
  console.log("\n--- [Query 1] Dashboard Fetch (profiles + user_progress) ---");
  const q1 = await client.query(`
    EXPLAIN (ANALYZE, BUFFERS)
    SELECT p.id, p.email, p.role, up.completed_steps, up.completed_docs, up.topic_scores
    FROM public.profiles p
    LEFT JOIN public.user_progress up ON p.id = up.user_id
    WHERE p.id = $1;
  `, [sampleUserId]);
  console.log(q1.rows.map(r => r["QUERY PLAN"]).join("\n"));

  // Query 2: Mentor Queue Fetch
  console.log("\n--- [Query 2] Mentor Queue Fetch (mentor_applications status='pending') ---");
  const q2 = await client.query(`
    EXPLAIN (ANALYZE, BUFFERS)
    SELECT id, user_id, reason, status, created_at
    FROM public.mentor_applications
    WHERE status = 'pending'
    ORDER BY created_at DESC;
  `);
  console.log(q2.rows.map(r => r["QUERY PLAN"]).join("\n"));

  // Query 3: Notice Unread Count / Delivery
  console.log("\n--- [Query 3] Notice Unread Delivery (notices + notice_reads) ---");
  const q3 = await client.query(`
    EXPLAIN (ANALYZE, BUFFERS)
    SELECT n.id, n.title, n.message, n.created_at
    FROM public.notices n
    LEFT JOIN public.notice_reads nr ON n.id = nr.notice_id AND nr.user_id = $1
    WHERE nr.id IS NULL
    ORDER BY n.created_at DESC;
  `, [sampleUserId]);
  console.log(q3.rows.map(r => r["QUERY PLAN"]).join("\n"));

  // Query 4: Course Materials Filtered Load
  console.log("\n--- [Query 4] Course Materials Filtered Load (content_type='topic' & topic_tag='linked-list') ---");
  const q4 = await client.query(`
    EXPLAIN (ANALYZE, BUFFERS)
    SELECT id, title, book_reference, topic_tag, difficulty, assigned_date
    FROM public.course_materials
    WHERE content_type = 'topic' AND topic_tag = 'linked-list'
    ORDER BY assigned_date DESC NULLS LAST;
  `);
  console.log(q4.rows.map(r => r["QUERY PLAN"]).join("\n"));

  // Query 5: Beta Access Status Verification (Edge Middleware Check)
  console.log("\n--- [Query 5] Beta Access Fast Auth Check (beta_access user_id=$1 AND status='approved') ---");
  const q5 = await client.query(`
    EXPLAIN (ANALYZE, BUFFERS)
    SELECT id, user_id, status
    FROM public.beta_access
    WHERE user_id = $1 AND status = 'approved';
  `, [sampleUserId]);
  console.log(q5.rows.map(r => r["QUERY PLAN"]).join("\n"));

  // Query 6: Progress Sync Upsert Simulation
  console.log("\n--- [Query 6] Progress Sync Upsert (user_progress single row update) ---");
  const q6 = await client.query(`
    EXPLAIN (ANALYZE, BUFFERS)
    INSERT INTO public.user_progress (user_id, completed_steps, last_active_at)
    VALUES ($1, '["bubble-practice"]'::jsonb, now())
    ON CONFLICT (user_id) DO UPDATE 
    SET completed_steps = EXCLUDED.completed_steps, last_active_at = EXCLUDED.last_active_at;
  `, [sampleUserId]);
  console.log(q6.rows.map(r => r["QUERY PLAN"]).join("\n"));

  // Check Table Row Counts
  console.log("\n=== LIVE TABLE ROW COUNTS ===");
  const tables = ['profiles', 'beta_access', 'mentor_applications', 'notices', 'notice_reads', 'user_progress', 'feedback', 'bug_reports', 'course_materials'];
  for (const t of tables) {
    const c = await client.query(`SELECT count(*) FROM public.${t};`);
    console.log(`Table ${t.padEnd(22)}: ${c.rows[0].count} rows`);
  }

  await client.end();
}

main().catch(err => {
  console.error("Live DB Audit failed:", err);
  process.exit(1);
});
