import { Router } from 'express';
import {
  createWebFlow,
  createWebFlowFromImport,
  getWebFlows,
  getWebFlowById,
  getWebFlowHierarchy,
  getWebFlowEnvFiles,
  getWebFlowOpenApiDocs,
  updateWebFlow,
  getWebFlowConfig,
  updateWebFlowConfig,
  getWebFlowShare,
  updateWebFlowShare,
  deleteWebFlow,
  linkEnvFile,
  unlinkEnvFile,
} from '../controllers/webFlowController';
import {
  startWebFlowExecution,
  listWebFlowExecutions,
  getWebFlowExecutionById,
} from '../controllers/webFlowExecutionController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/', createWebFlow);
router.post('/import', createWebFlowFromImport);
router.get('/', getWebFlows);
router.get('/:id/hierarchy', getWebFlowHierarchy);
router.get('/:id/env-files', getWebFlowEnvFiles);
router.get('/:id/openapi-docs', getWebFlowOpenApiDocs);
router.get('/:id/config', getWebFlowConfig);
router.get('/:id/share', getWebFlowShare);
router.put('/:id/share', updateWebFlowShare);
router.post('/:id/execute', startWebFlowExecution);
router.get('/:id/executions', listWebFlowExecutions);
router.get('/:id/executions/:executionId', getWebFlowExecutionById);
router.get('/:id', getWebFlowById);
router.put('/:id', updateWebFlow);
router.put('/:id/config', updateWebFlowConfig);
router.delete('/:id', deleteWebFlow);
router.post('/link-env', linkEnvFile);
router.delete('/:webFlowId/env-files/:envFileId', unlinkEnvFile);

export default router;

