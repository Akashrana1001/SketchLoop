import { Router } from 'express';

import { env } from '../config/env.js';

const router = Router();

router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        environment: env.nodeEnv,
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] ?? null,
    });
});

export default router;
