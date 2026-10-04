import { auth } from "../auth";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function createAdmin() {
  const args = process.argv.slice(2);
  const name = args[0];
  const email = args[1];
  const password = args[2];

  if (!name || !email || !password) {
    console.log("Usage: pnpm db:create-admin <name> <email> <password>");
    console.log('Example: pnpm db:create-admin "Sultan Admin" "admin@dermoai.in" "AdminPass123!"');
    process.exit(1);
  }

  const normalizedEmail = email.trim().toLowerCase();

  console.log(`⏳ Creating Dermo Internal Admin account for: ${normalizedEmail}...`);

  try {
    const res = await auth.api.createUser({
      body: {
        name,
        email: normalizedEmail,
        password,
        role: "admin",
        data: {
          accountType: "INTERNAL_TEAM",
        },
      },
    });

    console.log("✅ Internal Admin successfully created!");
    console.log(`   User ID: ${res.user.id}`);
    console.log(`   Email:   ${res.user.email}`);
    console.log(`   Account: INTERNAL_TEAM`);
    process.exit(0);
  } catch (err: any) {
    console.error("❌ Failed to create admin:", err.message || err);
    process.exit(1);
  }
}

createAdmin();
