import { Router, Request, Response } from 'express';
import { authPool } from '../auth';
import { createDemoRequestSchema } from '@dermo/schemas';
import { requireAuth, requireInternalTeam } from '../middleware/requireAuth';

const router = Router();

// POST /api/v1/demo-requests (Public)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = createDemoRequestSchema.safeParse(req.body);
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

    const { name, clinicName, email, phone, clinicType, doctorCount, city, requirements } = parsed.data;
    const id = `demo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const result = await authPool.query(
      `INSERT INTO demo_requests (id, name, clinic_name, email, phone, clinic_type, doctor_count, city, requirements, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'NEW')
       RETURNING *`,
      [id, name, clinicName, email, phone, clinicType || null, doctorCount || 1, city || null, requirements || null]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to record demo request',
      },
    });
  }
});

// GET /api/v1/internal/demo-requests (Internal Team Only)
router.get('/internal/demo-requests', requireAuth, requireInternalTeam, async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await authPool.query(
      `SELECT * FROM demo_requests ORDER BY created_at DESC`
    );
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch demo requests',
      },
    });
  }
});

export default router;
