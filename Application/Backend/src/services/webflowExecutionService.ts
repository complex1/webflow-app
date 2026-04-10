import WebFlowConfig from '../models/WebFlowConfig';
import WebFlowExecution, { type NodeTimelineEntry } from '../models/WebFlowExecution';
import { runWebFlowGraph } from './webflowExecutionEngine';

export const normalizeEnv = (raw: unknown): Record<string, string> => {
  const out: Record<string, string> = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return out;
  }
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    out[k] = v === undefined || v === null ? '' : String(v);
  }
  return out;
};

export async function runAndPersistExecution(
  executionId: number,
  nodes: unknown[],
  edges: unknown[],
  env: Record<string, string>
): Promise<void> {
  try {
    const persistProgress = async (progress: {
      timeline: NodeTimelineEntry[];
      variablePool: Record<string, unknown>;
    }) => {
      await WebFlowExecution.update(
        { nodeTimeline: progress.timeline, variablePool: progress.variablePool },
        { where: { id: executionId } }
      );
    };

    const result = await runWebFlowGraph(
      nodes as Parameters<typeof runWebFlowGraph>[0],
      edges as Parameters<typeof runWebFlowGraph>[1],
      env,
      { onProgress: persistProgress }
    );
    const execution = await WebFlowExecution.findByPk(executionId);
    if (!execution) return;
    await execution.update({
      status: result.failed ? 'failed' : 'completed',
      nodeTimeline: result.timeline,
      variablePool: result.variablePool,
      errorSummary: result.failed ? result.summary || 'Execution failed' : null,
    });
  } catch (error) {
    const message = (error as Error).message;
    await WebFlowExecution.update(
      {
        status: 'failed',
        errorSummary: message,
        nodeTimeline: [],
        variablePool: {},
      },
      { where: { id: executionId } }
    );
  }
}

export type EnqueueWebFlowExecutionOptions = {
  webFlowId: number;
  userId: number;
  env: Record<string, string>;
  scheduleId?: number | null;
};

/**
 * Creates a running execution row and starts the graph asynchronously (same as HTTP POST /execute).
 * Single code path for manual runs and scheduled runs.
 */
export async function enqueueWebFlowExecution(
  options: EnqueueWebFlowExecutionOptions
): Promise<WebFlowExecution> {
  const { webFlowId, userId, env, scheduleId } = options;

  const config = await WebFlowConfig.findOne({
    where: { webFlowId, userId },
  });

  if (!config) {
    throw new Error('Web flow configuration not found');
  }

  const execution = await WebFlowExecution.create({
    webFlowId,
    userId,
    scheduleId: scheduleId ?? null,
    status: 'running',
    errorSummary: null,
    nodeTimeline: [],
  });

  setImmediate(() => {
    void runAndPersistExecution(execution.id, config.nodes, config.edges, env);
  });

  return execution;
}
