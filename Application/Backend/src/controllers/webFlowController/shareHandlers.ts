import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import WebFlow from '../../models/WebFlow';

function publicSharePath(token: string | null): string | null {
  return token ? `/share/${token}` : null;
}

export const getWebFlowShare = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const webFlow = await WebFlow.findOne({
      where: { id, userId },
    });

    if (!webFlow) {
      return res.status(404).json({ error: 'Web flow not found' });
    }

    res.json({
      enabled: webFlow.publicShareEnabled,
      shareToken: webFlow.publicShareToken,
      publicPath: publicSharePath(webFlow.publicShareToken),
    });
  } catch (error) {
    console.error('Get web flow share error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateWebFlowShare = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const enabled = Boolean(req.body?.enabled);
    const userId = req.user!.id;

    const webFlow = await WebFlow.findOne({
      where: { id, userId },
    });

    if (!webFlow) {
      return res.status(404).json({ error: 'Web flow not found' });
    }

    let token = webFlow.publicShareToken;
    if (enabled && !token) {
      token = randomUUID();
    }

    await webFlow.update({
      publicShareEnabled: enabled,
      publicShareToken: token,
    });
    await webFlow.reload();

    res.json({
      enabled: webFlow.publicShareEnabled,
      shareToken: webFlow.publicShareToken,
      publicPath: publicSharePath(webFlow.publicShareToken),
    });
  } catch (error) {
    console.error('Update web flow share error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
