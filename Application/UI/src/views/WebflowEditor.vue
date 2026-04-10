<template>
  <AppLayout :showSidebar="false">
    <template #header-actions>
      <WebflowEditorAction
        :mode="canvasMode"
        :linkedEnvFiles="editorStore.linkedEnvFiles"
        :hasOpenApiConfig="editorStore.webflow?.hasOpenApiConfig"
        :execute-disabled="serverRunPending"
        :save-disabled="editorStore.isSaving"
        :webflow-id="webflowId"
        :run-picker-refresh-token="runPickerRefresh"
        :selected-run-id="selectedExecutionRunId"
        :share-controls-available="shareControlsAvailable"
        :public-share-enabled="shareSettings.enabled"
        :public-share-path="shareSettings.publicPath"
        :share-settings-loading="shareSettings.loading"
        @add="handleAdd"
        @execute="runServerExecution()"
        @changeEnvFile="onSelectEnvFile($event)"
        @save="onSaveWebflow"
        @export="exportWebflowView()"
        @select-run="onToolbarExecutionSelect"
        @open-run-report="runReportModalOpen = true"
        @enter-edit="enterEditMode"
        @cancel-edit="cancelEditMode"
        @open-test-run="testRunModalOpen = true"
        @toggle-public-share="onTogglePublicShare"
        @copy-public-link="onCopyPublicShareLink"
      />
    </template>
    <Inline gap="sm" align="center" wrap>
      <Heading :level="3" class="mb-0">Webflow Editor</Heading>
      <Badge :variant="canvasMode === 'view' ? 'default' : 'success'">
        {{ canvasMode === "view" ? "View" : "Edit" }}
      </Badge>
      <WebflowBreadcrumbs />
    </Inline>
    <div class="webflow-editor">
      <div class="webflow-editor__canvas-wrap">
        <WebflowEditorCanvas
          :apifluxComposable="apifluxComposable"
          :read-only="canvasMode === 'view'"
          @edit="editNode($event)"
          @delete="promptDelete($event)"
          @view="viewNode($event)"
        />
        <WebflowRunDetailPanel
          v-if="showRunDetailPanel"
          :webflow-id="webflowId"
          :run-id="detailRunId"
          @clear="onClearExecutionRun"
          @sync-canvas-from-run="onSyncCanvasFromRun"
          @open-node-detail="onOpenNodeDetailFromRun"
          @open-report="runReportModalOpen = true"
        />
      </div>
    </div>
    <WebflowDeleteNode
      :open="deletePrompt.open"
      :node-name="getNodeName(deletePrompt.nodeId)"
      @confirm="handleDeleteConfirm"
      @cancel="closeDeletePrompt"
    />
    <Drawer
      :open="drawerState.open"
      :title="drawerState.title"
      @close="onClose"
    >
      <WebflowAddNodeForm
        :type="drawerState.type"
        :mode="drawerState.mode"
        :editId="drawerState.editId"
        :envVarList="Object.keys(apifluxComposable.envVariableMap.value)"
        :apifluxComposable="apifluxComposable"
        @close="onClose"
        @change="onChange($event)"
      />
    </Drawer>
    <WebflowTestRunModal
      :open="testRunModalOpen"
      :linked-env-files="editorStore.linkedEnvFiles"
      @close="testRunModalOpen = false"
      @run-without-env="onTestRunWithoutEnv"
      @run-with-env="onTestRunWithEnv"
    />
    <WebflowRunReportModal
      :open="runReportModalOpen"
      :webflow-id="webflowId"
      :run-id="selectedExecutionRunId ?? 0"
      :webflow-name="editorStore.webflow?.name"
      @close="runReportModalOpen = false"
    />
    <WebflowNodeDetailDrawer
      :open="selectedNodeDetailQuery != null"
      :node="detailNodeForDrawer"
      :webflow-id="webflowId"
      :run-id="selectedExecutionRunId"
      :variable-pool="apifluxComposable.globalVariableStore.value"
      :env-variable-map="apifluxComposable.envVariableMap.value"
      @close="clearNodeDetailQuery"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, triggerRef, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useWebflowEditorStore } from "@/stores/webflowEditor";
