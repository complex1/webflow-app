import { Request, Response } from 'express';
import WebFlow from '../../models/WebFlow';
import EnvFile from '../../models/EnvFile';
import EnvConfig from '../../models/EnvConfig';
import WebFlowEnvFile from '../../models/WebFlowEnvFile';

/**
 * @swagger
 * /api/web-flows/{id}/hierarchy:
 *   get:
 *     summary: Get web flow hierarchy from root to specified folder
 *     tags: [WebFlows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The web flow ID to get hierarchy for
 *     responses:
 *       200:
 *         description: Hierarchy data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hierarchy:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Web flow ID
 *                       name:
 *                         type: string
 *                         description: Web flow name
 *                       icon:
 *                         type: string
 *                         description: Web flow icon
 *                       isFolder:
 *                         type: boolean
 *                         description: Whether this is a folder
 *                       parentId:
 *                         type: integer
 *                         nullable: true
 *                         description: Parent web flow ID
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Creation timestamp
 *                 targetId:
 *                   type: string
 *                   description: The target web flow ID
 *                 totalLevels:
 *                   type: integer
 *                   description: Total number of levels in hierarchy
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
export const getWebFlowHierarchy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // First, verify the target web flow exists and belongs to the user
    const targetWebFlow = await WebFlow.findOne({
      where: { id, userId },
    });

    if (!targetWebFlow) {
      return res.status(404).json({ error: 'Web flow not found' });
    }

    // Build hierarchy path from root to target
    const hierarchy: any[] = [];
    let currentWebFlow = targetWebFlow;

    // Traverse up the hierarchy until we reach the root (parentId is null)
    while (currentWebFlow) {
      hierarchy.unshift({
        id: currentWebFlow.id,
        name: currentWebFlow.name,
        icon: currentWebFlow.icon,
        isFolder: currentWebFlow.isFolder,
        parentId: currentWebFlow.parentId,
        createdAt: currentWebFlow.createdAt,
      });

      // If we've reached the root (no parent), break
      if (!currentWebFlow.parentId) {
        break;
      }

      // Find the parent web flow
      const parentWebFlow = await WebFlow.findOne({
        where: { id: currentWebFlow.parentId, userId },
      });

      // Safety check: if parent doesn't exist or doesn't belong to user, break
      if (!parentWebFlow) {
        break;
      }

      currentWebFlow = parentWebFlow;
    }

    // In development, always return fresh data with no caching
    if (process.env.NODE_ENV === 'development') {
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate, private',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
    }

    res.json({
      hierarchy,
      targetId: id,
      totalLevels: hierarchy.length,
    });
  } catch (error) {
    console.error('Get web flow hierarchy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * @swagger
 * /api/web-flows/{id}/env-files:
 *   get:
 *     summary: Get all environment files linked to a web flow
 *     tags: [WebFlows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The web flow ID to get linked environment files for
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Linked environment files retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 envFiles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Environment file ID
 *                       name:
 *                         type: string
 *                         description: Environment file name
 *                       description:
 *                         type: string
 *                         description: Environment file description
 *                       configs:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             key:
 *                               type: string
 *                             value:
 *                               type: string
 *                             description:
 *                               type: string
 *                       userId:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       linkId:
 *                         type: integer
 *                         description: The WebFlowEnvFile link ID
 *                       linkedAt:
 *                         type: string
 *                         format: date-time
 *                         description: When the file was linked to this webflow
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
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
export const getWebFlowEnvFiles = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // First, verify the web flow exists and belongs to the user
    const webFlow = await WebFlow.findOne({
      where: { id, userId },
    });

    if (!webFlow) {
      return res.status(404).json({ error: 'Web flow not found' });
    }

    // Get all links for this webflow with pagination
    const { count, rows: links } = await WebFlowEnvFile.findAndCountAll({
      where: { webFlowId: id, userId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: EnvFile,
          as: 'envFile',
          include: [
            {
              model: EnvConfig,
              as: 'configs',
            },
          ],
        },
      ],
    });

    // Format the response to include both env file data and link metadata
    const envFiles = links.map(link => {
      const linkData = link as any; // Type assertion for the include relationship
      return {
        ...linkData.envFile.toJSON(),
        linkId: link.id,
        linkedAt: link.createdAt,
      };
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
      envFiles,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Get web flow env files error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
