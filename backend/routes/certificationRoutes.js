import { Router } from 'express';
import { getCertifications, createCertification, deleteCertification } from '../controllers/certificationController.js';
import { protect } from '../middleware/auth.js';
import { certificationValidation, validate } from '../middleware/validation.js';

const router = Router();
router.get('/', getCertifications);
router.post('/', protect, certificationValidation, validate, createCertification);
router.delete('/:id', protect, deleteCertification);
export default router;
