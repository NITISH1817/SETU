import { Router } from 'express';
import {
  verifyIncomeInteroperability,
  getInteroperabilityPipelineDemo
} from '../controllers/interoperabilityController';
import { authenticateJwt } from '../middleware/auth';
import { verifyCitizenConsent } from '../middleware/consentVerifier';

const router = Router();

// Endpoint: POST /api/income/verify (Requires JWT & active consent check)
router.post('/verify', authenticateJwt, verifyCitizenConsent, verifyIncomeInteroperability);

// Interoperability Monitor visual pipeline endpoint
router.get('/demo-flow/:citizenId', authenticateJwt, getInteroperabilityPipelineDemo);

export default router;
