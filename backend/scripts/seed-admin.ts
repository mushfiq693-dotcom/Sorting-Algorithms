/**
 * ============================================================================
 * Operator Script: Seed / Bootstrap First Administrator for AlgoHub Beta
 * (Section 9.1 of data.txt)
 * ============================================================================
 *
 * Promotes a specific user (identified by email or User ID provided via CLI argument)
 * to `role = 'admin'` and `status = 'approved'`.
 *
 * Usage:
 *   npx tsx backend/scripts/seed-admin.ts <user-email-or-id>
 *
 * Example:
 *   npx tsx backend/scripts/seed-admin.ts mushfiq@gmail.com
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

async function seedAdmin() {
  const targetIdentifier = process.argv[2];

  if (!targetIdentifier) {
    console.error("\n❌ Error: Please provide the target user email or UUID as an argument.");
    console.error("Usage:   npx tsx backend/scripts/seed-admin.ts <user-email-or-id>");
    console.error("Example: npx tsx backend/scripts/seed-admin.ts mushfiq@gmail.com\n");
    process.exit(1);
  }

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

  console.log("=========================================");
  console.log("  ALGOHUB ADMIN BOOTSTRAP OPERATOR SCRIPT ");
  console.log("=========================================\n");
  console.log(`Target Identifier: "${targetIdentifier}"`);

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    targetIdentifier
  );

  const query = isUuid
    ? "SELECT id, email, full_name, role FROM public.profiles WHERE id = $1"
    : "SELECT id, email, full_name, role FROM public.profiles WHERE email = $1";

  const res = await client.query(query, [isUuid ? targetIdentifier : targetIdentifier.toLowerCase()]);

  if (res.rowCount === 0) {
    console.error(`\n❌ User not found for identifier "${targetIdentifier}".`);
    await client.end();
    process.exit(1);
  }

  const user = res.rows[0];
  console.log(`✓ Found user: "${user.full_name || 'N/A'}" (${user.email}) [ID: ${user.id}]`);
  console.log(`  Current Role: ${user.role}`);

  // 1. Update Profile Role to Admin
  await client.query("UPDATE public.profiles SET role = 'admin' WHERE id = $1", [user.id]);
  console.log("✓ Profile role successfully updated to 'admin'.");

  // 2. Approve Beta Access
  await client.query(
    "UPDATE public.beta_access SET status = 'approved', approved_at = timezone('utc'::text, now()), notes = 'Bootstrapped initial administrator' WHERE user_id = $1",
    [user.id]
  );
  console.log("✓ Beta access status successfully updated to 'approved'.");

  console.log("\n=========================================");
  console.log("🎉 SUCCESS: Administrator successfully bootstrapped!");
  console.log(`   User:   ${user.email}`);
  console.log(`   Role:   admin`);
  console.log(`   Status: approved (Full access enabled)`);
  console.log("=========================================\n");

  await client.end();
}

seedAdmin().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
