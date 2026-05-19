import { Router } from 'express';
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';
import { projectValidation, idParam, validate } from '../middleware/validation.js';

const router = Router();
router.get('/', getProjects);
router.post('/', protect, projectValidation, validate, createProject);
router.put('/:id', protect, idParam, validate, updateProject);
router.delete('/:id', protect, idParam, validate, deleteProject);
export default router;
