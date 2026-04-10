import { Router } from 'express';
import { getPublicWebFlowByShareToken } from '../controllers/publicWebFlowController';

const router = Router();

router.get('/share/:token', getPublicWebFlowByShareToken);

export default router;
