import { Router } from 'express';
import { UploadController } from '../controllers/uploadController';
import { ReportController } from '../controllers/reportController';

const router = Router();

router.post('/upload', UploadController.uploadCSV);
router.get('/reports/payroll', ReportController.getPayrollReport);

export default router;
