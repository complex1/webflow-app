import { Router } from 'express';
import userRoutes from './user.routes';
import webflowRoutes from './webflow.routes';
import proxyRoutes from './proxy.routes';
import { userController } from '../controllers/user.controller';
import { googleAuthController } from '../controllers/google-auth.controller';
import { exampleRoutes } from './example.routes';

const router = Router();

// Authentication routes at the root level
router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/auth/google', googleAuthController.googleLogin);

// Mount other routes
router.use('/users', userRoutes);
router.use('/webflows', webflowRoutes);
router.use('/proxy', proxyRoutes);
router.use('/example', exampleRoutes)

export default router;