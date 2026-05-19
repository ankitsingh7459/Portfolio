import { body, param, validationResult } from 'express-validator';
import { AppError } from './errorHandler.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }
  next();
};

export const contactValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters'),
];

export const projectValidation = [
  body('title').trim().isLength({ min: 2, max: 255 }).withMessage('Title required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description required'),
  body('tech_stack').optional().isArray(),
  body('techStack').optional().isArray(),
];

export const certificationValidation = [
  body('title').trim().isLength({ min: 2, max: 255 }),
  body('provider').trim().isLength({ min: 2, max: 255 }),
  body('issue_date').optional().isISO8601(),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
];

export const idParam = [param('id').isInt({ min: 1 }).withMessage('Invalid ID')];
