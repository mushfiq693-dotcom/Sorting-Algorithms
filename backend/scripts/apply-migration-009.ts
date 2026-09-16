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

  const migrationSqlPath = path.resolve(
    process.cwd(),
    "backend/database/migrations/009_fix_beta_access_admin_rls.sql"
  );
  const sql = fs.readFileSync(migrationSqlPath, "utf-8");

  console.log("Applying migration 009_fix_beta_access_admin_rls.sql...");
  await client.query(sql);
  console.log("✓ Migration 009 applied successfully!");

  // Verify new policies on beta_access
  const rlsRes = await client.query(`
    SELECT policyname, permissive, roles, cmd, qual, with_check
    FROM pg_policies
    WHERE tablename = 'beta_access'
    ORDER BY cmd, policyname;
  `);
  console.log("\n=== VERIFIED POLICIES ON beta_access ===");
  console.table(rlsRes.rows);

  await client.end();
}

runMigration().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