import AppLayout from "@/components/layout/AppLayout.vue";
import WebflowEditorCanvas from "@/components/webflowEditor/WebflowEditorCanvas.vue";
import useApiFlux from "@/apifluxCore/composable";
import WebflowEditorAction from "@/components/webflowEditor/WebflowEditorAction.vue";
import WebflowAddNodeForm from "@/components/webflowEditor/WebflowAddNodeForm.vue";
import WebflowDeleteNode from "@/components/webflowEditor/WebflowDeleteNode.vue";
import { NodeStatus, type WebflowNode } from "@/apifluxCore/types";
import WebflowBreadcrumbs from "@/components/webflow/WebflowBreadcrumbs.vue";
import WebflowRunDetailPanel from "@/components/webflowEditor/WebflowRunDetailPanel.vue";
import WebflowRunReportModal from "@/components/webflowEditor/WebflowRunReportModal.vue";
import WebflowNodeDetailDrawer from "@/components/webflowEditor/WebflowNodeDetailDrawer.vue";
import WebflowTestRunModal from "@/components/webflowEditor/WebflowTestRunModal.vue";
import Heading from "@/components/common/typography/Heading.vue";
import Inline from "@/components/common/foundation/Inline.vue";
import Badge from "@/components/common/feedback/Badge.vue";
import type { NodeOption } from "@/types";
import { webFlowService, type NodeTimelineEntry } from "@/services/webflow";
const route = useRoute();
const router = useRouter();

