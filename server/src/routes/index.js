import { Router } from 'express';

import authRoutes from './auth.routes.js';
import boardRoutes from './board.routes.js';
import healthRoutes from './health.routes.js';

const router = Router();

router.use(healthRoutes);
router.use(authRoutes);
router.use(boardRoutes);

export default router;
