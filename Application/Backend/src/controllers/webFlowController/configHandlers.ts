import { Request, Response } from 'express';
import WebFlow from '../../models/WebFlow';
import WebFlowConfig from '../../models/WebFlowConfig';

/**
 * @swagger
 * /api/web-flows/{id}/config:
 *   get:
 *     summary: Get web flow configuration
 *     tags: [WebFlows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The web flow ID to get configuration for
 *     responses:
 *       200:
 *         description: Configuration retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 config:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     webFlowId:
 *                       type: integer
 *                     nodes:
 *                       type: array
 *                     edges:
 *                       type: array
 *                     userId:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Web flow or configuration not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Web flow configuration not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export const getWebFlowConfig = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // First, verify the web flow exists and belongs to the user
    const webFlow = await WebFlow.findOne({
      where: { id, userId },
    });

    if (!webFlow) {
      return res.status(404).json({ error: 'Web flow not found' });
    }

    // Find the config
    const config = await WebFlowConfig.findOne({
      where: { webFlowId: id, userId },
    });

    if (!config) {
      return res.status(404).json({ error: 'Web flow configuration not found' });
    }

    // In development, always return fresh data with no caching
    if (process.env.NODE_ENV === 'development') {
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate, private',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
    }

    res.json({ config });
  } catch (error) {
    console.error('Get web flow config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * @swagger
 * /api/web-flows/{id}/config:
 *   put:
 *     summary: Update web flow configuration
 *     tags: [WebFlows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The web flow ID to update configuration for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nodes:
 *                 type: array
 *                 description: Array of flow nodes
 *                 items:
 *                   type: object
 *               edges:
 *                 type: array
 *                 description: Array of flow edges
 *                 items:
 *                   type: object
 *             required:
 *               - nodes
 *               - edges
 *     responses:
 *       200:
 *         description: Configuration updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Web flow configuration updated successfully
 *                 config:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     webFlowId:
 *                       type: integer
 *                     nodes:
 *                       type: array
 *                     edges:
 *                       type: array
 *                     userId:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Web flow not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Web flow not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export const updateWebFlowConfig = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nodes, edges } = req.body;
    const userId = req.user!.id;

    // First, verify the web flow exists and belongs to the user
    const webFlow = await WebFlow.findOne({
      where: { id, userId },
    });

    if (!webFlow) {
      return res.status(404).json({ error: 'Web flow not found' });
    }

    // Find and update the config
    const config = await WebFlowConfig.findOne({
      where: { webFlowId: id, userId },
    });

    if (!config) {
      return res.status(404).json({ error: 'Web flow configuration not found' });
    }

    // Update the configuration
    await config.update({
      nodes: nodes || [],
      edges: edges || [],
    });

    // In development, always return fresh data with no caching
    if (process.env.NODE_ENV === 'development') {
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate, private',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
    }

    res.json({
      message: 'Web flow configuration updated successfully',
      config,
    });
  } catch (error) {
    console.error('Update web flow config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
