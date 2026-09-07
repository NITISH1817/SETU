import { Router } from 'express';
import {
  getAdminMetrics,
  getAuditLogs,
  getRules,
  createOrUpdateRule
} from '../controllers/adminController';
import { authenticateJwt } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';
import { UserRole } from '../types';

const router = Router();

router.use(authenticateJwt);
router.use(authorizeRoles(UserRole.ADMIN));

router.get('/metrics', getAdminMetrics);
router.get('/audit-logs', getAuditLogs);
router.get('/rules', getRules);
router.post('/rules', createOrUpdateRule);

export default router;
