import { Router } from 'express';
import userRoutes from './user.routes';
import webflowRoutes from './webflow.routes';

const router = Router();

// Mount routes
router.use('/users', userRoutes);
router.use('/webflows', webflowRoutes);

export default router;