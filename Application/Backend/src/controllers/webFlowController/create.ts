import { Request, Response } from 'express';
import WebFlow from '../../models/WebFlow';
import WebFlowConfig from '../../models/WebFlowConfig';
import { ensureParentOwnership } from './shared';

export const createWebFlow = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      icon,
      tags,
      isFolder,
      hasOpenApiConfig,
      openApiConfigType,
      openApiServerUrl,
      openApiFileId,
      hasPostmanCollection,
      postmanFileId,
      basePath,
      parentId,
    } = req.body;
    const userId = req.user!.id;

    await ensureParentOwnership(parentId, userId);

    const webFlow = await WebFlow.create({
      name,
      description,
      icon: icon || 'fas fa-folder',
      tags: tags || [],
      isFolder: isFolder || false,
      hasOpenApiConfig: hasOpenApiConfig || false,
      openApiConfigType,
      openApiServerUrl,
      openApiFileId,
      hasPostmanCollection: hasPostmanCollection || false,
      postmanFileId,
      basePath,
      parentId,
      userId,
    });

    // Create associated WebFlowConfig with empty nodes and edges
    await WebFlowConfig.create({
      webFlowId: webFlow.id,
      nodes: [],
      edges: [],
      userId,
    });

    res.status(201).json({
      message: 'Web flow created successfully',
      webFlow,
    });
  } catch (error: any) {
    if (error?.message === 'PARENT_NOT_FOUND') {
      return res.status(400).json({ error: 'Parent folder not found' });
    }
    console.error('Create web flow error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * @swagger
 * /api/web-flows/import:
 *   post:
 *     summary: Create a web flow from imported file data
 *     tags: [WebFlows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the web flow
 *                 example: "My Imported Web Flow"
 *               description:
 *                 type: string
 *                 description: Description of the web flow
 *                 example: "A web flow imported from a JSON file"
 *               basePath:
 *                 type: string
 *                 description: Base path for the web flow
 *                 example: "/api/v1"
 *               isFolder:
 *                 type: boolean
 *                 description: Whether this is a folder
 *                 default: false
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of tags
 *                 example: ["api", "imported"]
 *               playgroundConfig:
 *                 type: object
 *                 properties:
 *                   nodes:
 *                     type: array
 *                     items:
 *                       type: object
 *                     description: Array of flow nodes
 *                   edges:
 *                     type: array
 *                     items:
 *                       type: object
 *                     description: Array of flow edges
 *                 required:
 *                   - nodes
 *                   - edges
 *               parentId:
 *                 type: integer
 *                 nullable: true
 *                 description: Parent folder ID
 *             required:
 *               - name
 *               - playgroundConfig
 *     responses:
 *       201:
 *         description: Web flow created from import successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Web flow created from import successfully
 *                 webFlow:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     basePath:
 *                       type: string
 *                     isFolder:
 *                       type: boolean
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                     config:
 *                       type: object
 *                       properties:
 *                         nodes:
 *                           type: array
 *                         edges:
 *                           type: array
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid playground configuration. Must contain nodes and edges arrays
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export const createWebFlowFromImport = async (req: Request, res: Response) => {
  try {
    const {
      basePath,
      description,
      isFolder,
      name,
      playgroundConfig,
      tags,
      parentId
    } = req.body;
    const userId = req.user!.id;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (!playgroundConfig || !Array.isArray(playgroundConfig.nodes) || !Array.isArray(playgroundConfig.edges)) {
      return res.status(400).json({ error: 'Invalid playground configuration. Must contain nodes and edges arrays' });
    }

    await ensureParentOwnership(parentId, userId);

    // Create the webflow
    const webFlow = await WebFlow.create({
      name,
      description: description || '',
      icon: isFolder ? 'fas fa-folder' : 'fas fa-project-diagram',
      tags: Array.isArray(tags) ? tags : [],
      isFolder: isFolder || false,
      hasOpenApiConfig: false,
      hasPostmanCollection: false,
      basePath: basePath || '',
      parentId: parentId || null,
      userId,
    });

    // Create associated WebFlowConfig with imported nodes and edges
    const config = await WebFlowConfig.create({
      webFlowId: webFlow.id,
      nodes: playgroundConfig.nodes,
      edges: playgroundConfig.edges,
      userId,
    });

    // In development, always return fresh data with no caching
    if (process.env.NODE_ENV === 'development') {
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate, private',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
    }

    res.status(201).json({
      message: 'Web flow created from import successfully',
      webFlow: {
        ...webFlow.toJSON(),
        config: config.toJSON()
      },
    });
  } catch (error: any) {
    if (error?.message === 'PARENT_NOT_FOUND') {
      return res.status(400).json({ error: 'Parent folder not found' });
    }
    console.error('Create web flow from import error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
