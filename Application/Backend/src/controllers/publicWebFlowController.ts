import { Request, Response } from 'express';
import WebFlow from '../models/WebFlow';
import WebFlowConfig from '../models/WebFlowConfig';

/**
 * Unauthenticated read-only snapshot for documentation / published flows.
 */
export const getPublicWebFlowByShareToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token || token.length > 64) {
      return res.status(404).json({ error: 'Not found' });
    }

    const webFlow = await WebFlow.findOne({
      where: {
        publicShareToken: token,
        publicShareEnabled: true,
      },
    });

    if (!webFlow) {
      return res.status(404).json({ error: 'Not found' });
    }

    const config = await WebFlowConfig.findOne({
      where: { webFlowId: webFlow.id },
    });

    if (!config) {
      return res.status(404).json({ error: 'Not found' });
    }

    if (process.env.NODE_ENV === 'development') {
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate, public',
        Pragma: 'no-cache',
        Expires: '0',
      });
    } else {
      res.set('Cache-Control', 'public, max-age=60');
    }

    res.json({
      webFlow: {
        id: webFlow.id,
        name: webFlow.name,
        description: webFlow.description,
        icon: webFlow.icon,
        tags: webFlow.tags,
        basePath: webFlow.basePath,
        hasOpenApiConfig: webFlow.hasOpenApiConfig,
      },
      config: {
        nodes: config.nodes,
        edges: config.edges,
      },
    });
  } catch (error) {
    console.error('Public web flow share error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
