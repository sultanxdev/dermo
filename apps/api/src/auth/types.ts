/**
 * Typed authentication context attached to every authenticated request.
 *
 * Uses `req.auth` (not `req.user`) to avoid overloading the Express default
 * and to provide a clean extension point for PR 1.2 (staff profile + clinic).
 *
 * PR 1.2 extends this interface additively:
 *   req.auth.staff  → { clinicId, role, phone, isActive }
 *   req.auth.clinic → { id, name, timezone }
 */
export interface AuthContext {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    emailVerified: boolean;
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
