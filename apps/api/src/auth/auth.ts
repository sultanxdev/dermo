import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { Pool } from "pg";

export const authPool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/dermo_clinic",
});

export const auth = betterAuth({
  database: authPool,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000",
  secret: process.env.BETTER_AUTH_SECRET || "default_dev_secret_must_be_overridden_in_production_min_32_chars",

  plugins: [
    admin({
      // We only use the server-side admin user creation capability
      // No complex organization or custom RBAC
    }),
  ],

  user: {
    additionalFields: {
      accountType: {
        type: "string",
        required: true,
        input: false, // Prevents client-side injection during normal auth
      },
      clinicId: {
        type: "string",
        required: false,
        input: false, // Injected exclusively by server provisioning
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    // Disable public signup: Only Dermo internal team can provision clinic accounts
    disableSignUp: true,
    minPasswordLength: 8,
    async sendResetPassword({ user, url }) {
      // Branded account setup & password reset delivery
      console.log(`[Email Service] Password setup/reset link for ${user.email}: ${url}`);
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,      // 1 day rolling window
    cookieCache: {
      enabled: false,             // Disabled: real-time revocation & immediate clinic suspension
    },
  },

  advanced: {
    cookiePrefix: "dermo",
    crossSubDomainCookies: {
      enabled: false, // Same-origin proxy architecture
    },
    useSecureCookies: process.env.NODE_ENV === "production",
  },

  trustedOrigins: [
    process.env.FRONTEND_URL || "http://localhost:3000",
  ],
});
