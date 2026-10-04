import { Pool } from "pg";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function migrateAuth() {
  const pool = new Pool({
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@localhost:5432/dermo_clinic",
  });

  console.log("🔄 Running database migrations...");
  const migrationsDir = path.resolve(__dirname, "./migrations");
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    console.log(`  Applying migration: ${file}...`);
    const sql = fs.readFileSync(filePath, "utf-8");
    await pool.query(sql);
    console.log(`  ✓ ${file} applied`);
  }

  console.log("✅ All migrations applied successfully");
  await pool.end();
}

migrateAuth().catch((err) => {
  console.error("❌ Database migration failed:", err);
  process.exit(1);
});
