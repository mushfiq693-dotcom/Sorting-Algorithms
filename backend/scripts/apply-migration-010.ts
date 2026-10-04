import { Client } from "pg";
import * as fs from "fs";
import * as path from "path";

// Load .env.local
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const [key, ...vals] = trimmed.split("=");
        process.env[key.trim()] = vals.join("=").trim().replace(/^["']|["']$/g, "");
      }
    }
  }
} catch (e) {
  console.warn("Could not load .env.local:", e);
}

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL;

if (!connectionString) {
  console.error("Missing database connection URL in .env.local!");
  process.exit(1);
}

async function runMigration() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("✓ Connected to Supabase PostgreSQL.");

  console.log("Adding new columns to course_materials table...");
  
  await client.query(`
    ALTER TABLE public.course_materials 
    ADD COLUMN IF NOT EXISTS bangla_explanation TEXT,
    ADD COLUMN IF NOT EXISTS is_midterm BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS importance_rank INTEGER DEFAULT 0;
  `);

  console.log("✓ Added columns successfully.");

  await client.end();
}

runMigration().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
