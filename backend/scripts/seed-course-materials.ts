import { Client } from "pg";
import * as fs from "fs";
import * as path from "path";
import { DEFAULT_COURSE_MATERIALS } from "../../src/data/defaultCourseMaterials";

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

async function seedCourseMaterials() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("✓ Connected to Supabase PostgreSQL.");

  // Get admin user profile ID if available
  const adminRes = await client.query(`
    SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1;
  `);
  const adminId = adminRes.rows[0]?.id || null;

  // Clear existing table
  await client.query(`DELETE FROM public.course_materials;`);
  console.log("✓ Cleared legacy course materials entries.");

  for (const item of DEFAULT_COURSE_MATERIALS) {
    await client.query(
      `INSERT INTO public.course_materials (
        title, book_reference, topic_tag, content_type, problem_statement,
        explanation_or_solution, difficulty, assigned_date, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        item.title,
        item.book_reference,
        item.topic_tag,
        item.content_type,
        item.problem_statement,
        item.explanation_or_solution,
        item.difficulty,
        item.assigned_date,
        adminId,
      ]
    );
    console.log(`✓ Inserted [${item.content_type}]: "${item.title}"`);
  }

  const countRes = await client.query(`SELECT count(*) FROM public.course_materials;`);
  console.log(`\nTotal course materials in database: ${countRes.rows[0].count}`);

  await client.end();
}

seedCourseMaterials().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
