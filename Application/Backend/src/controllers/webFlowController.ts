import { Request, Response } from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import WebFlow from '../models/WebFlow';
import EnvFile from '../models/EnvFile';
import EnvConfig from '../models/EnvConfig';
import WebFlowConfig from '../models/WebFlowConfig';
import WebFlowEnvFile from '../models/WebFlowEnvFile';
import File from '../models/File';
import { extractApiList } from '../utils/openApiPreprocess';

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
    const userId = (req as any).user.id;

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
  } catch (error) {
    console.error('Create web flow error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getWebFlows = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const parentId = req.query.parentId !== undefined ? parseInt(req.query.parentId as string) : undefined;
    const offset = (page - 1) * limit;

    const whereClause: any = { userId };
    if (parentId !== undefined) {
      whereClause.parentId = parentId;
    }

    const { count, rows } = await WebFlow.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
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
      webFlows: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Get web flows error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getWebFlowById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const webFlow = await WebFlow.findOne({
      where: { id, userId },
      include: [
        {
          model: EnvFile,
          as: 'envFiles',
          through: { attributes: [] },
        },
      ],
    });

    if (!webFlow) {
      return res.status(404).json({ error: 'Web flow not found' });
    }

    res.json({ webFlow });
  } catch (error) {
    console.error('Get web flow by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateWebFlow = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
    } = req.body;
    const userId = (req as any).user.id;

    const webFlow = await WebFlow.findOne({
      where: { id, userId },
    });

    if (!webFlow) {
      return res.status(404).json({ error: 'Web flow not found' });
    }

    await webFlow.update({
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
    });

    res.json({
      message: 'Web flow updated successfully',
      webFlow,
    });
  } catch (error) {
    console.error('Update web flow error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteWebFlow = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const webFlow = await WebFlow.findOne({
      where: { id, userId },
    });

    if (!webFlow) {
      return res.status(404).json({ error: 'Web flow not found' });
    }

    // Delete associated links (WebFlowEnvFile entries)
    await WebFlowEnvFile.destroy({
      where: { webFlowId: id, userId },
    });

    // Delete associated config (WebFlowConfig entry)
    await WebFlowConfig.destroy({
      where: { webFlowId: id, userId },
    });

    // Delete the webflow itself
    await webFlow.destroy();

    res.json({ message: 'Web flow deleted successfully' });
  } catch (error) {
    console.error('Delete web flow error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const linkEnvFile = async (req: Request, res: Response) => {
  try {
    const { webFlowId, envFileId } = req.body;
    const userId = (req as any).user.id;

    // Verify both web flow and env file belong to the user
    const webFlow = await WebFlow.findOne({ where: { id: webFlowId, userId } });
    const envFile = await EnvFile.findOne({ where: { id: envFileId, userId } });

    if (!webFlow) {
      return res.status(404).json({ error: 'Web flow not found' });
    }
    if (!envFile) {
      return res.status(404).json({ error: 'Environment file not found' });
    }

    // Check if link already exists
    const existingLink = await WebFlowEnvFile.findOne({
      where: { webFlowId, envFileId },
    });

    if (existingLink) {
      return res.status(400).json({ error: 'Link already exists' });
    }

    // Create the link
    const link = await WebFlowEnvFile.create({
      webFlowId,
      envFileId,
      userId,
    });

    res.status(201).json({
      message: 'Environment file linked successfully',
      link,
    });
  } catch (error) {
    console.error('Link env file error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const unlinkEnvFile = async (req: Request, res: Response) => {
  try {
    const { webFlowId, envFileId } = req.params;
    const userId = (req as any).user.id;

    const parsedWebFlowId = parseInt(webFlowId, 10);
    const parsedEnvFileId = parseInt(envFileId, 10);

    const link = await WebFlowEnvFile.findOne({
      where: { webFlowId: parsedWebFlowId, envFileId: parsedEnvFileId, userId },
    });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    await link.destroy();

    res.json({ message: 'Environment file unlinked successfully' });
  } catch (error) {
    console.error('Unlink env file error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

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
    const userId = (req as any).user.id;

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
    const userId = (req as any).user.id;
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
    const userId = (req as any).user.id;

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
    const userId = (req as any).user.id;

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

/**
 * @swagger
 * /api/web-flows/{id}/openapi-docs:
 *   get:
 *     summary: Get OpenAPI documentation for a web flow
 *     tags: [WebFlows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The web flow ID to get OpenAPI docs for
 *     responses:
 *       200:
 *         description: OpenAPI documentation retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 openApiDocs:
 *                   type: object
 *                   description: The OpenAPI specification document
 *                 source:
 *                   type: string
 *                   enum: [server, file]
 *                   description: The source of the OpenAPI documentation
 *                 sourceDetails:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       description: Server URL (if source is server)
 *                     fileName:
 *                       type: string
 *                       description: File name (if source is file)
 *                     fileId:
 *                       type: integer
 *                       description: File ID (if source is file)
 *       400:
 *         description: OpenAPI configuration not enabled or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: OpenAPI configuration is not enabled for this web flow
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
export const getWebFlowOpenApiDocs = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    // First, verify the web flow exists and belongs to the user
    const webFlow = await WebFlow.findOne({
      where: { id, userId },
    });

    if (!webFlow) {
      return res.status(404).json({ error: 'Web flow not found' });
    }

    // Check if OpenAPI configuration is enabled
    if (!webFlow.hasOpenApiConfig) {
      return res.status(400).json({ 
        error: 'OpenAPI configuration is not enabled for this web flow' 
      });
    }

    // Check if configuration type is specified
    if (!webFlow.openApiConfigType) {
      return res.status(400).json({ 
        error: 'OpenAPI configuration type is not specified' 
      });
    }

    let openApiDocs: any;
    let source: 'server' | 'file';
    let sourceDetails: any = {};

    if (webFlow.openApiConfigType === 'SERVER') {
      // Fetch from server URL
      if (!webFlow.openApiServerUrl) {
        return res.status(400).json({ 
          error: 'OpenAPI server URL is not configured' 
        });
      }

      try {
        const response = await axios.get(webFlow.openApiServerUrl, {
          timeout: 10000, // 10 seconds timeout
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'WebFlow-App/1.0'
          }
        });

        openApiDocs = response.data;
        source = 'server';
        sourceDetails = {
          url: webFlow.openApiServerUrl
        };
      } catch (error: any) {
        console.error('Error fetching OpenAPI docs from server:', error);
        return res.status(500).json({ 
          error: `Failed to fetch OpenAPI documentation from server: ${error.message}` 
        });
      }

    } else if (webFlow.openApiConfigType === 'FILE') {
      // Read from file
      if (!webFlow.openApiFileId) {
        return res.status(400).json({ 
          error: 'OpenAPI file ID is not configured' 
        });
      }

      // Find the file
      const file = await File.findOne({
        where: { id: webFlow.openApiFileId, userId },
      });

      if (!file) {
        return res.status(404).json({ 
          error: 'OpenAPI file not found' 
        });
      }

      try {
        // Read file from disk
        const filePath = path.join(process.env.UPLOAD_DIR || './uploads', file.fileName);
        
        if (!fs.existsSync(filePath)) {
          return res.status(404).json({ 
            error: 'OpenAPI file not found on disk' 
          });
        }

        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Try to parse as JSON, if fails, return as text
        try {
          openApiDocs = JSON.parse(fileContent);
        } catch (parseError) {
          // If it's not valid JSON, it might be YAML or other format
          // For now, return the raw content
          openApiDocs = fileContent;
        }

        source = 'file';
        sourceDetails = {
          fileName: file.originalName,
          fileId: file.id
        };
      } catch (error: any) {
        console.error('Error reading OpenAPI file:', error);
        return res.status(500).json({ 
          error: `Failed to read OpenAPI file: ${error.message}` 
        });
      }
    } else {
      // Invalid configuration type
      return res.status(400).json({ 
        error: 'Invalid OpenAPI configuration type' 
      });
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
      openApiDocs: extractApiList(openApiDocs),
      source,
      sourceDetails,
    });
  } catch (error) {
    console.error('Get web flow OpenAPI docs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
