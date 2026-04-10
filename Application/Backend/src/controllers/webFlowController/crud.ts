import { Request, Response } from 'express';
import WebFlow from '../../models/WebFlow';
import EnvFile from '../../models/EnvFile';
import WebFlowConfig from '../../models/WebFlowConfig';
import WebFlowEnvFile from '../../models/WebFlowEnvFile';
import { ensureParentOwnership } from './shared';

export const getWebFlows = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
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
    const userId = req.user!.id;

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
      parentId
    } = req.body;
    const userId = req.user!.id;

    const webFlow = await WebFlow.findOne({
      where: { id, userId },
    });

    if (!webFlow) {
      return res.status(404).json({ error: 'Web flow not found' });
    }

    await ensureParentOwnership(parentId, userId);

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
      parentId,
    });

    res.json({
      message: 'Web flow updated successfully',
      webFlow,
    });
  } catch (error: any) {
    if (error?.message === 'PARENT_NOT_FOUND') {
      return res.status(400).json({ error: 'Parent folder not found' });
    }
    console.error('Update web flow error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteWebFlow = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

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
