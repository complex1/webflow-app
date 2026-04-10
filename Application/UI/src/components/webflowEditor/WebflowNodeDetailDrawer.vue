<template>
  <Modal
    :open="open"
    :title="modalTitle"
    width="min(760px, 94vw)"
    @close="emit('close')"
  >
    <div v-if="!node" class="node-detail node-detail--empty">
      <Text tone="muted">This node is not on the canvas.</Text>
    </div>
    <div v-else class="node-detail node-detail--scroll">
      <Inline gap="sm" wrap class="node-detail__badges">
        <Badge :variant="runId != null ? 'info' : 'default'">
          {{ runId != null ? `Run #${runId}` : "Configuration only" }}
        </Badge>
        <Badge variant="default">{{ node.type }}</Badge>
      </Inline>

      <section v-if="runId != null" class="node-detail__section" aria-label="Run execution">
        <Heading :level="5" class="node-detail__h">In this run</Heading>
        <div v-if="runLoading" class="node-detail__loading">
          <Spinner />
          <Text tone="muted">Loading run…</Text>
        </div>
        <template v-else-if="timelineStep">
          <dl class="node-detail__dl">
            <div class="node-detail__dl-row">
              <dt>Status</dt>
              <dd>
                <Badge :variant="nodeStatusBadgeVariant(timelineStep.status)">{{
                  timelineStep.status
                }}</Badge>
              </dd>
            </div>
            <div v-if="timelineStep.httpStatus != null" class="node-detail__dl-row">
              <dt>HTTP</dt>
              <dd>{{ timelineStep.httpStatus }}</dd>
            </div>
            <div v-if="timelineStep.error" class="node-detail__dl-row node-detail__dl-row--full">
              <dt>Error</dt>
              <dd class="node-detail__error">{{ timelineStep.error }}</dd>
            </div>
          </dl>
          <div v-if="timelineStep.output !== undefined" class="node-detail__json-block">
            <Text variant="sm" weight="medium" class="node-detail__label">Output (summary)</Text>
            <pre class="node-detail__pre">{{ formatJson(timelineStep.output) }}</pre>
          </div>
        </template>
        <Text v-else tone="muted">No timeline entry for this node in this run.</Text>
      </section>

      <section class="node-detail__section" aria-label="Overview">
        <Heading :level="5" class="node-detail__h">Overview</Heading>
        <dl class="node-detail__dl">
          <div class="node-detail__dl-row">
            <dt>Name</dt>
            <dd>{{ node.name || "—" }}</dd>
          </div>
          <div class="node-detail__dl-row">
            <dt>Node id</dt>
            <dd class="node-detail__mono">{{ node.id }}</dd>
          </div>
          <div v-if="node.description" class="node-detail__dl-row node-detail__dl-row--full">
            <dt>Description</dt>
            <dd>{{ node.description }}</dd>
          </div>
          <template v-if="runId == null">
            <div class="node-detail__dl-row">
              <dt>Canvas status</dt>
              <dd>
                <Badge :variant="canvasStatusVariant">{{ node.nodeStatus }}</Badge>
              </dd>
            </div>
            <div v-if="node.error" class="node-detail__dl-row node-detail__dl-row--full">
              <dt>Canvas error</dt>
              <dd class="node-detail__error">{{ node.error }}</dd>
            </div>
          </template>
        </dl>
      </section>

      <section class="node-detail__section" aria-label="Variables">
        <Heading :level="5" class="node-detail__h">Variables</Heading>
        <p class="node-detail__hint">
          Values use {{ runId != null ? "this run’s saved pool" : "the current variable store" }} and
          linked env keys.
        </p>
        <div class="node-detail__table-wrap">
          <table class="node-detail__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Env</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in variableRows" :key="row.id">
                <td>{{ row.name }}</td>
                <td>{{ row.type }}</td>
                <td>
                  <span v-if="row.fromEnv">{{ row.envVarName || "—" }}</span>
                  <span v-else>—</span>
                </td>
                <td class="node-detail__value-cell">
                  <pre v-if="row.valueJson != null" class="node-detail__pre node-detail__pre--inline">{{
                    row.valueJson
                  }}</pre>
                  <span v-else>{{ row.valueText }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="node-detail__section" aria-label="Configuration">
        <Heading :level="5" class="node-detail__h">Configuration</Heading>
        <template v-if="isApiNode(node)">
          <dl class="node-detail__dl">
            <div class="node-detail__dl-row">
              <dt>Method</dt>
              <dd>{{ node.method }}</dd>
            </div>
          </dl>
          <div class="node-detail__json-block">
            <Text variant="sm" weight="medium" class="node-detail__label">Resolved URL (preview)</Text>
            <pre class="node-detail__pre">{{ urlPreview }}</pre>
          </div>
        </template>
        <template v-else-if="isTransformNode(node)">
          <Text variant="sm" weight="medium" class="node-detail__label">Transform script</Text>
          <pre class="node-detail__pre node-detail__pre--code">{{ node.transform || "—" }}</pre>
        </template>
        <div class="node-detail__json-block">
          <Text variant="sm" weight="medium" class="node-detail__label">Serialized config</Text>
          <pre class="node-detail__pre">{{ formatJson(serializedNode) }}</pre>
        </div>
      </section>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Modal from "@/components/common/overlay/Modal.vue";
import Heading from "@/components/common/typography/Heading.vue";
import Text from "@/components/common/typography/Text.vue";
import Badge from "@/components/common/feedback/Badge.vue";
import Inline from "@/components/common/foundation/Inline.vue";
import Spinner from "@/components/common/feedback/Spinner.vue";
import type HttpNode from "@/apifluxCore/classes/httpNode";
import type TransformNode from "@/apifluxCore/classes/transformNode";
import Variable from "@/apifluxCore/classes/variable";
import { NodeType, type WebflowNode, type VariablePool, type envVariableMap } from "@/apifluxCore/types";
import {
  webFlowService,
  type NodeTimelineEntry,
  type WebFlowExecutionDetail,
} from "@/services/webflow";

const props = defineProps<{
  open: boolean;
  node: WebflowNode | null;
  webflowId: number;
  /** When set, load run timeline + pool for this node. */
  runId: number | null;
  /** Current editor pool (configuration / live view). */
  variablePool: VariablePool;
  envVariableMap: envVariableMap;
}>();

const emit = defineEmits<{ (e: "close"): void }>();

const runLoading = ref(false);
const execution = ref<WebFlowExecutionDetail | null>(null);

const modalTitle = computed(() => {
  if (!props.node) return "Node details";
  return props.node.name || `Node ${props.node.id.slice(0, 8)}…`;
});

const timelineStep = computed<NodeTimelineEntry | null>(() => {
  if (!props.node || !execution.value?.nodeTimeline?.length) return null;
  const id = props.node.id;
  const matches = execution.value.nodeTimeline.filter((s) => s.nodeId === id);
  return matches.length ? matches[matches.length - 1]! : null;
});

const valuePool = computed<VariablePool>(() => {
  if (props.runId != null && execution.value?.variablePool && typeof execution.value.variablePool === "object") {
    return execution.value.variablePool as VariablePool;
  }
  return props.variablePool;
});

function isApiNode(n: WebflowNode): n is HttpNode {
  return n.type === NodeType.API;
}

function isTransformNode(n: WebflowNode): n is TransformNode {
  return n.type === NodeType.TRANSFORM;
}

function collectVariables(n: WebflowNode): Variable[] {
  if (isApiNode(n)) {
    return [
      n.baseUrl,
      n.url,
      ...n.pathParams,
      ...n.queryParams,
      ...n.headers,
      n.body,
      n.nodeData,
    ];
  }
  const t = n as TransformNode;
  return [t.nodeData, ...t.parameters];
}

const variableRows = computed(() => {
  if (!props.node) return [];
  const pool = valuePool.value;
  const env = props.envVariableMap;
  const seen = new Set<string>();
  const rows: Array<{
    id: string;
    name: string;
    type: string;
    fromEnv: boolean;
    envVarName?: string;
    valueJson: string | null;
    valueText: string;
  }> = [];

  for (const v of collectVariables(props.node)) {
    if (!v || seen.has(v.id)) continue;
    seen.add(v.id);
    let raw: unknown;
    try {
      raw = v.get(pool, env);
    } catch {
      raw = undefined;
    }
    const complex = raw !== null && typeof raw === "object";
    rows.push({
      id: v.id,
      name: v.name,
      type: v.type,
      fromEnv: v.fromEnv,
      envVarName: v.envVarName,
      valueJson: complex ? formatJson(raw) : null,
      valueText: complex ? "" : String(raw ?? "—"),
    });
  }
  return rows;
});

const urlPreview = computed(() => {
  if (!props.node || !isApiNode(props.node)) return "—";
  try {
    return props.node.getUrl(props.variablePool, props.envVariableMap);
  } catch {
    return "—";
  }
});

const serializedNode = computed(() => {
  if (!props.node) return {};
  if (isApiNode(props.node)) return props.node.serialized();
  return (props.node as TransformNode).serialized();
});

const canvasStatusVariant = computed(() => {
  const s = props.node?.nodeStatus;
  if (s === "SUCCESS") return "success" as const;
  if (s === "FAILURE") return "error" as const;
  return "default" as const;
});

function nodeStatusBadgeVariant(status: string) {
  if (status === "SUCCESS") return "success" as const;
  if (status === "FAILURE") return "error" as const;
  if (status === "IN_PROGRESS") return "info" as const;
  return "default" as const;
}

function formatJson(v: unknown): string {
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

async function loadExecution() {
  execution.value = null;
  if (props.runId == null || props.runId <= 0 || !Number.isFinite(props.webflowId) || props.webflowId <= 0) {
    return;
  }
  runLoading.value = true;
  try {
    execution.value = await webFlowService.getExecution(props.webflowId, props.runId);
  } catch {
    execution.value = null;
  } finally {
    runLoading.value = false;
  }
}

watch(
  () => [props.open, props.runId, props.webflowId] as const,
  ([isOpen, rid]) => {
    if (!isOpen || rid == null || rid <= 0) {
      execution.value = null;
      return;
    }
    void loadExecution();
  },
  { immediate: true }
);
</script>

<style scoped>
.node-detail {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.node-detail--scroll {
  max-height: min(72vh, 640px);
  overflow-y: auto;
  padding-right: var(--space-1);
}
.node-detail--empty {
  padding: var(--space-2) 0;
}
.node-detail__badges {
  margin-bottom: var(--space-1);
}
.node-detail__section {
  border-top: 1px solid var(--border-subtle, #e0e0e0);
  padding-top: var(--space-3);
}
.node-detail__section:first-of-type {
  border-top: none;
  padding-top: 0;
}
.node-detail__h {
  margin: 0 0 var(--space-2);
  font-size: var(--text-md);
}
.node-detail__loading {
  display: flex;
  align-items: center;
  gap: 10px;
}
.node-detail__dl {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.node-detail__dl-row {
  display: grid;
  grid-template-columns: 7rem 1fr;
  gap: var(--space-2);
  font-size: var(--text-sm);
  align-items: start;
}
.node-detail__dl-row--full {
  grid-template-columns: 1fr;
}
.node-detail__dl-row dt {
  margin: 0;
  font-weight: 600;
  color: var(--text-muted);
}
.node-detail__dl-row dd {
  margin: 0;
  word-break: break-word;
}
.node-detail__error {
  color: var(--text-danger, #c62828);
}
.node-detail__mono {
  font-family: ui-monospace, monospace;
  font-size: 0.8em;
}
.node-detail__hint {
  margin: 0 0 var(--space-2);
  font-size: var(--text-sm);
  color: var(--text-muted);
}
.node-detail__label {
  display: block;
  margin-bottom: var(--space-1);
}
.node-detail__json-block {
  margin-top: var(--space-2);
}
.node-detail__pre {
  margin: 0;
  padding: var(--space-2);
  background: var(--bg-elevated, #f5f5f5);
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  overflow: auto;
  max-height: 220px;
  white-space: pre-wrap;
  word-break: break-word;
}
.node-detail__pre--code {
  max-height: 280px;
}
.node-detail__pre--inline {
  max-height: 120px;
  margin: 0;
  padding: 4px 6px;
  display: inline-block;
  max-width: 100%;
  vertical-align: top;
}
.node-detail__table-wrap {
  overflow-x: auto;
}
.node-detail__table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
}
.node-detail__table th,
.node-detail__table td {
  border: 1px solid var(--border-subtle);
  padding: 6px 8px;
  text-align: left;
  vertical-align: top;
  max-width: 150px;
}
.node-detail__table th {
  background: var(--bg-elevated);
  font-weight: 600;
}
.node-detail__value-cell {
  max-width: 200px;
  min-width: 100px;
}
</style>
