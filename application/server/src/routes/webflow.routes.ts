import { Router } from 'express';
import { WebflowController } from '../controllers/webflow.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const webflowController = new WebflowController();

// Apply authentication middleware to all routes
router.use(authMiddleware.verifyToken);

// GET all webflows
router.get('/', webflowController.getAllWebflows);

// GET webflows for current user
router.get('/my', webflowController.getUserWebflows);

// GET webflows by tags
router.get('/tags', webflowController.getWebflowsByTags);

// GET a specific webflow by ID
router.get('/:id', webflowController.getWebflowById);

// CREATE a new webflow
router.post('/', webflowController.createWebflow);

// UPDATE an existing webflow
router.put('/:id', webflowController.updateWebflow);

// DELETE a webflow
router.delete('/:id', webflowController.deleteWebflow);

export default router;
