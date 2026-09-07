import { Router } from 'express';
import {
  grantConsent,
  revokeConsent,
  getConsents,
  getNotifications,
  markNotificationRead
} from '../controllers/citizenController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.use(authenticateJwt);

router.post('/consent', grantConsent);
router.delete('/consent/:consentId?', revokeConsent);
router.post('/consent/revoke', revokeConsent);
router.get('/consents', getConsents);

router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);

export default router;
