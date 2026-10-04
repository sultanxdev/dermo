export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface WorkingHours {
  day: DayOfWeek;
  open: string;  // e.g. "09:00"
  close: string; // e.g. "19:00"
  isOpen: boolean;
}

export type ClinicStatus = 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';

export type OnboardingStatus =
  | 'NOT_STARTED'
  | 'CONFIGURING'
  | 'TESTING'
  | 'READY'
  | 'LIVE'
  | 'SUSPENDED';

export interface Clinic {
  id: string;
  sourceDemoRequestId?: string | null;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  address?: string;
  city?: string;
  phone: string;
  email: string;
  website?: string;
  timezone: string;
  currency: string;
  hours?: WorkingHours[];
  enableGoogleDocsSync?: boolean;
  enableRazorpayDeposits?: boolean;
  consultationDepositAmount?: number;
  status: ClinicStatus;
  onboardingStatus: OnboardingStatus;
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------
// Demo Request Entity
// ----------------------------------------------------
export type DemoRequestStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'DEMO_COMPLETED'
  | 'ONBOARDING'
  | 'CONVERTED'
  | 'REJECTED';

export interface DemoRequest {
  id: string;
  name: string;
  clinicName: string;
  email: string;
  phone: string;
  clinicType?: string;
  doctorCount?: number;
  city?: string;
  requirements?: string;
  status: DemoRequestStatus;
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------
// Authentication & Account Models (Zero RBAC Model)
// ----------------------------------------------------
export type AccountType = 'INTERNAL_TEAM' | 'CLINIC_OWNER';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  accountType: AccountType;
  clinicId?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AuthContext {
  userId: string;
  email: string;
  name: string;
  accountType: AccountType;
  clinicId?: string;
  sessionId: string;
}
