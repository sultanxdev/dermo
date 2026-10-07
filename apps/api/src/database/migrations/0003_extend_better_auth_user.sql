-- Extend Better Auth "user" Table for Dermo Multi-Tenant SaaS
-- Migration: 0003_extend_better_auth_user.sql

DO $$ BEGIN
  CREATE TYPE auth_account_type AS ENUM ('INTERNAL_TEAM', 'CLINIC_OWNER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. Add custom authorization columns
-- Note: accountType does NOT have a default value to prevent accidental elevation
ALTER TABLE "user"
  ADD COLUMN IF NOT EXISTS "accountType" auth_account_type,
  ADD COLUMN IF NOT EXISTS "clinicId" VARCHAR(36);

-- Backfill any existing dev users if needed before enforcing NOT NULL
UPDATE "user"
SET "accountType" = 'INTERNAL_TEAM'
WHERE "accountType" IS NULL;

-- Enforce NOT NULL on accountType
ALTER TABLE "user"
  ALTER COLUMN "accountType" SET NOT NULL;

-- 2. Foreign Key Constraint to clinics table
DO $$ BEGIN
  ALTER TABLE "user"
    ADD CONSTRAINT fk_user_clinic
    FOREIGN KEY ("clinicId")
    REFERENCES clinics(id)
    ON DELETE RESTRICT;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. Database-level Tenant Invariant Constraint:
-- INTERNAL_TEAM must have clinicId IS NULL
-- CLINIC_OWNER must have clinicId IS NOT NULL
DO $$ BEGIN
  ALTER TABLE "user"
    ADD CONSTRAINT chk_user_account_tenant_invariant
    CHECK (
      ("accountType" = 'INTERNAL_TEAM' AND "clinicId" IS NULL) OR
      ("accountType" = 'CLINIC_OWNER' AND "clinicId" IS NOT NULL)
    );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 4. Fast lookup indexes
CREATE UNIQUE INDEX IF NOT EXISTS "user_email_lower_idx" ON "user" (LOWER("email"));
CREATE INDEX IF NOT EXISTS "user_clinicId_idx" ON "user"("clinicId");
CREATE INDEX IF NOT EXISTS "user_accountType_idx" ON "user"("accountType");
