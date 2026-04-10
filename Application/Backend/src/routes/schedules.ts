import { Router } from 'express';
import {
  createWebFlowSchedule,
  deleteWebFlowSchedule,
  getWebFlowScheduleById,
  listScheduleExecutions,
  listWebFlowSchedules,
  updateWebFlowSchedule,
} from '../controllers/webFlowScheduleController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', listWebFlowSchedules);
router.post('/', createWebFlowSchedule);
router.get('/:id/executions', listScheduleExecutions);
router.get('/:id', getWebFlowScheduleById);
router.put('/:id', updateWebFlowSchedule);
router.delete('/:id', deleteWebFlowSchedule);

export default router;
