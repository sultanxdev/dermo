import { betterAuth } from "better-auth";
import { Pool } from "pg";

// Auth-only database connection.
// This is intentionally separate from the future application database layer (Drizzle, PR 1.2).
export const authPool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/dermo_clinic",
});

export const auth = betterAuth({
  database: authPool,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000",
  secret: process.env.BETTER_AUTH_SECRET || "default_dev_secret_must_be_overridden_in_production_min_32_chars",

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  },

  advanced: {
    cookiePrefix: "dermo",
    crossSubDomainCookies: {
      enabled: false,
    },
  },

  trustedOrigins: [
    process.env.FRONTEND_URL || "http://localhost:3000",
  ],
});
