import { Request, Response } from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import WebFlow from '../../models/WebFlow';
import File from '../../models/File';
import { extractApiList } from '../../utils/openApiPreprocess';

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
    const userId = req.user!.id;

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
        
        try {
          openApiDocs = JSON.parse(fileContent);
        } catch (parseError) {
          return res.status(400).json({
            error: 'OpenAPI file must contain valid JSON'
          });
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

    if (typeof openApiDocs !== 'object' || Array.isArray(openApiDocs) || !openApiDocs) {
      return res.status(400).json({
        error: 'OpenAPI document is not in the expected format'
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
