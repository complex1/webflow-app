import { Router } from 'express';
import userRoutes from './user.routes';
import webflowRoutes from './webflow.routes';
import proxyRoutes from './proxy.routes';
import { userController } from '../controllers/user.controller';
import { googleAuthController } from '../controllers/google-auth.controller';

const router = Router();

// Authentication routes at the root level
router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/auth/google', googleAuthController.googleLogin);

// Mount other routes
router.use('/users', userRoutes);
router.use('/webflows', webflowRoutes);
router.use('/proxy', proxyRoutes);

export default router;