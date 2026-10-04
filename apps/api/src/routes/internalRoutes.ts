import { Router, Request, Response } from 'express';
import { auth, authPool } from '../auth';
import { fromNodeHeaders } from 'better-auth/node';
import { provisionClinicSchema, updateOnboardingStatusSchema } from '@dermo/schemas';
import { requireAuth, requireInternalTeam } from '../middleware/requireAuth';
import { Database } from '../database/db';

const router = Router();

// Protect all internal routes with requireAuth and requireInternalTeam
router.use(requireAuth, requireInternalTeam);

// POST /api/v1/internal/clinics — Provision a new clinic and its owner
router.post('/clinics', async (req: Request, res: Response): Promise<void> => {
  const parsed = provisionClinicSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: parsed.error.errors[0]?.message || 'Invalid input data',
        details: parsed.error.errors,
      },
    });
    return;
  }

  const {
    sourceDemoRequestId,
    name,
    slug,
    ownerName,
    email,
    phone,
    address,
    city,
    timezone,
    currency,
  } = parsed.data;

  const client = await authPool.connect();
  try {
    await client.query('BEGIN');

    // 1. Verify slug uniqueness
    const existingSlug = await client.query('SELECT id FROM clinics WHERE slug = $1', [slug]);
    if (existingSlug.rows.length > 0) {
      await client.query('ROLLBACK');
      res.status(409).json({
        success: false,
        error: { code: 'SLUG_EXISTS', message: 'A clinic with this URL slug already exists.' },
      });
      return;
    }

    // 2. Insert Clinic
    const clinicId = `cln_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const clinicResult = await client.query(
      `INSERT INTO clinics (id, source_demo_request_id, name, slug, email, phone, address, city, timezone, currency, status, onboarding_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'ACTIVE', 'CONFIGURING')
       RETURNING *`,
      [
        clinicId,
        sourceDemoRequestId || null,
        name,
        slug,
        email,
        phone,
        address || null,
        city || null,
        timezone || 'Asia/Kolkata',
        currency || 'INR',
      ]
    );

    // 3. Advance Demo Request if linked
    if (sourceDemoRequestId) {
      await client.query(
        `UPDATE demo_requests SET status = 'ONBOARDING', updated_at = NOW() WHERE id = $1`,
        [sourceDemoRequestId]
      );
    }

    await client.query('COMMIT');

    // 4. Create Clinic Owner Account via Better Auth Admin API
    let ownerUserId: string;
    try {
      const userRes = await auth.api.createUser({
        headers: fromNodeHeaders(req.headers),
        body: {
          email,
          name: ownerName,
          data: {
            accountType: 'CLINIC_OWNER',
            clinicId,
          },
        },
      });
      ownerUserId = userRes.user.id;
    } catch (createErr: any) {
      console.warn(`Better Auth createUser notice: ${createErr.message}`);
      // Check if user already exists
      const existingUser = await authPool.query(
        `SELECT id FROM "user" WHERE LOWER(email) = LOWER($1)`,
        [email]
      );
      if (existingUser.rows.length > 0) {
        ownerUserId = existingUser.rows[0].id;
        // Bind clinicId and accountType
        await authPool.query(
          `UPDATE "user" SET "clinicId" = $1, "accountType" = 'CLINIC_OWNER' WHERE id = $2`,
          [clinicId, ownerUserId]
        );
      } else {
        throw createErr;
      }
    }

    // 5. Trigger password setup email
    try {
      await auth.api.forgetPassword({
        body: {
          email,
          redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password`,
        },
      });
    } catch (emailErr) {
      console.warn('Could not dispatch password setup email:', emailErr);
    }

    res.status(201).json({
      success: true,
      data: {
        clinic: clinicResult.rows[0],
        owner: {
          id: ownerUserId,
          email,
          name: ownerName,
        },
      },
    });
  } catch (err: any) {
    await client.query('ROLLBACK');
    res.status(500).json({
      success: false,
      error: {
        code: 'PROVISION_FAILED',
        message: err.message || 'Failed to provision clinic',
      },
    });
  } finally {
    client.release();
  }
});

