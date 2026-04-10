import { Router } from 'express';
import { executePlaygroundProxyRequest } from '../controllers/proxyPlaygroundController';

const router = Router();

router.post('/', executePlaygroundProxyRequest);

export default router;
