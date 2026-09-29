import { Request, Response, NextFunction } from "express";
import { auth } from "../auth";
import { fromNodeHeaders } from "better-auth/node";
import type { AuthContext } from "../auth/types";

export interface AuthRequest extends Request {
  auth?: AuthContext;
  requestId?: string;
}

/**
 * Validates the Better Auth session and attaches typed auth context to req.auth.
 *
 * After this middleware:
 *   req.auth.user.id       — Better Auth user ID
 *   req.auth.user.email    — verified email
 *   req.auth.session.id    — session ID
 *
 * Does NOT check roles or clinic membership.
 * Role authorization is introduced in PR 1.2.
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

    // Attach typed auth context
    const authContext: AuthContext = {
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        image: result.user.image ?? null,
        emailVerified: result.user.emailVerified,
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
