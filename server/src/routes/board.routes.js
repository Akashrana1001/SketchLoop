import { Router } from 'express';

import {
    createBoardController,
    getBoardController,
    listBoardsController,
    saveSnapshotController,
} from '../controllers/board.controller.js';
import { requireAuth } from '../middleware/authenticate.js';

const router = Router();

router.use(requireAuth);

router.get('/boards', listBoardsController);
router.post('/boards', createBoardController);
router.get('/boards/:roomId', getBoardController);
router.post('/boards/:roomId/snapshot', saveSnapshotController);

export default router;
