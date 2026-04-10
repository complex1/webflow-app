import { performOutboundHttp } from '../utils/outboundHttp';
import type { NodeTimelineEntry } from '../models/WebFlowExecution';

type VarJson = {
  id: string;
  name?: string;
  defaultValue?: unknown;
  type?: string;
  fromEnv?: boolean;
  envVarName?: string;
};

export type FlowEdge = {
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
};

export type FlowNode = {
  id: string;
  type: string;
  data?: { label?: string; id?: string };
  config?: Record<string, unknown>;
};

const MAX_OUTPUT_JSON = 12_000;

export function summarizeOutput(value: unknown): unknown {
  try {
    const s = JSON.stringify(value);
    if (s.length <= MAX_OUTPUT_JSON) return value;
    return {
      _truncated: true,
      preview: `${s.slice(0, MAX_OUTPUT_JSON)}…`,
    };
  } catch {
    return String(value);
  }
}

function varGet(
  v: VarJson | undefined,
  pool: Record<string, unknown>,
  env: Record<string, string>
): unknown {
  if (!v || typeof v !== 'object') return null;
  if (v.fromEnv && v.envVarName) {
    return env[v.envVarName] ?? v.defaultValue ?? null;
  }
  return pool[v.id] ?? v.defaultValue ?? null;
}

function buildHttpUrl(
  config: Record<string, unknown>,
  pool: Record<string, unknown>,
  env: Record<string, string>
): string {
  const baseUrl = String(varGet(config.baseUrl as VarJson, pool, env) ?? '');
  const urlPath = String(varGet(config.url as VarJson, pool, env) ?? '');
  const pathParams = (config.pathParams as VarJson[]) || [];
  const path = pathParams.reduce((acc: string, param: VarJson) => {
    const name = param.name || '';
    const value = String(varGet(param, pool, env) ?? '');
    const re = new RegExp(`(:${name}|\\{${name}\\})`, 'g');
    return acc.replace(re, value);
  }, urlPath);
  const queryParams = (config.queryParams as VarJson[]) || [];
  const query = queryParams
    .map((param) => {
      const name = param.name || 'q';
      return `${name}=${encodeURIComponent(String(varGet(param, pool, env) ?? ''))}`;
    })
    .join('&');
  return `${baseUrl}${path}${query ? `?${query}` : ''}`;
}

async function executeApiNode(
  config: Record<string, unknown>,
  pool: Record<string, unknown>,
  env: Record<string, string>
): Promise<{ ok: boolean; data?: unknown; error?: string; httpStatus?: number }> {
  const url = buildHttpUrl(config, pool, env);
  const headers: Record<string, string> = {};
  for (const h of (config.headers as VarJson[]) || []) {
    const key = h.name || 'header';
    headers[key] = String(varGet(h, pool, env) ?? '');
  }
  let body = varGet(config.body as VarJson, pool, env);
  const method = String(config.method || 'GET').toUpperCase();
  if (method === 'GET' || method === 'HEAD') {
    body = undefined;
  }
  if (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE') {
    if (!headers['Content-Type'] && !headers['content-type']) {
      headers['Content-Type'] = 'application/json';
    }
  }

  const result = await performOutboundHttp({
    url,
    method: method.toLowerCase(),
    headers,
    data: body === null || body === undefined ? undefined : body,
    timeoutMs: 10_000,
  });

  if (!result.success) {
    return { ok: false, error: result.message, httpStatus: result.status };
  }
  return { ok: true, data: result.data, httpStatus: result.status };
}

