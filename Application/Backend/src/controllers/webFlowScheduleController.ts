import { Request, Response } from 'express';
import WebFlow from '../models/WebFlow';
import WebFlowEnvFile from '../models/WebFlowEnvFile';
import WebFlowExecution from '../models/WebFlowExecution';
import WebFlowSchedule from '../models/WebFlowSchedule';
import { computeNextRun, isValidCronExpression } from '../services/scheduleCron';

async function assertWebFlowRunnable(userId: number, webFlowId: number): Promise<WebFlow> {
  const webFlow = await WebFlow.findOne({ where: { id: webFlowId, userId } });
  if (!webFlow) {
    throw new Error('WEBFLOW_NOT_FOUND');
  }
  if (webFlow.isFolder) {
    throw new Error('WEBFLOW_IS_FOLDER');
  }
  return webFlow;
}

async function assertEnvFileLinked(
  userId: number,
  webFlowId: number,
  envFileId: number | null | undefined
): Promise<void> {
  if (envFileId == null || envFileId === undefined) {
    return;
  }
  const link = await WebFlowEnvFile.findOne({
    where: { webFlowId, envFileId, userId },
  });
  if (!link) {
    throw new Error('ENV_NOT_LINKED');
  }
}

export const listWebFlowSchedules = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const schedules = await WebFlowSchedule.findAll({
      where: { userId },
      include: [{ model: WebFlow, as: 'webFlow', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });

    const rows = await Promise.all(
      schedules.map(async (s) => {
        const lastExecution = await WebFlowExecution.findOne({
          where: { scheduleId: s.id },
          order: [['createdAt', 'DESC']],
          attributes: ['id', 'status', 'errorSummary', 'createdAt'],
        });
        return {
          ...s.toJSON(),
          lastExecution,
        };
      })
    );

    return res.json({ schedules: rows });
  } catch (error) {
    console.error('List schedules error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createWebFlowSchedule = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      webFlowId,
      name,
      cronExpression,
      timezone = 'UTC',
      enabled = true,
      envFileId = null,
    } = req.body ?? {};

    const wfId = Number(webFlowId);
    if (!Number.isFinite(wfId)) {
      return res.status(400).json({ error: 'webFlowId is required' });
    }
    if (typeof cronExpression !== 'string' || !cronExpression.trim()) {
      return res.status(400).json({ error: 'cronExpression is required' });
    }
    if (typeof timezone !== 'string' || !timezone.trim()) {
      return res.status(400).json({ error: 'timezone is invalid' });
    }
    if (!isValidCronExpression(cronExpression, timezone)) {
      return res.status(400).json({ error: 'Invalid cron expression or timezone' });
    }

    try {
      await assertWebFlowRunnable(userId, wfId);
      await assertEnvFileLinked(userId, wfId, envFileId);
    } catch (e) {
      const code = (e as Error).message;
      if (code === 'WEBFLOW_NOT_FOUND') {
        return res.status(404).json({ error: 'Web flow not found' });
      }
      if (code === 'WEBFLOW_IS_FOLDER') {
        return res.status(400).json({ error: 'Cannot schedule a folder' });
      }
      if (code === 'ENV_NOT_LINKED') {
        return res.status(400).json({ error: 'Env file must be linked to this web flow' });
      }
      throw e;
    }

    const now = new Date();
    const nextRunAt = computeNextRun(cronExpression, timezone, now);

    const resolvedEnvFileId =
      envFileId == null || envFileId === ''
        ? null
        : Number(envFileId);
    if (resolvedEnvFileId != null && Number.isNaN(resolvedEnvFileId)) {
      return res.status(400).json({ error: 'Invalid envFileId' });
    }

    const schedule = await WebFlowSchedule.create({
      userId,
      webFlowId: wfId,
      name: typeof name === 'string' ? name : null,
      cronExpression: cronExpression.trim(),
      timezone: timezone.trim(),
      enabled: Boolean(enabled),
      envFileId: resolvedEnvFileId,
      nextRunAt,
      lastRunAt: null,
    });

    const withFlow = await WebFlowSchedule.findByPk(schedule.id, {
      include: [{ model: WebFlow, as: 'webFlow', attributes: ['id', 'name'] }],
    });

    return res.status(201).json({ schedule: withFlow });
  } catch (error) {
    console.error('Create schedule error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getWebFlowScheduleById = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const schedule = await WebFlowSchedule.findOne({
      where: { id, userId },
      include: [{ model: WebFlow, as: 'webFlow', attributes: ['id', 'name'] }],
    });

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    return res.json({ schedule });
  } catch (error) {
    console.error('Get schedule error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateWebFlowSchedule = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const schedule = await WebFlowSchedule.findOne({ where: { id, userId } });
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    const { name, cronExpression, timezone, enabled, envFileId } = req.body ?? {};

    const nextCron = typeof cronExpression === 'string' ? cronExpression.trim() : schedule.cronExpression;
    const nextTz = typeof timezone === 'string' ? timezone.trim() : schedule.timezone;

    if (typeof cronExpression === 'string' && !isValidCronExpression(nextCron, nextTz)) {
      return res.status(400).json({ error: 'Invalid cron expression or timezone' });
    }
    if (typeof timezone === 'string' && !isValidCronExpression(schedule.cronExpression, nextTz)) {
      return res.status(400).json({ error: 'Invalid timezone' });
    }

    const webFlowId = schedule.webFlowId;
    if (envFileId !== undefined) {
      try {
        await assertEnvFileLinked(userId, webFlowId, envFileId);
      } catch (e) {
        if ((e as Error).message === 'ENV_NOT_LINKED') {
          return res.status(400).json({ error: 'Env file must be linked to this web flow' });
        }
        throw e;
      }
    }

    const updates: Partial<{
      name: string | null;
      cronExpression: string;
      timezone: string;
      enabled: boolean;
      envFileId: number | null;
      nextRunAt: Date | null;
    }> = {};

    if (name !== undefined) {
      updates.name = typeof name === 'string' ? name : null;
    }
    if (typeof cronExpression === 'string') {
      updates.cronExpression = nextCron;
    }
    if (typeof timezone === 'string') {
      updates.timezone = nextTz;
    }
    if (enabled !== undefined) {
      const on = Boolean(enabled);
      updates.enabled = on;
      if (!on) {
        updates.nextRunAt = null;
      } else {
        updates.nextRunAt = computeNextRun(
          typeof cronExpression === 'string' ? nextCron : schedule.cronExpression,
          typeof timezone === 'string' ? nextTz : schedule.timezone,
          new Date()
        );
      }
    }
    if (envFileId !== undefined) {
      if (envFileId == null || envFileId === '') {
        updates.envFileId = null;
      } else {
        const n = Number(envFileId);
        if (Number.isNaN(n)) {
          return res.status(400).json({ error: 'Invalid envFileId' });
        }
        updates.envFileId = n;
      }
    }

    const willBeEnabled = updates.enabled !== undefined ? updates.enabled : schedule.enabled;
    if (willBeEnabled && (typeof cronExpression === 'string' || typeof timezone === 'string')) {
      updates.nextRunAt = computeNextRun(
        updates.cronExpression ?? schedule.cronExpression,
        updates.timezone ?? schedule.timezone,
        new Date()
      );
    }

    await schedule.update(updates);

    const fresh = await WebFlowSchedule.findByPk(schedule.id, {
      include: [{ model: WebFlow, as: 'webFlow', attributes: ['id', 'name'] }],
    });

    return res.json({ schedule: fresh });
  } catch (error) {
    console.error('Update schedule error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteWebFlowSchedule = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const schedule = await WebFlowSchedule.findOne({ where: { id, userId } });
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    await schedule.destroy();
    return res.json({ message: 'Schedule deleted' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const listScheduleExecutions = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const scheduleId = parseInt(req.params.id, 10);
    if (Number.isNaN(scheduleId)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const schedule = await WebFlowSchedule.findOne({ where: { id: scheduleId, userId } });
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 100);
    const offset = (page - 1) * limit;

    const { count, rows } = await WebFlowExecution.findAndCountAll({
      where: { userId, scheduleId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      attributes: [
        'id',
        'webFlowId',
        'scheduleId',
        'status',
        'errorSummary',
        'createdAt',
        'updatedAt',
      ],
    });

    return res.json({
      executions: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('List schedule executions error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
