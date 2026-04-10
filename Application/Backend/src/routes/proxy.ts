import { Router } from 'express';
import { executeProxyRequest } from '../controllers/proxyController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /proxy:
 *   post:
 *     summary: Execute a proxy request using axios configuration
 *     tags: [Proxy]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 description: The target URL for the request
 *                 example: "https://api.example.com/data"
 *               method:
 *                 type: string
 *                 description: HTTP method
 *                 example: "GET"
 *                 default: "GET"
 *               headers:
 *                 type: object
 *                 description: Request headers
 *                 example:
 *                   Content-Type: "application/json"
 *                   Authorization: "Bearer token"
 *               data:
 *                 type: object
 *                 description: Request body data
 *               params:
 *                 type: object
 *                 description: URL parameters
 *               timeout:
 *                 type: number
 *                 description: Request timeout in milliseconds
 *                 example: 5000
 *               responseType:
 *                 type: string
 *                 description: Response data type
 *                 example: "json"
 *           example:
 *             url: "https://jsonplaceholder.typicode.com/posts/1"
 *             method: "GET"
 *             headers:
 *               Content-Type: "application/json"
 *     responses:
 *       200:
 *         description: Successful proxy request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: number
 *                   example: 200
 *                 statusText:
 *                   type: string
 *                   example: "OK"
 *                 headers:
 *                   type: object
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request - missing URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "URL is required in the axios config"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.post('/', authenticateToken, executeProxyRequest);

export default router;
