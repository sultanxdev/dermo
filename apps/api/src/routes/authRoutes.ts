import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config';
import { validateBody } from '../middleware/validator';
import { loginSchema, registerSchema } from '@dermo/schemas';
import { AuthRequest, authenticate } from '../middleware/auth';
import { db } from '../database/db';
import { StaffUser } from '@dermo/types';

const router = Router();

/** Strip sensitive fields before sending user data to the client */
function sanitizeUser(user: StaffUser) {
  const { passwordHash, ...safe } = user;
  return safe;
}

/** Generate a signed JWT for a given user */
function generateToken(user: StaffUser): string {
  return jwt.sign(
    {
      id: user.id,
      clinicId: user.clinicId,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
}

// ─────────────────────────────────────────────
// POST /auth/login
// ─────────────────────────────────────────────
router.post('/login', validateBody(loginSchema), async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  const user = db.getUserByEmail(email);
  if (!user || !user.passwordHash) {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password.',
      },
    });
    return;
  }

  if (!user.isActive) {
    res.status(403).json({
      success: false,
      error: {
        code: 'ACCOUNT_DISABLED',
        message: 'Your account has been deactivated. Contact your clinic administrator.',
      },
    });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password.',
      },
    });
    return;
  }

  const token = generateToken(user);

  res.json({
    success: true,
    data: {
      token,
      user: sanitizeUser(user),
    },
  });
});

// ─────────────────────────────────────────────
// POST /auth/register
// ─────────────────────────────────────────────
router.post('/register', validateBody(registerSchema), async (req: AuthRequest, res: Response) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = db.getUserByEmail(email);
  if (existingUser) {
    res.status(409).json({
      success: false,
      error: {
        code: 'USER_EXISTS',
        message: 'An account with this email already exists.',
      },
    });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const newUser = db.createUser({
    clinicId: 'clinic_dermacare_01', // Default clinic for now
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: role || 'STAFF',
    isActive: true,
  });

  const token = generateToken(newUser);

  res.status(201).json({
    success: true,
    data: {
      token,
      user: sanitizeUser(newUser),
    },
  });
});

// ─────────────────────────────────────────────
// GET /auth/me (protected)
// ─────────────────────────────────────────────
router.get('/me', authenticate, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' },
    });
    return;
  }

  const user = db.getUserById(req.user.id);
  if (!user) {
    res.status(404).json({
      success: false,
      error: { code: 'USER_NOT_FOUND', message: 'User not found.' },
    });
    return;
  }

  res.json({
    success: true,
    data: sanitizeUser(user),
  });
});

// ─────────────────────────────────────────────
// POST /auth/logout
// ─────────────────────────────────────────────
router.post('/logout', (_req: AuthRequest, res: Response) => {
  res.json({ success: true, data: { message: 'Logged out successfully' } });
});

export default router;
