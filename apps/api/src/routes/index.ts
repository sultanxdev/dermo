import { Router } from 'express';
import clinicRoutes from './clinicRoutes';
import doctorRoutes from './doctorRoutes';
import serviceRoutes from './serviceRoutes';
import appointmentRoutes from './appointmentRoutes';
import leadRoutes from './leadRoutes';
import conversationRoutes from './conversationRoutes';
import knowledgeRoutes from './knowledgeRoutes';
import paymentRoutes from './paymentRoutes';
import whatsappRoutes from './whatsappRoutes';
import analyticsRoutes from './analyticsRoutes';
import auditRoutes from './auditRoutes';
import demoRequestRoutes from './demoRequestRoutes';
import internalRoutes from './internalRoutes';
import { requireAuth, requireClinicOwner } from '../middleware/requireAuth';

const router = Router();

// Public / Webhook routes
router.use('/', whatsappRoutes);
router.use('/demo-requests', demoRequestRoutes);

// Internal Team operations routes
router.use('/internal', internalRoutes);

// Clinic Owner protected routes — single-tenant context with active clinic enforcement
router.use('/clinic', requireAuth, requireClinicOwner, clinicRoutes);
router.use('/doctors', requireAuth, requireClinicOwner, doctorRoutes);
router.use('/services', requireAuth, requireClinicOwner, serviceRoutes);
router.use('/appointments', requireAuth, requireClinicOwner, appointmentRoutes);
router.use('/leads', requireAuth, requireClinicOwner, leadRoutes);
router.use('/conversations', requireAuth, requireClinicOwner, conversationRoutes);
router.use('/knowledge', requireAuth, requireClinicOwner, knowledgeRoutes);
router.use('/', requireAuth, requireClinicOwner, knowledgeRoutes); // For /faqs
router.use('/payments', requireAuth, requireClinicOwner, paymentRoutes);
router.use('/analytics', requireAuth, requireClinicOwner, analyticsRoutes);
router.use('/audit-logs', requireAuth, requireClinicOwner, auditRoutes);

export default router;
