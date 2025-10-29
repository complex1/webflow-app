import { Router } from 'express';
import {
  createWebFlow,
  getWebFlows,
  getWebFlowById,
  getWebFlowHierarchy,
  getWebFlowEnvFiles,
  getWebFlowOpenApiDocs,
  updateWebFlow,
  getWebFlowConfig,
  updateWebFlowConfig,
  deleteWebFlow,
  linkEnvFile,
  unlinkEnvFile,
} from '../controllers/webFlowController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/', createWebFlow);
router.get('/', getWebFlows);
router.get('/:id/hierarchy', getWebFlowHierarchy);
router.get('/:id/env-files', getWebFlowEnvFiles);
router.get('/:id/openapi-docs', getWebFlowOpenApiDocs);
router.get('/:id/config', getWebFlowConfig);
router.get('/:id', getWebFlowById);
router.put('/:id', updateWebFlow);
router.put('/:id/config', updateWebFlowConfig);
router.delete('/:id', deleteWebFlow);
router.post('/link-env', linkEnvFile);
router.delete('/:webFlowId/env-files/:envFileId', unlinkEnvFile);

export default router;