function parseRunIdFromRoute(): number | null {
  const raw = route.query.runId;
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (s == null || s === "") return null;
  const n = Number.parseInt(String(s), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

const selectedExecutionRunId = computed(() => parseRunIdFromRoute());

function replaceQuery(patcher: (q: Record<string, string | string[]>) => void) {
  const next: Record<string, string | string[]> = { ...route.query } as Record<
    string,
    string | string[]
  >;
  patcher(next);
  void router.replace({ path: route.path, query: next });
}

function onSelectExecutionRun(id: number) {
  replaceQuery((q) => {
    q.runId = String(id);
  });
}

function clearRunQueryOnly() {
  replaceQuery((q) => {
    delete q.runId;
  });
}

function clearNodeDetailQuery() {
  replaceQuery((q) => {
    delete q.nodeId;
  });
}

function viewNode(id: string) {
  replaceQuery((q) => {
    q.nodeId = id;
  });
}

function onOpenNodeDetailFromRun(nodeId: string) {
  viewNode(nodeId);
}

const editorStore = useWebflowEditorStore();
const drawerState = ref({
  open: false,
  type: "api" as NodeOption,
  mode: "create" as "create" | "edit",
  title: "",
  editId: null as string | null,
});
const runReportModalOpen = ref(false);
const deletePrompt = ref({
  open: false,
  nodeId: "" as string,
});
const webflowId = computed(() => Number(route.query.id));

const showRunDetailPanel = computed(() => {
  const rid = selectedExecutionRunId.value;
  const wid = webflowId.value;
  return rid != null && rid > 0 && Number.isFinite(wid) && wid > 0;
});

const detailRunId = computed(() => selectedExecutionRunId.value ?? 0);

/** Increment to refresh run picker after new executions complete. */
const runPickerRefresh = ref(0);

function bumpRunPicker() {
  runPickerRefresh.value += 1;
}

const shareSettings = ref({
  enabled: false,
  publicPath: null as string | null,
  loading: false,
});

const shareControlsAvailable = computed(() => {
  const id = webflowId.value;
  return Number.isFinite(id) && id > 0;
});

async function loadShareSettings() {
  const id = webflowId.value;
  if (!id || Number.isNaN(id) || id <= 0) {
    shareSettings.value = { enabled: false, publicPath: null, loading: false };
    return;
  }
  shareSettings.value.loading = true;
  try {
    const s = await webFlowService.getShareSettings(id);
    shareSettings.value.enabled = s.enabled;
    shareSettings.value.publicPath = s.publicPath;
  } catch {
    shareSettings.value.enabled = false;
    shareSettings.value.publicPath = null;
  } finally {
    shareSettings.value.loading = false;
  }
}

async function onTogglePublicShare(enabled: boolean) {
  const id = webflowId.value;
  if (!id || Number.isNaN(id)) return;
  shareSettings.value.loading = true;
  try {
    const s = await webFlowService.updateShareSettings(id, enabled);
    shareSettings.value.enabled = s.enabled;
    shareSettings.value.publicPath = s.publicPath;
  } finally {
    shareSettings.value.loading = false;
  }
}

function onCopyPublicShareLink() {
  const p = shareSettings.value.publicPath;
  if (!p || typeof window === "undefined") return;
  const url = `${window.location.origin}${p}`;
  void navigator.clipboard.writeText(url);
}

const serverRunPending = ref(false);
let canvasPollTimer: ReturnType<typeof setInterval> | null = null;
/** When set, canvas poll is updating this execution; detail-panel sync for the same id is skipped. */
const pollingExecutionId = ref<number | null>(null);
const apifluxComposable = useApiFlux();
apifluxComposable.reset();
const nodeMap = computed(() => apifluxComposable.nodeMap.value);
const getNodeName = (id: string) => nodeMap.value[id]?.name || "Node";

function parseNodeIdFromRoute(): string | null {
  const raw = route.query.nodeId;
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (s == null || s === "") return null;
  return String(s);
}

const selectedNodeDetailQuery = computed(() => parseNodeIdFromRoute());

const detailNodeForDrawer = computed(() => {
  const id = selectedNodeDetailQuery.value;
  if (!id) return null;
  return apifluxComposable.nodeMap.value[id] ?? null;
});

const onLoadedWebflowData = (data: any) => {
  apifluxComposable.deserializedWebflow(data);
};

const canvasMode = ref<"view" | "edit">("view");
const testRunModalOpen = ref(false);

function enterEditMode() {
  canvasMode.value = "edit";
}

async function cancelEditMode() {
  if (apifluxComposable.hasUnsavedChanges.value) {
    const ok = window.confirm("Discard unsaved changes?");
    if (!ok) return;
  }
  const id = webflowId.value;
  if (id && !Number.isNaN(id)) {
    await editorStore.load(id, onLoadedWebflowData);
    const files = editorStore.linkedEnvFiles;
    const first = files[0];
    if (first != null) {
      onSelectEnvFile(first.id);
    }
  }
  canvasMode.value = "view";
}

function runClientTestWithEnvFileId(envFileId: number | null) {
  testRunModalOpen.value = false;
  clearCanvasExecutionPoll();
  onClearExecutionRun();
  resetCanvasNodeStatuses();
  apifluxComposable.applyServerVariablePool({});
  if (envFileId == null) {
    apifluxComposable.setLinkedEnvFile([]);
  } else {
    const file = editorStore.linkedEnvFiles.find((f) => f.id === envFileId);
    apifluxComposable.setLinkedEnvFile(file?.configs || []);
  }
  apifluxComposable.runPipeline();
}

function onTestRunWithoutEnv() {
  runClientTestWithEnvFileId(null);
}

function onTestRunWithEnv(envFileId: number) {
  runClientTestWithEnvFileId(envFileId);
}

const loadWebflowData = () => {
  const id = webflowId.value;
  if (!id || Number.isNaN(id)) {
    editorStore.reset();
    editorStore.error = "Invalid webflow id";
    return;
  }
  editorStore.load(id, onLoadedWebflowData);
};

const handleAdd = (type: NodeOption) => {
  openFormForEditOrAddNode(type, null);
};

const openFormForEditOrAddNode = (type: NodeOption, id: string | null) => {
  drawerState.value = {
    open: true,
    type,
    mode: id ? "edit" : "create",
    title: id ? `Edit ${type} Node` : `Create ${type} Node`,
    editId: id,
  };
};
const editNode = (id: string) => {
  openFormForEditOrAddNode("api", id);
};
const promptDelete = (nodeId: string) => {
  deletePrompt.value = {
    open: true,
    nodeId,
  };
};
const closeDeletePrompt = () => {
  deletePrompt.value = { open: false, nodeId: "" };
};
const deleteNode = (id: string) => {
  apifluxComposable.deleteNode(id);
};
const handleDeleteConfirm = () => {
  if (deletePrompt.value.nodeId) {
    deleteNode(deletePrompt.value.nodeId);
  }
  closeDeletePrompt();
};
const onClose = () => {
  drawerState.value.open = false;
};
const onChange = (value: WebflowNode) => {
  apifluxComposable.addNode(value);
  onClose();
};

const onSelectEnvFile = (envFileId: number) => {
  const configs = editorStore.linkedEnvFiles.find(file => file.id === envFileId)?.configs || [];
  apifluxComposable.setLinkedEnvFile(configs);
};

function onToolbarExecutionSelect(id: number | null) {
  if (id == null) {
    onClearExecutionRun();
  } else {
    onSelectExecutionRun(id);
  }
}

const clearCanvasExecutionPoll = () => {
  if (canvasPollTimer != null) {
    clearInterval(canvasPollTimer);
    canvasPollTimer = null;
  }
  pollingExecutionId.value = null;
};

const resetCanvasNodeStatuses = () => {
  for (const nid of Object.keys(apifluxComposable.nodeMap.value)) {
    const n = apifluxComposable.nodeMap.value[nid];
    if (n) {
      n.nodeStatus = NodeStatus.INACTIVE;
      n.error = null;
    }
  }
  triggerRef(apifluxComposable.nodeMap);
};

const applyServerTimelineToCanvas = (timeline: NodeTimelineEntry[]) => {
  for (const step of timeline) {
    const n = apifluxComposable.nodeMap.value[step.nodeId];
    if (!n) continue;
    if (step.status === "IN_PROGRESS") {
      n.nodeStatus = NodeStatus.IN_PROGRESS;
    } else if (step.status === "SUCCESS") {
      n.nodeStatus = NodeStatus.SUCCESS;
      n.error = null;
    } else if (step.status === "FAILURE") {
      n.nodeStatus = NodeStatus.FAILURE;
      n.error = step.error ?? "Failed";
    } else if (step.status === "PENDING") {
      n.nodeStatus = NodeStatus.PENDING;
    } else if (step.status === "SKIPPED") {
      n.nodeStatus = NodeStatus.SKIPPED;
      n.error = null;
    }
  }
  triggerRef(apifluxComposable.nodeMap);
};

function onClearExecutionRun() {
  clearRunQueryOnly();
  runReportModalOpen.value = false;
  resetCanvasNodeStatuses();
  apifluxComposable.applyServerVariablePool({});
}

function onSyncCanvasFromRun(payload: {
  executionId: number;
  nodeTimeline: NodeTimelineEntry[];
  variablePool?: Record<string, unknown> | null;
}) {
  const pollId = pollingExecutionId.value;
  if (pollId != null && pollId === payload.executionId) {
    return;
  }
  clearCanvasExecutionPoll();
  resetCanvasNodeStatuses();
  applyServerTimelineToCanvas(payload.nodeTimeline);
  apifluxComposable.applyServerVariablePool(payload.variablePool ?? null);
}

const startCanvasExecutionPoll = (wfId: number, executionId: number) => {
  if (canvasPollTimer != null) {
    clearInterval(canvasPollTimer);
    canvasPollTimer = null;
  }
  pollingExecutionId.value = executionId;
  const tick = async () => {
    try {
      const ex = await webFlowService.getExecution(wfId, executionId);
      applyServerTimelineToCanvas(ex.nodeTimeline || []);
      apifluxComposable.applyServerVariablePool(ex.variablePool ?? null);
      if (ex.status !== "running") {
        clearCanvasExecutionPoll();
        bumpRunPicker();
      }
    } catch {
      clearCanvasExecutionPoll();
    }
  };
  void tick();
  canvasPollTimer = setInterval(() => void tick(), 400);
};

const runServerExecution = async () => {
  const id = webflowId.value;
  if (!id || Number.isNaN(id)) return;
  serverRunPending.value = true;
  try {
    resetCanvasNodeStatuses();
    apifluxComposable.applyServerVariablePool({});
    const env = { ...apifluxComposable.envVariableMap.value };
    const started = await webFlowService.startServerExecution(id, env);
    bumpRunPicker();
    startCanvasExecutionPoll(id, started.id);
    onSelectExecutionRun(started.id);
  } catch (e) {
    console.error("Server execution failed:", e);
  } finally {
    serverRunPending.value = false;
  }
};

const onSaveWebflow = async () => {
  const { nodes, edges } = apifluxComposable.serializedWebflow();
  await editorStore.updateWebflowConfig(nodes, edges);
  apifluxComposable.markSaved();
};

const exportWebflowView = async () => {
  const { nodes, edges } = apifluxComposable.serializedWebflow();
  const exportData = {
    name: editorStore.webflow?.name || "Untitled Webflow",
    description: editorStore.webflow?.description || "",
    icon: editorStore.webflow?.icon || "flow-chart",
    basePath: editorStore.webflow?.basePath || "/",
    tags: editorStore.webflow?.tags || [],
    playgroundConfig: {
      nodes,
      edges,
    },
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `${editorStore.webflow?.name || 'webflow'}.json`);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

onMounted(() => {
  loadWebflowData();
});

onUnmounted(() => {
  clearCanvasExecutionPoll();
});

watch(
  () => route.query.id,
  (newId, oldId) => {
    clearCanvasExecutionPoll();
    loadWebflowData();
    if (oldId !== undefined && String(oldId) !== String(newId)) {
      onClearExecutionRun();
      clearNodeDetailQuery();
      runReportModalOpen.value = false;
      canvasMode.value = "view";
    }
  }
);

watch(
  () => webflowId.value,
  () => {
    bumpRunPicker();
    void loadShareSettings();
  },
  { immediate: true }
);
</script>

<style scoped>
.webflow-editor {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: calc(100vh - 180px);
  padding: var(--space-3);
  min-height: 0;
}
.webflow-editor__canvas-wrap {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.webflow-editor__canvas-wrap > :deep(.webflow-editor-canvas) {
  flex: 1;
  min-height: 0;
}
</style>
