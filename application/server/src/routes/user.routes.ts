import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { googleAuthController } from '../controllers/google-auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/auth/google', googleAuthController.googleLogin);

// Protected routes
router.get('/user', authMiddleware.verifyToken, userController.getUser);
router.put('/user/avatar', authMiddleware.verifyToken, userController.updateAvatar);

export default router;