import { AccountType } from "@dermo/types";

/**
 * Typed authentication context attached to every authenticated request.
 *
 * Uses `req.auth` to provide session, user identity, and tenant context.
 */
export interface AuthContext {
  userId: string;
  email: string;
  name: string;
  accountType: AccountType;
  clinicId?: string; // Present when accountType === 'CLINIC_OWNER'
  sessionId: string;
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    emailVerified: boolean;
    accountType: AccountType;
    clinicId?: string | null;
  };
  session: {
    id: string;
    expiresAt: Date;
  };
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}
