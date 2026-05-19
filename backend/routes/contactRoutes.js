import { Router } from 'express';
import { submitContact } from '../controllers/contactController.js';
import { contactValidation, validate } from '../middleware/validation.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = Router();
router.post('/', contactLimiter, contactValidation, validate, submitContact);
export default router;
