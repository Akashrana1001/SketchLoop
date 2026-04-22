import { Router } from 'express';

import {
    forgotPasswordController,
    loginController,
    logoutController,
    meController,
    registerController,
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/authenticate.js';

const router = Router();

router.post('/auth/register', registerController);
router.post('/auth/login', loginController);
router.post('/auth/forgot-password', forgotPasswordController);
router.get('/auth/me', requireAuth, meController);
router.post('/auth/logout', requireAuth, logoutController);

export default router;
