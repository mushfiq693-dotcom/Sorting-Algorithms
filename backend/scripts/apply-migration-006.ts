import { Client } from "pg";
import fs from "node:fs";
import path from "node:path";

function loadEnvLocal() {
  if (process.env.DATABASE_URL) return;
  const envPath = path.resolve("/Users/mushfiq/Desktop/Personal Projects/DSA", ".env.local");
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
    "/Users/mushfiq/Desktop/Personal Projects/DSA/backend/database/migrations/006_course_materials.sql"
  );
  const sql = fs.readFileSync(migrationSqlPath, "utf-8");

  console.log("Applying migration 006_course_materials.sql...");
  await client.query(sql);
  console.log("✓ Migration 006 applied successfully!");

  await client.end();
}

runMigration().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
