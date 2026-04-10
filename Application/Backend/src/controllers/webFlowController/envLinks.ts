import { Request, Response } from 'express';
import WebFlow from '../../models/WebFlow';
import EnvFile from '../../models/EnvFile';
import WebFlowEnvFile from '../../models/WebFlowEnvFile';

export const linkEnvFile = async (req: Request, res: Response) => {
  try {
    const { webFlowId, envFileId } = req.body;
    const userId = req.user!.id;

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
    const userId = req.user!.id;

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
