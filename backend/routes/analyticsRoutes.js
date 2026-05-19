import { Router } from 'express';
import { trackVisit, getAnalytics, getGitHubActivity } from '../controllers/analyticsController.js';

const router = Router();
router.post('/track', trackVisit);
router.get('/stats', getAnalytics);
router.get('/github', getGitHubActivity);
export default router;
