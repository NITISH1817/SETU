import { Router } from 'express';
import { getCitizenIncomeXml, updateRevenueRecord, getAllRevenueRecords } from '../controllers/revenueController';

const router = Router();

// Legacy GET endpoint returning XML
router.get('/citizen/:id/income', getCitizenIncomeXml);

// Revenue Officer Management endpoints
router.put('/citizen/:id/income', updateRevenueRecord);
router.get('/records', getAllRevenueRecords);

export default router;
