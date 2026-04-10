import { Router } from 'express';
import {
  createEnvFile,
  getEnvFiles,
  getEnvFileById,
  updateEnvFile,
  deleteEnvFile,
} from '../controllers/envFileController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /env-files:
 *   post:
 *     summary: Create a new environment file
 *     tags: [Environment Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 description: Environment file name
 *                 example: Production Environment
 *               description:
 *                 type: string
 *                 description: Environment file description
 *                 example: Production environment configuration
 *               configs:
 *                 type: array
 *                 description: Environment configurations
 *                 items:
 *                   type: object
 *                   properties:
 *                     key:
 *                       type: string
 *                       description: Configuration key
 *                       example: API_URL
 *                     description:
 *                       type: string
 *                       description: Configuration description
 *                       example: Base API URL
 *                     value:
 *                       type: string
 *                       description: Configuration value
 *                       example: https://api.example.com
 *     responses:
 *       201:
 *         description: Environment file created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Environment file created successfully
 *                 envFile:
 *                   $ref: '#/components/schemas/EnvFile'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createEnvFile);

/**
 * @swagger
 * /env-files:
 *   get:
 *     summary: Get all environment files for the authenticated user
 *     tags: [Environment Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Environment files retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 envFiles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EnvFile'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getEnvFiles);

/**
 * @swagger
 * /env-files/{id}:
 *   get:
 *     summary: Get a specific environment file by ID
 *     tags: [Environment Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Environment file ID
 *     responses:
 *       200:
 *         description: Environment file retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 envFile:
 *                   $ref: '#/components/schemas/EnvFile'
 *       404:
 *         description: Environment file not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Environment file not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getEnvFileById);

/**
 * @swagger
 * /env-files/{id}:
 *   put:
 *     summary: Update an environment file
 *     tags: [Environment Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Environment file ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 description: Environment file name
 *                 example: Updated Production Environment
 *               description:
 *                 type: string
 *                 description: Environment file description
 *                 example: Updated production environment configuration
 *               configs:
 *                 type: array
 *                 description: Environment configurations
 *                 items:
 *                   type: object
 *                   properties:
 *                     key:
 *                       type: string
 *                       description: Configuration key
 *                       example: API_URL
 *                     description:
 *                       type: string
 *                       description: Configuration description
 *                       example: Base API URL
 *                     value:
 *                       type: string
 *                       description: Configuration value
 *                       example: https://api.example.com
 *     responses:
 *       200:
 *         description: Environment file updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Environment file updated successfully
 *                 envFile:
 *                   $ref: '#/components/schemas/EnvFile'
 *       404:
 *         description: Environment file not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Environment file not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', updateEnvFile);

/**
 * @swagger
 * /env-files/{id}:
 *   delete:
 *     summary: Delete an environment file
 *     tags: [Environment Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Environment file ID
 *     responses:
 *       200:
 *         description: Environment file deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Environment file deleted successfully
 *       404:
 *         description: Environment file not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Environment file not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', deleteEnvFile);

export default router;

