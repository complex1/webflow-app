import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/api/register', userController.register);
router.post('/api/login', userController.login);

// Protected routes
router.get('/api/user', authMiddleware, userController.getUser);
router.put('/api/user/avatar', authMiddleware, userController.updateAvatar);

export default router;