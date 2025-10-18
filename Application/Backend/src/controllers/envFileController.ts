import { Request, Response } from 'express';
import EnvFile from '../models/EnvFile';
import EnvConfig from '../models/EnvConfig';

export const createEnvFile = async (req: Request, res: Response) => {
  try {
    const { name, description, configs } = req.body;
    const userId = (req as any).user.id;

    const envFile = await EnvFile.create({
      name,
      description,
      userId,
    });

    // Create configs if provided
    if (configs && Array.isArray(configs)) {
      const configPromises = configs.map((config: any) =>
        EnvConfig.create({
          key: config.key,
          description: config.description,
          value: config.value,
          envFileId: envFile.id,
        })
      );
      await Promise.all(configPromises);
    }

    // Fetch the created env file with configs
    const createdEnvFile = await EnvFile.findByPk(envFile.id, {
      include: [{ model: EnvConfig, as: 'configs' }],
    });

    res.status(201).json({
      message: 'Environment file created successfully',
      envFile: createdEnvFile,
    });
  } catch (error) {
    console.error('Create env file error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getEnvFiles = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await EnvFile.findAndCountAll({
      where: { userId },
      include: [{ model: EnvConfig, as: 'configs' }],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      envFiles: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Get env files error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getEnvFileById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const envFile = await EnvFile.findOne({
      where: { id, userId },
      include: [{ model: EnvConfig, as: 'configs' }],
    });

    if (!envFile) {
      return res.status(404).json({ error: 'Environment file not found' });
    }

    res.json({ envFile });
  } catch (error) {
    console.error('Get env file by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateEnvFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, configs } = req.body;
    const userId = (req as any).user.id;

    const envFile = await EnvFile.findOne({
      where: { id, userId },
    });

    if (!envFile) {
      return res.status(404).json({ error: 'Environment file not found' });
    }

    // Update env file
    await envFile.update({ name, description });

    // Update configs if provided
    if (configs && Array.isArray(configs)) {
      // Delete existing configs
      await EnvConfig.destroy({ where: { envFileId: envFile.id } });

      // Create new configs
      const configPromises = configs.map((config: any) =>
        EnvConfig.create({
          key: config.key,
          description: config.description,
          value: config.value,
          envFileId: envFile.id,
        })
      );
      await Promise.all(configPromises);
    }

    // Fetch updated env file with configs
    const updatedEnvFile = await EnvFile.findByPk(envFile.id, {
      include: [{ model: EnvConfig, as: 'configs' }],
    });

    res.json({
      message: 'Environment file updated successfully',
      envFile: updatedEnvFile,
    });
  } catch (error) {
    console.error('Update env file error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteEnvFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const envFile = await EnvFile.findOne({
      where: { id, userId },
    });

    if (!envFile) {
      return res.status(404).json({ error: 'Environment file not found' });
    }

    // Delete associated configs first
    await EnvConfig.destroy({ where: { envFileId: envFile.id } });

    // Delete env file
    await envFile.destroy();

    res.json({ message: 'Environment file deleted successfully' });
  } catch (error) {
    console.error('Delete env file error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