async function executeTransformNode(
  config: Record<string, unknown>,
  pool: Record<string, unknown>,
  env: Record<string, string>
): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  const params = (config.parameters as VarJson[]) || [];
  const paramNames = params.map((p, i) => p.name || `p${i}`);
  const paramValues = params.map((p) => varGet(p, pool, env) ?? null);
  const transform = String(config.transform || '');
  try {
    const fn = new Function(...paramNames, transform);
    const result = fn(...paramValues);
    return { ok: true, data: result };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

const getStartingNodeIds = (flowControlEdges: FlowEdge[], nodes: FlowNode[]): string[] => {
  const starts: string[] = [];
  for (const n of nodes) {
    const isStart = flowControlEdges.every((e) => e.target !== n.id);
    if (isStart) starts.push(n.id);
  }
  return starts;
};

const getAllNextNodeIds = (currentId: string, flowControlEdges: FlowEdge[]): string[] => {
  const next = flowControlEdges
    .filter((e) => e.source === currentId)
    .map((e) => e.target);
  return [...new Set(next)];
};

/** Match client `getDataFlowTargetVariableIds`: scope by source node + output handle. */
const getDataFlowTargetVariableIds = (
  sourceVueNodeId: string,
  outputVariableId: string,
  dataFlowEdges: FlowEdge[]
): string[] => {
  const targets = new Set<string>();
  for (const e of dataFlowEdges) {
    if (e.source !== sourceVueNodeId) continue;
    const sh = e.sourceHandle;
    const handleMatches =
      sh == null ||
      sh === '' ||
      sh === outputVariableId ||
      sh === sourceVueNodeId;
    if (!handleMatches) continue;
    const th = e.targetHandle;
    if (th) targets.add(th);
  }
  return [...targets];
};

function inProgressStub(vnode: FlowNode): NodeTimelineEntry {
  const cfg = (vnode.config || {}) as Record<string, unknown>;
  return {
    nodeId: vnode.id,
    nodeName: (vnode.data?.label as string) ?? (cfg.name as string) ?? null,
    nodeType: String(cfg.type || vnode.type),
    status: 'IN_PROGRESS',
    startedAt: new Date().toISOString(),
  };
}

async function runVnode(
  vnode: FlowNode,
  pool: Record<string, unknown>,
  env: Record<string, string>,
  startedAt: string
): Promise<{
  entry: NodeTimelineEntry;
  ok: boolean;
  varOutputId: string;
  output: unknown | undefined;
}> {
  const cfg = (vnode.config || {}) as Record<string, unknown>;
  const nodeType = String(cfg.type || vnode.type);
  const nodeName = (vnode.data?.label as string) ?? (cfg.name as string) ?? null;
  const nodeData = cfg.nodeData as VarJson | undefined;
  const varOutputId = nodeData?.id || `${vnode.id}_data`;

  const entry: NodeTimelineEntry = {
    nodeId: vnode.id,
    nodeName,
    nodeType,
    status: 'IN_PROGRESS',
    startedAt,
  };

  try {
    if (nodeType === 'API') {
      const r = await executeApiNode(cfg, pool, env);
      entry.finishedAt = new Date().toISOString();
      entry.httpStatus = r.httpStatus;
      if (!r.ok) {
        entry.status = 'FAILURE';
        entry.error = r.error;
        return { entry, ok: false, varOutputId, output: undefined };
      }
      entry.status = 'SUCCESS';
      entry.output = summarizeOutput(r.data);
      return { entry, ok: true, varOutputId, output: r.data };
    }

    if (nodeType === 'TRANSFORM') {
      const r = await executeTransformNode(cfg, pool, env);
      entry.finishedAt = new Date().toISOString();
      if (!r.ok) {
        entry.status = 'FAILURE';
        entry.error = r.error;
        return { entry, ok: false, varOutputId, output: undefined };
      }
      entry.status = 'SUCCESS';
      entry.output = summarizeOutput(r.data);
      return { entry, ok: true, varOutputId, output: r.data };
    }

    entry.finishedAt = new Date().toISOString();
    entry.status = 'FAILURE';
    entry.error = `Unsupported node type: ${nodeType}`;
    return { entry, ok: false, varOutputId, output: undefined };
  } catch (e) {
    entry.finishedAt = new Date().toISOString();
    entry.status = 'FAILURE';
    entry.error = (e as Error).message;
    return { entry, ok: false, varOutputId, output: undefined };
  }
}

export type ExecutionProgressPayload = {
  timeline: NodeTimelineEntry[];
  variablePool: Record<string, unknown>;
};

export type ExecutionProgressHook = (
  progress: ExecutionProgressPayload
) => void | Promise<void>;

/**
 * Server-side webflow runner aligned with the UI graph semantics (control vs data edges).
 * Optional `onProgress` is invoked after each wave starts (nodes marked in progress) and after results are merged.
 */
export async function runWebFlowGraph(
  nodes: FlowNode[],
  edges: FlowEdge[],
  env: Record<string, string>,
  hooks?: { onProgress?: ExecutionProgressHook }
): Promise<{
  timeline: NodeTimelineEntry[];
  variablePool: Record<string, unknown>;
  failed: boolean;
  summary?: string;
}> {
  const onProgress = hooks?.onProgress;
  const timeline: NodeTimelineEntry[] = [];
  const pool: Record<string, unknown> = {};
  const nodeMap = new Map<string, FlowNode>();
  for (const n of nodes) nodeMap.set(n.id, n);

  const flowControlEdges = edges.filter(
    (e) => e.sourceHandle === e.source && e.targetHandle === e.target
  );
  const dataFlowEdges = edges.filter((e) => !(e.sourceHandle === e.source));

  let nodeIds = getStartingNodeIds(flowControlEdges, nodes);
  let aborted = false;
  let failureMessage: string | undefined;

  const flushProgress = async () => {
    if (onProgress) {
      await onProgress({
        timeline: [...timeline],
        variablePool: { ...pool },
      });
    }
  };

  while (nodeIds.length > 0 && !aborted) {
    const batch = nodeIds
      .map((id) => nodeMap.get(id))
      .filter((n): n is FlowNode => Boolean(n));

    const waveBase = timeline.length;
    for (const vnode of batch) {
      timeline.push(inProgressStub(vnode));
    }
    await flushProgress();

    const startedAtTimes = batch.map((_, i) => timeline[waveBase + i]!.startedAt);

    const waveResults = await Promise.all(
      batch.map((vnode, i) => runVnode(vnode, pool, env, startedAtTimes[i]!))
    );

    for (let i = 0; i < waveResults.length; i++) {
      timeline[waveBase + i] = waveResults[i]!.entry;
    }
    await flushProgress();

    const failedWave = waveResults.find((w) => !w.ok);
    if (failedWave) {
      aborted = true;
      failureMessage = failedWave.entry.error || 'Node execution failed';
      break;
    }

    for (let i = 0; i < waveResults.length; i++) {
      const wr = waveResults[i]!;
      const vnode = batch[i]!;
      if (wr.output !== undefined) {
        pool[wr.varOutputId] = wr.output;
        for (const tid of getDataFlowTargetVariableIds(
          vnode.id,
          wr.varOutputId,
          dataFlowEdges
        )) {
          pool[tid] = wr.output;
        }
      }
    }

    await flushProgress();

    nodeIds = nodeIds
      .flatMap((id) => getAllNextNodeIds(id, flowControlEdges))
      .filter((id, i, arr) => arr.indexOf(id) === i);
  }

  return {
    timeline,
    variablePool: { ...pool },
    failed: aborted,
    summary: aborted ? failureMessage : undefined,
  };
}
