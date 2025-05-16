import { Router } from 'express';
import userRoutes from './user.routes';

const router = Router();

// Mount routes
router.use('/', userRoutes);

export default router;