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
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

// Public / Webhook routes
router.use('/', whatsappRoutes);

// Protected routes — authenticated identity, single-tenant context
router.use('/clinic', requireAuth, clinicRoutes);
router.use('/doctors', requireAuth, doctorRoutes);
router.use('/services', requireAuth, serviceRoutes);
router.use('/appointments', requireAuth, appointmentRoutes);
router.use('/leads', requireAuth, leadRoutes);
router.use('/conversations', requireAuth, conversationRoutes);
router.use('/knowledge', requireAuth, knowledgeRoutes);
router.use('/', requireAuth, knowledgeRoutes); // For /faqs
router.use('/payments', requireAuth, paymentRoutes);
router.use('/analytics', requireAuth, analyticsRoutes);
router.use('/audit-logs', requireAuth, auditRoutes);

export default router;
