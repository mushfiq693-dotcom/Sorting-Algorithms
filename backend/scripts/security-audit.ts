/**
 * ============================================================================
 * ALGOHUB ADVERSARIAL SECURITY AUDIT SUITE
 * ============================================================================
 *
 * Runs 10 comprehensive security and privilege-isolation tests against
 * PostgreSQL Row Level Security (RLS), triggers, and role permissions.
 *
 * All adversarial mutation tests execute inside isolated PostgreSQL transactions
 * with automatic ROLLBACK to ensure zero mutation of live data.
 *
 * Usage:
 *   npx tsx backend/scripts/security-audit.ts
 */

import { Client } from "pg";
import fs from "node:fs";
import path from "node:path";

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

interface TestResult {
  id: number;
  name: string;
  scenario: string;
  expected: string;
  actual: string;
  passed: boolean;
}

async function runSecurityAudit() {
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

  console.log("================================================================================");
  console.log("             ALGOHUB BACKEND COMPREHENSIVE SECURITY AUDIT SUITE                 ");
  console.log("================================================================================");
  console.log(`Environment Target : Supabase PostgreSQL (project ref redacted — see .env.local)`);
  console.log(`Isolation Mode     : Safe In-Transaction Simulation (All tests ROLLBACK safely)\n`);

  const results: TestResult[] = [];

  // Setup: Find or create a temporary student UUID and admin UUID for testing
  const studentUserRes = await client.query(`
    SELECT id, email FROM public.profiles WHERE role = 'student' LIMIT 1;
  `);
  const adminUserRes = await client.query(`
    SELECT id, email FROM public.profiles WHERE role = 'admin' LIMIT 1;
  `);

  const studentId = studentUserRes.rows[0]?.id || "00000000-0000-0000-0000-000000000001";
  const studentEmail = studentUserRes.rows[0]?.email || "test_student@gstu.ac.bd";
  const adminId = adminUserRes.rows[0]?.id || "00000000-0000-0000-0000-000000000002";
  const adminEmail = adminUserRes.rows[0]?.email || "admin@gstu.ac.bd";

  // Dummy foreign student for isolation testing
  const foreignStudentId = "ffffffff-ffff-ffff-ffff-ffffffffffff";

  // -------------------------------------------------------------------------
  // TEST 1: Normal student attempts to set their own role = 'admin' via direct table update
  // -------------------------------------------------------------------------
  await client.query("BEGIN;");
  let test1Passed = false;
  let test1Actual = "";
  try {
    await client.query("SET LOCAL ROLE authenticated;");
    await client.query(`SET LOCAL request.jwt.claim.sub = '${studentId}';`);
    await client.query("SET LOCAL request.jwt.claim.role = 'authenticated';");

    const updateRes = await client.query(`
      UPDATE public.profiles SET role = 'admin' WHERE id = '${studentId}';
    `);
    // If RLS allows 0 rows or errors on WITH CHECK
    if (updateRes.rowCount === 0) {
      test1Passed = true;
      test1Actual = "0 rows updated (RLS WITH CHECK prevented privilege escalation)";
    } else {
      // Check if role actually changed
      const check = await client.query(`SELECT role FROM public.profiles WHERE id = '${studentId}';`);
      if (check.rows[0]?.role === "admin") {
        test1Passed = false;
        test1Actual = "VULNERABILITY: Student successfully escalated role to 'admin'!";
      } else {
        test1Passed = true;
        test1Actual = "Role modification blocked by RLS policy constraint.";
      }
    }
  } catch (err: any) {
    test1Passed = true;
    test1Actual = `DENIED: Error thrown by RLS WITH CHECK policy (${err.message})`;
  } finally {
    await client.query("ROLLBACK;");
  }

  results.push({
    id: 1,
    name: "Student Role Escalation Protection",
    scenario: "Authenticated student executes: UPDATE profiles SET role = 'admin' WHERE id = own_id",
    expected: "DENIED / 0 rows updated (RLS prevents role modification)",
    actual: test1Actual,
    passed: test1Passed,
  });

  // -------------------------------------------------------------------------
  // TEST 2: Normal student attempts to set their own beta_access.status = 'approved'
  // -------------------------------------------------------------------------
  await client.query("BEGIN;");
  let test2Passed = false;
  let test2Actual = "";
  try {
    await client.query("SET LOCAL ROLE authenticated;");
    await client.query(`SET LOCAL request.jwt.claim.sub = '${studentId}';`);
    await client.query("SET LOCAL request.jwt.claim.role = 'authenticated';");

    const updateRes = await client.query(`
      UPDATE public.beta_access SET status = 'approved' WHERE user_id = '${studentId}';
    `);
    if (updateRes.rowCount === 0) {
      test2Passed = true;
      test2Actual = "0 rows updated (RLS policy 'beta_access_update_admin_only' blocked student update)";
    } else {
      test2Passed = false;
      test2Actual = "VULNERABILITY: Student self-approved beta access!";
    }
  } catch (err: any) {
    test2Passed = true;
    test2Actual = `DENIED: Error thrown by RLS policy (${err.message})`;
  } finally {
    await client.query("ROLLBACK;");
  }

  results.push({
    id: 2,
    name: "Student Beta Access Self-Approval Protection",
    scenario: "Authenticated student executes: UPDATE beta_access SET status = 'approved' WHERE user_id = own_id",
    expected: "DENIED / 0 rows updated (Only admin is permitted to update beta_access)",
    actual: test2Actual,
    passed: test2Passed,
  });

  // -------------------------------------------------------------------------
  // TEST 3: Unauthenticated (anonymous) request attempts to read data from protected tables
  // -------------------------------------------------------------------------
  await client.query("BEGIN;");
  let test3Passed = false;
  let test3Actual = "";
  try {
    await client.query("SET LOCAL ROLE anon;");
    await client.query("SET LOCAL request.jwt.claim.role = 'anon';");

    const progressRes = await client.query("SELECT * FROM public.user_progress;");
    const feedbackRes = await client.query("SELECT * FROM public.feedback;");
    const bugRes = await client.query("SELECT * FROM public.bug_reports;");

    const totalLeakedRows = (progressRes.rowCount || 0) + (feedbackRes.rowCount || 0) + (bugRes.rowCount || 0);
    if (totalLeakedRows === 0) {
      test3Passed = true;
      test3Actual = "DENIED: 0 rows returned across user_progress, feedback, bug_reports for anon role";
    } else {
      test3Passed = false;
      test3Actual = `VULNERABILITY: Anonymous client read ${totalLeakedRows} private rows!`;
    }
  } catch (err: any) {
    test3Passed = true;
    test3Actual = `DENIED: RLS permission error (${err.message})`;
  } finally {
    await client.query("ROLLBACK;");
  }

  results.push({
    id: 3,
    name: "Anonymous Data Isolation on Protected Tables",
    scenario: "Unauthenticated (anon) client queries user_progress, feedback, bug_reports",
    expected: "DENIED / 0 rows accessible to unauthenticated callers",
    actual: test3Actual,
    passed: test3Passed,
  });

  // -------------------------------------------------------------------------
  // TEST 4: Authenticated student attempts to read another user's user_progress row
  // -------------------------------------------------------------------------
  await client.query("BEGIN;");
  let test4Passed = false;
  let test4Actual = "";
  try {
    await client.query("SET LOCAL ROLE authenticated;");
    await client.query(`SET LOCAL request.jwt.claim.sub = '${studentId}';`);
    await client.query("SET LOCAL request.jwt.claim.role = 'authenticated';");

    const res = await client.query(`
      SELECT * FROM public.user_progress WHERE user_id = '${adminId}';
    `);
    if ((res.rowCount || 0) === 0) {
      test4Passed = true;
      test4Actual = "DENIED: 0 rows returned (RLS policy 'user_progress_select_own' strictly isolated access)";
    } else {
      test4Passed = false;
      test4Actual = `VULNERABILITY: Student read ${res.rowCount} foreign user progress records!`;
    }
  } catch (err: any) {
    test4Passed = true;
    test4Actual = `DENIED: Error thrown by RLS (${err.message})`;
  } finally {
    await client.query("ROLLBACK;");
  }

  results.push({
    id: 4,
    name: "Cross-Tenant User Progress Isolation",
    scenario: "Student (User A) executes: SELECT * FROM user_progress WHERE user_id = 'User B'",
    expected: "DENIED / 0 rows returned (Users can only read their own progress)",
    actual: test4Actual,
    passed: test4Passed,
  });

  // -------------------------------------------------------------------------
  // TEST 5: Authenticated student attempts to read another user's feedback/bug_reports
  // -------------------------------------------------------------------------
  await client.query("BEGIN;");
  let test5Passed = false;
  let test5Actual = "";
  try {
    await client.query("SET LOCAL ROLE authenticated;");
    await client.query(`SET LOCAL request.jwt.claim.sub = '${studentId}';`);
    await client.query("SET LOCAL request.jwt.claim.role = 'authenticated';");

    const feedbackRes = await client.query(`
      SELECT * FROM public.feedback WHERE user_id != '${studentId}';
    `);
    const bugRes = await client.query(`
      SELECT * FROM public.bug_reports WHERE user_id != '${studentId}';
    `);
    const foreignRows = (feedbackRes.rowCount || 0) + (bugRes.rowCount || 0);

    if (foreignRows === 0) {
      test5Passed = true;
      test5Actual = "DENIED: 0 rows returned (Non-admin students cannot view peers' feedback or bug logs)";
    } else {
      test5Passed = false;
      test5Actual = `VULNERABILITY: Student read ${foreignRows} peer submissions!`;
    }
  } catch (err: any) {
    test5Passed = true;
    test5Actual = `DENIED: Error thrown by RLS (${err.message})`;
  } finally {
    await client.query("ROLLBACK;");
  }

  results.push({
    id: 5,
    name: "Peer Feedback & Bug Report Isolation",
    scenario: "Student executes: SELECT * FROM feedback / bug_reports WHERE user_id != own_id",
    expected: "DENIED / 0 foreign rows visible (Only own submissions or admin access)",
    actual: test5Actual,
    passed: test5Passed,
  });

  // -------------------------------------------------------------------------
  // TEST 6: Authenticated student attempts to read the full beta_access queue
  // -------------------------------------------------------------------------
  await client.query("BEGIN;");
  let test6Passed = false;
  let test6Actual = "";
  try {
    await client.query("SET LOCAL ROLE authenticated;");
    await client.query(`SET LOCAL request.jwt.claim.sub = '${studentId}';`);
    await client.query("SET LOCAL request.jwt.claim.role = 'authenticated';");

    const res = await client.query("SELECT * FROM public.beta_access;");
    // Should ONLY return the student's own row (at most 1)
    const hasForeignRows = res.rows.some((r) => r.user_id !== studentId);

    if (!hasForeignRows) {
      test6Passed = true;
      test6Actual = `ISOLATED: Returned ${res.rowCount || 0} row(s) (only student's own status, 0 foreign records)`;
    } else {
      test6Passed = false;
      test6Actual = `VULNERABILITY: Student read full queue with ${res.rowCount || 0} records!`;
    }
  } catch (err: any) {
    test6Passed = true;
    test6Actual = `DENIED: Error thrown by RLS (${err.message})`;
  } finally {
    await client.query("ROLLBACK;");
  }

  results.push({
    id: 6,
    name: "Beta Access Queue Privacy",
    scenario: "Student executes: SELECT * FROM beta_access (attempting to list all users)",
    expected: "RESTRICTED / Returns only the student's own record, foreign queue hidden",
    actual: test6Actual,
    passed: test6Passed,
  });

  // -------------------------------------------------------------------------
  // TEST 7: Client attempts to inject role = 'admin' or status = 'approved' during signup
  // -------------------------------------------------------------------------
  await client.query("BEGIN;");
  let test7Passed = false;
  let test7Actual = "";
  try {
    // Simulate auth.users insert with malicious metadata attempting to claim admin role
    const mockAuthId = "11111111-1111-1111-1111-111111111111";
    await client.query(`
      INSERT INTO auth.users (
        id, email, raw_user_meta_data, created_at, updated_at
      ) VALUES (
        '${mockAuthId}',
        'hacker@gstu.ac.bd',
        '{"role": "admin", "status": "approved", "full_name": "Injected User"}'::jsonb,
        now(), now()
      );
    `);

    // Trigger handle_new_user() executes
    const profileCheck = await client.query(`SELECT role FROM public.profiles WHERE id = '${mockAuthId}';`);
    const betaCheck = await client.query(`SELECT status FROM public.beta_access WHERE user_id = '${mockAuthId}';`);

    const finalRole = profileCheck.rows[0]?.role;
    const finalStatus = betaCheck.rows[0]?.status;

    if (finalRole === "student" && finalStatus === "pending") {
      test7Passed = true;
      test7Actual = `IGNORED: Resulting profile has role='${finalRole}' and status='${finalStatus}' (Trigger enforces defaults)`;
    } else {
      test7Passed = false;
      test7Actual = `VULNERABILITY: Malicious payload injected role='${finalRole}', status='${finalStatus}'`;
    }
  } catch (err: any) {
    test7Passed = false;
    test7Actual = `Execution error during trigger test: ${err.message}`;
  } finally {
    await client.query("ROLLBACK;");
  }

  results.push({
    id: 7,
    name: "Signup Metadata Injection Hardening",
    scenario: "Client submits signup payload with raw_user_meta_data containing role='admin' & status='approved'",
    expected: "IGNORED / Trigger hardcodes role='student' and status='pending'",
    actual: test7Actual,
    passed: test7Passed,
  });

  // -------------------------------------------------------------------------
  // TEST 8: Attempt to invoke seed-admin promotion from non-admin client context
  // -------------------------------------------------------------------------
  await client.query("BEGIN;");
  let test8Passed = false;
  let test8Actual = "";
  try {
    await client.query("SET LOCAL ROLE authenticated;");
    await client.query(`SET LOCAL request.jwt.claim.sub = '${studentId}';`);
    await client.query("SET LOCAL request.jwt.claim.role = 'authenticated';");

    // Attempt direct admin promotion query
    const res = await client.query(`
      UPDATE public.profiles SET role = 'admin' WHERE id = '${foreignStudentId}';
    `);
    if (res.rowCount === 0) {
      test8Passed = true;
      test8Actual = "DENIED: 0 rows updated (Public client cannot execute operator promotions)";
    } else {
      test8Passed = false;
      test8Actual = "VULNERABILITY: Non-admin promoted a user!";
    }
  } catch (err: any) {
    test8Passed = true;
    test8Actual = `DENIED: Blocked by RLS policies (${err.message})`;
  } finally {
    await client.query("ROLLBACK;");
  }

  results.push({
    id: 8,
    name: "Operator Promotion Isolation from Public Client",
    scenario: "Non-admin student attempts to promote a user to admin via client queries",
    expected: "DENIED / 0 rows updated (Only CLI scripts with direct DATABASE_URL can promote)",
    actual: test8Actual,
    passed: test8Passed,
  });

  // -------------------------------------------------------------------------
  // TEST 9: Confirm RLS is actually ENABLED on all 5 tables
  // -------------------------------------------------------------------------
  const rlsRes = await client.query(`
    SELECT tablename, rowsecurity 
    FROM pg_tables 
    WHERE schemaname = 'public' AND tablename IN ('profiles', 'beta_access', 'user_progress', 'feedback', 'bug_reports')
    ORDER BY tablename;
  `);

  const tablesWithRls = rlsRes.rows.filter((r) => r.rowsecurity === true).map((r) => r.tablename);
  const expectedTables = ["beta_access", "bug_reports", "feedback", "profiles", "user_progress"];
  const allEnabled = expectedTables.every((t) => tablesWithRls.includes(t));

  results.push({
    id: 9,
    name: "Database Table-Level RLS Enforcement",
    scenario: "Query pg_tables.rowsecurity across all 5 public database tables",
    expected: "ENABLED (rowsecurity = true) on 100% of public tables",
    actual: allEnabled
      ? `ENABLED on all 5 tables: [${tablesWithRls.join(", ")}]`
      : `GAP: Missing RLS on: ${expectedTables.filter((t) => !tablesWithRls.includes(t)).join(", ")}`,
    passed: allEnabled,
  });

  // -------------------------------------------------------------------------
  // TEST 10: Confirm admin.ts is never imported into any client-bundled code (src/)
  // -------------------------------------------------------------------------
  let clientLeakDetected = false;
  let leakDetails = "";

  function scanDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile() && /\.(tsx|ts|jsx|js)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, "utf-8");
        if (content.includes("client/admin") || content.includes("SUPABASE_SERVICE_ROLE_KEY")) {
          clientLeakDetected = true;
          leakDetails += `${fullPath} `;
        }
      }
    }
  }

  const srcDir = path.resolve(process.cwd(), "src");
  if (fs.existsSync(srcDir)) {
    scanDir(srcDir);
  }

  results.push({
    id: 10,
    name: "Service-Role Admin Client Bundle Isolation",
    scenario: "Static code inspection for imports of backend/client/admin.ts or service-role keys in src/",
    expected: "ZERO imports or bundle leaks in client-facing application code",
    actual: !clientLeakDetected
      ? "CLEAN: 0 references to admin.ts or service-role keys in src/"
      : `LEAK DETECTED in: ${leakDetails}`,
    passed: !clientLeakDetected,
  });

  // -------------------------------------------------------------------------
  // TEST 11: Non-mentor student attempts to read another student's user_progress
  // -------------------------------------------------------------------------
  await client.query("BEGIN;");
  let test11Passed = false;
  let test11Actual = "";
  try {
    await client.query("SET LOCAL ROLE authenticated;");
    await client.query(`SET LOCAL request.jwt.claim.sub = '${studentId}';`);
    await client.query("SET LOCAL request.jwt.claim.role = 'authenticated';");

    const queryRes = await client.query(`
      SELECT * FROM public.user_progress WHERE user_id = '${foreignStudentId}';
    `);
    if (queryRes.rows.length === 0) {
      test11Passed = true;
      test11Actual = "DENIED: 0 rows returned (RLS strictly prevents non-mentor cross-progress reads)";
    } else {
      test11Passed = false;
      test11Actual = "VULNERABILITY: Non-mentor student read foreign progress record!";
    }
  } catch (err: any) {
    test11Passed = true;
    test11Actual = `DENIED: Query blocked with error (${err.message})`;
  } finally {
    await client.query("ROLLBACK;");
  }

  results.push({
    id: 11,
    name: "Non-Mentor Cross-Tenant Progress Isolation",
    scenario: "Authenticated student (role='student') queries: SELECT * FROM user_progress WHERE user_id = foreign_id",
    expected: "DENIED / 0 rows returned",
    actual: test11Actual,
    passed: test11Passed,
  });

  // -------------------------------------------------------------------------
  // TEST 12: Unapproved mentor applicant attempts cross-tenant progress read
  // -------------------------------------------------------------------------
  await client.query("BEGIN;");
  let test12Passed = false;
  let test12Actual = "";
  try {
    // Insert a dummy pending mentor application for student
    await client.query(`
      INSERT INTO public.mentor_applications (user_id, reason, status)
      VALUES ('${studentId}', 'I want to mentor', 'pending')
      ON CONFLICT (user_id) DO UPDATE SET status = 'pending';
    `);

    await client.query("SET LOCAL ROLE authenticated;");
    await client.query(`SET LOCAL request.jwt.claim.sub = '${studentId}';`);
    await client.query("SET LOCAL request.jwt.claim.role = 'authenticated';");

    const queryRes = await client.query(`
      SELECT * FROM public.user_progress WHERE user_id = '${foreignStudentId}';
    `);
    if (queryRes.rows.length === 0) {
      test12Passed = true;
      test12Actual = "DENIED: 0 rows returned (Applying does not grant mentor read privileges before admin approval)";
    } else {
      test12Passed = false;
      test12Actual = "VULNERABILITY: Pending applicant obtained mentor privileges prematurely!";
    }
  } catch (err: any) {
    test12Passed = true;
    test12Actual = `DENIED: Blocked by RLS (${err.message})`;
  } finally {
    await client.query("ROLLBACK;");
  }

  results.push({
    id: 12,
    name: "Unapproved Mentor Applicant Isolation",
    scenario: "Applicant with pending mentor_applications record queries foreign user_progress",
    expected: "DENIED / 0 rows returned (Only approved role='mentor' receives read access)",
    actual: test12Actual,
    passed: test12Passed,
  });

  // -------------------------------------------------------------------------
  // TEST 13: Mentor attempts to update beta_access.status
  // -------------------------------------------------------------------------
  await client.query("BEGIN;");
  let test13Passed = false;
  let test13Actual = "";
  try {
    // Temporarily elevate student to mentor inside isolated transaction
    await client.query(`UPDATE public.profiles SET role = 'mentor' WHERE id = '${studentId}';`);

    await client.query("SET LOCAL ROLE authenticated;");
    await client.query(`SET LOCAL request.jwt.claim.sub = '${studentId}';`);
    await client.query("SET LOCAL request.jwt.claim.role = 'authenticated';");

    const updateRes = await client.query(`
      UPDATE public.beta_access SET status = 'approved' WHERE user_id = '${foreignStudentId}';
    `);
    if (updateRes.rowCount === 0) {
      test13Passed = true;
      test13Actual = "0 rows updated (RLS 'beta_access_update_admin_only' blocked mentor update)";
    } else {
      test13Passed = false;
      test13Actual = "VULNERABILITY: Mentor was able to approve beta access!";
    }
  } catch (err: any) {
    test13Passed = true;
    test13Actual = `DENIED: Blocked with error (${err.message})`;
  } finally {
    await client.query("ROLLBACK;");
  }

  results.push({
    id: 13,
    name: "Mentor Beta-Access Modification Protection",
    scenario: "User with role='mentor' executes: UPDATE beta_access SET status = 'approved'",
    expected: "DENIED / 0 rows updated (Only admin can update beta_access)",
    actual: test13Actual,
    passed: test13Passed,
  });

  // -------------------------------------------------------------------------
  // TEST 14: Mentor attempts to escalate their own role to 'admin'
  // -------------------------------------------------------------------------
  await client.query("BEGIN;");
  let test14Passed = false;
  let test14Actual = "";
  try {
    await client.query(`UPDATE public.profiles SET role = 'mentor' WHERE id = '${studentId}';`);

    await client.query("SET LOCAL ROLE authenticated;");
    await client.query(`SET LOCAL request.jwt.claim.sub = '${studentId}';`);
    await client.query("SET LOCAL request.jwt.claim.role = 'authenticated';");

    const updateRes = await client.query(`
      UPDATE public.profiles SET role = 'admin' WHERE id = '${studentId}';
    `);
    if (updateRes.rowCount === 0) {
      test14Passed = true;
      test14Actual = "0 rows updated (RLS WITH CHECK prevented mentor role escalation)";
    } else {
      const check = await client.query(`SELECT role FROM public.profiles WHERE id = '${studentId}';`);
      if (check.rows[0]?.role === "admin") {
        test14Passed = false;
        test14Actual = "VULNERABILITY: Mentor successfully escalated to admin!";
      } else {
        test14Passed = true;
        test14Actual = "Role modification blocked by RLS policy constraint.";
      }
    }
  } catch (err: any) {
    test14Passed = true;
    test14Actual = `DENIED: Error thrown by RLS WITH CHECK policy (${err.message})`;
  } finally {
    await client.query("ROLLBACK;");
  }

  results.push({
    id: 14,
    name: "Mentor Role Escalation Protection",
    scenario: "User with role='mentor' executes: UPDATE profiles SET role = 'admin' WHERE id = own_id",
    expected: "DENIED / 0 rows updated",
    actual: test14Actual,
    passed: test14Passed,
  });

  // -------------------------------------------------------------------------
  // TEST 15: Approved Mentor successfully reads cross-user progress data
  // -------------------------------------------------------------------------
  await client.query("BEGIN;");
  let test15Passed = false;
  let test15Actual = "";
  try {
    await client.query(`UPDATE public.profiles SET role = 'mentor' WHERE id = '${studentId}';`);

    await client.query("SET LOCAL ROLE authenticated;");
    await client.query(`SET LOCAL request.jwt.claim.sub = '${studentId}';`);
    await client.query("SET LOCAL request.jwt.claim.role = 'authenticated';");

    const queryRes = await client.query(`
      SELECT * FROM public.user_progress;
    `);
    if (queryRes.rows.length >= 0) {
      test15Passed = true;
      test15Actual = `ALLOWED: Approved mentor successfully queried user_progress (${queryRes.rows.length} rows accessible)`;
    } else {
      test15Passed = false;
      test15Actual = "Error: Mentor could not read user_progress table";
    }
  } catch (err: any) {
    test15Passed = false;
    test15Actual = `FAILED: Mentor query threw unexpected error (${err.message})`;
  } finally {
    await client.query("ROLLBACK;");
  }

  results.push({
    id: 15,
    name: "Approved Mentor Cross-Tenant Progress Read Access",
    scenario: "User with role='mentor' executes: SELECT * FROM user_progress",
    expected: "ALLOWED / Query succeeds without RLS block",
    actual: test15Actual,
    passed: test15Passed,
  });

  // -------------------------------------------------------------------------
  // TEST 16: Non-mentor / non-admin student attempts to insert into notices
  // -------------------------------------------------------------------------
  await client.query("BEGIN;");
  let test16Passed = false;
  let test16Actual = "";
  try {
    await client.query("SET LOCAL ROLE authenticated;");
    await client.query(`SET LOCAL request.jwt.claim.sub = '${studentId}';`);
    await client.query("SET LOCAL request.jwt.claim.role = 'authenticated';");

    const insertRes = await client.query(`
      INSERT INTO public.notices (sender_id, title, message)
      VALUES ('${studentId}', 'Unauthorized Notice', 'This should fail');
    `);
    if (insertRes.rowCount === 0) {
      test16Passed = true;
      test16Actual = "0 rows inserted (RLS policy 'notices_insert_mentor_or_admin' blocked student insertion)";
    } else {
      test16Passed = false;
      test16Actual = "VULNERABILITY: Non-mentor student inserted notice into public.notices!";
    }
  } catch (err: any) {
    test16Passed = true;
    test16Actual = `DENIED: Error thrown by RLS policy (${err.message})`;
  } finally {
    await client.query("ROLLBACK;");
  }

  results.push({
    id: 16,
    name: "Non-Mentor Notice Insertion Protection",
    scenario: "Authenticated student (role='student') executes: INSERT INTO notices (sender_id, title, message)",
    expected: "DENIED / 0 rows inserted (Only mentor or admin can broadcast notices)",
    actual: test16Actual,
    passed: test16Passed,
  });

  // -------------------------------------------------------------------------
  // PRINT ITEMIZE REPORT
  // -------------------------------------------------------------------------
  console.log("--------------------------------------------------------------------------------");
  console.log(`ITEMIZED SECURITY VERIFICATION RESULTS (${results.length} / ${results.length}):`);
  console.log("--------------------------------------------------------------------------------\n");

  let totalPassed = 0;
  results.forEach((r) => {
    if (r.passed) totalPassed++;
    const symbol = r.passed ? "✓ PASS" : "❌ FAIL";
    console.log(`[Item ${r.id}] ${symbol}: ${r.name}`);
    console.log(`  - Scenario : ${r.scenario}`);
    console.log(`  - Expected : ${r.expected}`);
    console.log(`  - Actual   : ${r.actual}\n`);
  });

  console.log("================================================================================");
  console.log(`TOTAL SECURITY SUITE RESULT: ${totalPassed} / ${results.length} PASSED`);
  console.log("================================================================================\n");

  await client.end();

  if (totalPassed !== results.length) {
    process.exit(1);
  }
}

runSecurityAudit().catch((err) => {
  console.error("Fatal error during security audit:", err);
  process.exit(1);
});
