import { Router } from 'express';
import { login } from '../controllers/authController.js';
import { loginValidation, validate } from '../middleware/validation.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();
router.post('/login', authLimiter, loginValidation, validate, login);
export default router;
