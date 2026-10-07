import { Request, Response, NextFunction } from "express";
import { auth, authPool } from "../auth";
import { fromNodeHeaders } from "better-auth/node";
import type { AuthContext } from "../auth/types";
import { AccountType } from "@dermo/types";

export interface AuthRequest extends Request {
  auth?: AuthContext;
  requestId?: string;
}

/**
 * Validates the Better Auth session and attaches typed auth context to req.auth.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!result) {
      res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required.",
          requestId: (req as any).requestId,
        },
      });
      return;
    }

    const rawUser = result.user as any;
    const accountType = (rawUser.accountType as AccountType) || "CLINIC_OWNER";
    const clinicId = rawUser.clinicId || undefined;

    // Attach typed auth context
    const authContext: AuthContext = {
      userId: result.user.id,
      email: result.user.email,
      name: result.user.name,
      accountType,
      clinicId,
      sessionId: result.session.id,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        image: result.user.image ?? null,
        emailVerified: result.user.emailVerified,
        accountType,
        clinicId,
      },
      session: {
        id: result.session.id,
        expiresAt: result.session.expiresAt,
      },
    };

    req.auth = authContext;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid or expired session.",
        requestId: (req as any).requestId,
      },
    });
  }
}

/**
 * Authorization guard: Restricts route to Dermo Internal Team accounts.
 */
export function requireInternalTeam(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.auth || req.auth.accountType !== "INTERNAL_TEAM") {
    res.status(403).json({
      success: false,
      error: {
        code: "FORBIDDEN",
        message: "Access restricted to Dermo internal team.",
        requestId: (req as any).requestId,
      },
    });
    return;
  }
  next();
}

/**
 * Authorization guard: Restricts route to Clinic Owner accounts.
 * Also verifies that the clinic tenant is in 'ACTIVE' status (blocks suspended clinics).
 */
export async function requireClinicOwner(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.auth || req.auth.accountType !== "CLINIC_OWNER" || !req.auth.clinicId) {
    res.status(403).json({
      success: false,
      error: {
        code: "FORBIDDEN",
        message: "Access restricted to clinic owner.",
        requestId: (req as any).requestId,
      },
    });
    return;
  }

  try {
    // Immediate Tenant Suspension Check
    const result = await authPool.query(
      `SELECT status FROM clinics WHERE id = $1`,
      [req.auth.clinicId]
    );

    if (result.rows.length === 0 || result.rows[0].status !== "ACTIVE") {
      res.status(403).json({
        success: false,
        error: {
          code: "CLINIC_SUSPENDED",
          message: "This clinic workspace is currently suspended or inactive. Please contact Dermo support.",
          requestId: (req as any).requestId,
        },
      });
      return;
    }

    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to verify clinic status.",
        requestId: (req as any).requestId,
      },
    });
  }
}
