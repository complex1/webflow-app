import { Router } from 'express';
import userRoutes from './user.routes';
import webflowRoutes from './webflow.routes';
import { userController } from '../controllers/user.controller';

const router = Router();

// Authentication routes at the root level
router.post('/login', userController.login);
router.post('/register', userController.register);

// Mount other routes
router.use('/users', userRoutes);
router.use('/webflows', webflowRoutes);

export default router;