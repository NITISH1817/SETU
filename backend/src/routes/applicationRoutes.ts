import { Router } from 'express';
import {
  createApplication,
  getApplications,
  getApplicationById,
  getSchemes
} from '../controllers/applicationController';
import { authenticateJwt } from '../middleware/auth';

const router = Router();

router.use(authenticateJwt);

router.get('/schemes', getSchemes);
router.post('/', createApplication);
router.get('/', getApplications);
router.get('/:id', getApplicationById);

export default router;
