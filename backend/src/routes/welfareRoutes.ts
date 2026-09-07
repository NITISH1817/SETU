import { Router } from 'express';
import { getWelfareApplications, updateOfficerDecision, disburseBenefit, createScheme } from '../controllers/welfareController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.use(authenticateJwt);

router.get('/applications', getWelfareApplications);
router.put('/applications/:id/decision', updateOfficerDecision);
router.post('/applications/:id/disburse', disburseBenefit);
router.post('/schemes', createScheme);

export default router;
