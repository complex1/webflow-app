import { Request, Response } from 'express';
import { Op, fn, col, where as sqlWhere } from 'sequelize';
import WebFlow from '../models/WebFlow';
import WebFlowExecution from '../models/WebFlowExecution';
import { enqueueWebFlowExecution, normalizeEnv } from '../services/webflowExecutionService';

export const startWebFlowExecution = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const env = normalizeEnv(req.body?.env);

    const webFlow = await WebFlow.findOne({
      where: { id, userId },
    });

    if (!webFlow) {
      return res.status(404).json({ error: 'Web flow not found' });
    }

    if (webFlow.isFolder) {
      return res.status(400).json({ error: 'Cannot execute a folder' });
    }

    let execution;
    try {
      execution = await enqueueWebFlowExecution({
        webFlowId: Number(id),
        userId,
        env,
        scheduleId: null,
      });
    } catch (e) {
      const msg = (e as Error).message;
      if (msg === 'Web flow configuration not found') {
        return res.status(404).json({ error: msg });
      }
      throw e;
    }

    return res.status(202).json({
      message: 'Execution started',
      execution: {
        id: execution.id,
        status: execution.status,
        webFlowId: execution.webFlowId,
      },
    });
  } catch (error) {
    console.error('Start execution error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const listWebFlowExecutions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 100);
    const offset = (page - 1) * limit;
    const qRaw = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    /** Strip LIKE metacharacters so user input is literal (SQLite). */
    const qSafe = qRaw.replace(/[%_\\]/g, '').trim();

    const webFlow = await WebFlow.findOne({ where: { id, userId } });
    if (!webFlow) {
      return res.status(404).json({ error: 'Web flow not found' });
    }

    const wfId = Number(id);
    const whereClause =
      qSafe.length === 0
        ? { webFlowId: wfId, userId }
        : {
            [Op.and]: [
              { webFlowId: wfId, userId },
              {
                [Op.or]: [
                  { errorSummary: { [Op.like]: `%${qSafe}%` } },
                  { status: { [Op.like]: `%${qSafe}%` } },
                  sqlWhere(fn('CAST', col('id'), 'TEXT'), { [Op.like]: `%${qSafe}%` }),
                ],
              },
            ],
          };

    const { count, rows } = await WebFlowExecution.findAndCountAll({
      where: whereClause,
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
    console.error('List executions error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getWebFlowExecutionById = async (req: Request, res: Response) => {
  try {
    const { id, executionId } = req.params;
    const userId = req.user!.id;

    const webFlow = await WebFlow.findOne({ where: { id, userId } });
    if (!webFlow) {
      return res.status(404).json({ error: 'Web flow not found' });
    }

    const parsedExecId = parseInt(executionId, 10);
    if (Number.isNaN(parsedExecId)) {
      return res.status(400).json({ error: 'Invalid execution id' });
    }

    const execution = await WebFlowExecution.findOne({
      where: {
        id: parsedExecId,
        webFlowId: id,
        userId,
      },
    });

    if (!execution) {
      return res.status(404).json({ error: 'Execution not found' });
    }

    return res.json({ execution });
  } catch (error) {
    console.error('Get execution error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
