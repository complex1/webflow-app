import express from 'express';
import { proxyController } from '../controllers/proxy.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @route POST /api/proxy
 * @description Proxy API request through the server
 * @access Private - requires authentication token
 */
router.post('/', authMiddleware.verifyToken, proxyController.handleProxyRequest);

export default router;
