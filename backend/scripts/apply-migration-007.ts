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
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL;

  if (!connectionString) {
    console.warn("⚠️ Warning: Missing DATABASE_URL environment variable. Skipping remote migration.");
    return;
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("✓ Connected to Supabase PostgreSQL.");

    const migrationSqlPath = path.resolve(
      process.cwd(),
      "backend/database/migrations/007_add_algorithm_content_type.sql"
    );
    const sql = fs.readFileSync(migrationSqlPath, "utf-8");

    console.log("Applying migration 007_add_algorithm_content_type.sql...");
    await client.query(sql);
    console.log("✓ Migration 007 applied successfully!");
  } catch (err) {
    console.warn("Could not apply migration remotely (database might be paused or unreachable):", err);
  } finally {
    await client.end().catch(() => {});
  }
}

runMigration();
