import { Router } from 'express';
import {
  uploadFile,
  getFiles,
  getFileById,
  deleteFile,
  downloadFile,
  upload,
} from '../controllers/fileController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/upload', upload.single('file'), uploadFile);
router.get('/', getFiles);
router.get('/:id', getFileById);
router.get('/:id/download', downloadFile);
router.delete('/:id', deleteFile);

export default router;