// GET /api/v1/internal/clinics — List all clinics with onboarding status
router.get('/clinics', async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await authPool.query(`
      SELECT 
        c.*,
        u.name as owner_name,
        u.email as owner_email,
        u.id as owner_id
      FROM clinics c
      LEFT JOIN "user" u ON u."clinicId" = c.id
      ORDER BY c.created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to list clinics' },
    });
  }
});

// GET /api/v1/internal/clinics/:id — Get clinic setup checklist
router.get('/clinics/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const clinicRes = await authPool.query(
      `SELECT c.*, u.name as owner_name, u.email as owner_email, u.id as owner_id
       FROM clinics c
       LEFT JOIN "user" u ON u."clinicId" = c.id
       WHERE c.id = $1`,
      [req.params.id]
    );

    if (clinicRes.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Clinic not found' },
      });
      return;
    }

    const clinic = clinicRes.rows[0];

    // Check readiness criteria
    const accountCheck = clinic.owner_id
      ? await authPool.query('SELECT id FROM "account" WHERE "userId" = $1', [clinic.owner_id])
      : { rows: [] };
    const db = Database.getInstance();
    const hasDoctors = db.state.doctors.length > 0;
    const hasServices = db.state.services.length > 0;

    const checklist = {
      ownerActivated: accountCheck.rows.length > 0,
      profileConfigured: Boolean(clinic.address && clinic.phone),
      doctorsConfigured: hasDoctors,
      servicesConfigured: hasServices,
      workingHoursConfigured: Boolean(clinic.hours && clinic.hours.length > 0),
      readyForLaunch:
        accountCheck.rows.length > 0 &&
        hasDoctors &&
        hasServices &&
        clinic.onboarding_status === 'READY',
    };

    res.json({
      success: true,
      data: {
        clinic,
        checklist,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch clinic details' },
    });
  }
});

// PATCH /api/v1/internal/clinics/:id/onboarding-status — Advance stage
router.patch('/clinics/:id/onboarding-status', async (req: Request, res: Response): Promise<void> => {
  const parsed = updateOnboardingStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: parsed.error.errors[0]?.message },
    });
    return;
  }

  const newStatus = parsed.data.status;
  if (newStatus === 'LIVE') {
    res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_TRANSITION',
        message: 'Direct promotion to LIVE is prohibited. Use the dedicated /launch endpoint.',
      },
    });
    return;
  }

  try {
    const result = await authPool.query(
      `UPDATE clinics SET onboarding_status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [newStatus, req.params.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Clinic not found' } });
      return;
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to update status' } });
  }
});

// POST /api/v1/internal/clinics/:id/launch — Pre-flight verified Launch Gate
router.post('/clinics/:id/launch', async (req: Request, res: Response): Promise<void> => {
  try {
    const clinicRes = await authPool.query(
      `SELECT c.*, u.id as owner_id FROM clinics c LEFT JOIN "user" u ON u."clinicId" = c.id WHERE c.id = $1`,
      [req.params.id]
    );

    if (clinicRes.rows.length === 0) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Clinic not found' } });
      return;
    }

    const clinic = clinicRes.rows[0];

    // Preflight checks
    const db = Database.getInstance();
    const hasDoctors = db.state.doctors.length > 0;
    const hasServices = db.state.services.length > 0;

    if (!hasDoctors || !hasServices) {
      res.status(400).json({
        success: false,
        error: {
          code: 'PREFLIGHT_FAILED',
          message: 'Cannot launch clinic without at least one doctor and one treatment service configured.',
        },
      });
      return;
    }

    const client = await authPool.connect();
    try {
      await client.query('BEGIN');

      // Promote clinic to LIVE
      const updatedClinic = await client.query(
        `UPDATE clinics SET onboarding_status = 'LIVE', status = 'ACTIVE', updated_at = NOW() WHERE id = $1 RETURNING *`,
        [clinic.id]
      );

      // If linked to demo request, mark CONVERTED
      if (clinic.source_demo_request_id) {
        await client.query(
          `UPDATE demo_requests SET status = 'CONVERTED', updated_at = NOW() WHERE id = $1`,
          [clinic.source_demo_request_id]
        );
      }

      await client.query('COMMIT');

      res.json({
        success: true,
        message: `🎉 Clinic ${clinic.name} has been successfully launched live!`,
        data: updatedClinic.rows[0],
      });
    } catch (txErr) {
      await client.query('ROLLBACK');
      throw txErr;
    } finally {
      client.release();
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'LAUNCH_FAILED', message: err.message || 'Failed to launch clinic' },
    });
  }
});

// PATCH /api/v1/internal/clinics/:id/status — Suspend or reactivate clinic
router.patch('/clinics/:id/status', async (req: Request, res: Response): Promise<void> => {
  const { status } = req.body;
  if (!['ACTIVE', 'SUSPENDED', 'ARCHIVED'].includes(status)) {
    res.status(400).json({ success: false, error: { code: 'INVALID_STATUS', message: 'Status must be ACTIVE, SUSPENDED, or ARCHIVED' } });
    return;
  }

  try {
    const result = await authPool.query(
      `UPDATE clinics SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Clinic not found' } });
      return;
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to update status' } });
  }
});

export default router;
