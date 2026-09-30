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

  console.log("🔄 Running auth migrations...");
  const migrationPath = path.resolve(__dirname, "./migrations/0001_auth_tables.sql");
  if (!fs.existsSync(migrationPath)) {
    throw new Error(`Migration file not found at: ${migrationPath}`);
  }
  const sql = fs.readFileSync(migrationPath, "utf-8");
  await pool.query(sql);
  console.log("✅ Auth tables created successfully");
  await pool.end();
}

migrateAuth().catch((err) => {
  console.error("❌ Auth migration failed:", err);
  process.exit(1);
});
