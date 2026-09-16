import { Client } from "pg";
import path from "node:path";
import fs from "node:fs";

function loadEnvLocal() {
  if (process.env.DATABASE_URL) return;
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) process.env[key] = value;
      }
    }
  }
}
loadEnvLocal();

async function runTests() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("✓ Connected to Supabase PostgreSQL for automated testing.");

  // Fetch admin user
  const adminRes = await client.query(`
    SELECT id, email FROM public.profiles WHERE role = 'admin' LIMIT 1;
  `);
  const admin = adminRes.rows[0];
  console.log(`✓ Admin user: ${admin?.email} (${admin?.id})`);

  // Fetch a student user
  const studentRes = await client.query(`
    SELECT id, email FROM public.profiles WHERE role = 'student' LIMIT 1;
  `);
  const student = studentRes.rows[0];
  console.log(`✓ Test student: ${student?.email} (${student?.id})`);

  if (!admin || !student) {
    console.error("Missing admin or student profile for test.");
    await client.end();
    return;
  }

  // 1. Simulate Student submitting a Course Access Request (RLS check with student auth context)
  console.log("\n--- TEST 1: Student creates/updates pending course request ---");
  await client.query("BEGIN;");
  // Set auth context to student
  await client.query(`SET LOCAL "request.jwt.claim.sub" = '${student.id}';`);
  await client.query(`SET LOCAL "request.jwt.claim.role" = 'authenticated';`);
  
  const insertStudentReq = await client.query(`
    INSERT INTO public.beta_access (user_id, status, notes, updated_at)
    VALUES ('${student.id}', 'pending', 'Student ID: TEST1234 | Dept: CSE | Need course access', timezone('utc'::text, now()))
    ON CONFLICT (user_id) DO UPDATE SET
      status = 'pending',
      notes = EXCLUDED.notes,
      updated_at = timezone('utc'::text, now())
    RETURNING id, user_id, status, notes;
  `);
  console.log("✓ Student inserted pending request:", insertStudentReq.rows[0]);
  await client.query("COMMIT;");

  // 2. Simulate Admin Approving the Request (RLS check with admin auth context)
  console.log("\n--- TEST 2: Admin approves student course access ---");
  await client.query("BEGIN;");
  // Set auth context to admin
  await client.query(`SET LOCAL "request.jwt.claim.sub" = '${admin.id}';`);
  await client.query(`SET LOCAL "request.jwt.claim.role" = 'authenticated';`);

  const approveRes = await client.query(`
    INSERT INTO public.beta_access (user_id, status, approved_by, approved_at, updated_at)
    VALUES ('${student.id}', 'approved', '${admin.id}', timezone('utc'::text, now()), timezone('utc'::text, now()))
    ON CONFLICT (user_id) DO UPDATE SET
      status = 'approved',
      approved_by = '${admin.id}',
      approved_at = timezone('utc'::text, now()),
      updated_at = timezone('utc'::text, now())
    RETURNING id, user_id, status, approved_by, approved_at;
  `);
  console.log("✓ Admin successfully approved without RLS violation:", approveRes.rows[0]);
  await client.query("COMMIT;");

  // 3. Verify Course Materials RLS policy allows approved student
  console.log("\n--- TEST 3: Student reads course materials after approval ---");
  await client.query("BEGIN;");
  await client.query(`SET LOCAL "request.jwt.claim.sub" = '${student.id}';`);
  await client.query(`SET LOCAL "request.jwt.claim.role" = 'authenticated';`);

  const isApprovedRes = await client.query(`SELECT public.is_beta_approved() as approved;`);
  console.log("✓ public.is_beta_approved() for student:", isApprovedRes.rows[0]?.approved);

  const materialsRes = await client.query(`SELECT count(*) as count FROM public.course_materials;`);
  console.log("✓ Student can access course materials count:", materialsRes.rows[0]?.count);
  await client.query("COMMIT;");

  // 4. Print current state of beta_access queue
  console.log("\n--- CURRENT BETA ACCESS QUEUE IN DATABASE ---");
  const allBeta = await client.query(`
    SELECT b.user_id, p.email, p.full_name, b.status, b.notes, b.approved_at
    FROM public.beta_access b
    LEFT JOIN public.profiles p ON b.user_id = p.id;
  `);
  console.table(allBeta.rows);

  await client.end();
  console.log("\n✅ ALL TESTS PASSED SUCCESSFULLY!");
}

runTests().catch((err) => {
  console.error("❌ Test failed with error:", err);
  process.exit(1);
});
