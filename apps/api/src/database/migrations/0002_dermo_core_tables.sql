-- Dermo Core Business Tables
-- Migration: 0002_dermo_core_tables.sql

DO $$ BEGIN
  CREATE TYPE demo_request_status AS ENUM (
    'NEW',
    'CONTACTED',
    'DEMO_COMPLETED',
    'ONBOARDING',
    'CONVERTED',
    'REJECTED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE clinic_status AS ENUM ('ACTIVE', 'SUSPENDED', 'ARCHIVED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE onboarding_status AS ENUM (
    'NOT_STARTED',
    'CONFIGURING',
    'TESTING',
    'READY',
    'LIVE',
    'SUSPENDED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. Demo Requests (Public landing page lead capture)
-- Non-unique email index allows re-inquiries from the same clinic prospect over time
CREATE TABLE IF NOT EXISTS demo_requests (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  clinic_name VARCHAR(160) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(25) NOT NULL,
  clinic_type VARCHAR(60),
  doctor_count INT DEFAULT 1,
  city VARCHAR(100),
  requirements TEXT,
  status demo_request_status NOT NULL DEFAULT 'NEW',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_demo_requests_status ON demo_requests(status);
CREATE INDEX IF NOT EXISTS idx_demo_requests_email_lower ON demo_requests(LOWER(email));

-- 2. Clinics (Tenant workspaces)
-- Enforces 1:1 demo link via UNIQUE(source_demo_request_id)
CREATE TABLE IF NOT EXISTS clinics (
  id VARCHAR(36) PRIMARY KEY,
  source_demo_request_id VARCHAR(36) UNIQUE REFERENCES demo_requests(id) ON DELETE SET NULL,
  name VARCHAR(160) NOT NULL,
  slug VARCHAR(80) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(25) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Kolkata',
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  status clinic_status NOT NULL DEFAULT 'ACTIVE',
  onboarding_status onboarding_status NOT NULL DEFAULT 'CONFIGURING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clinics_slug ON clinics(slug);
CREATE INDEX IF NOT EXISTS idx_clinics_status ON clinics(status);
CREATE INDEX IF NOT EXISTS idx_clinics_source_demo ON clinics(source_demo_request_id);
