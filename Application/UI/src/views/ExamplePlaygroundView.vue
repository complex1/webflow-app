<template>
  <div class="example-playground">
    <header class="example-playground__header">
      <Inline gap="md" align="center" wrap>
        <router-link to="/" class="example-playground__link">← Home</router-link>
        <Heading :level="3" class="example-playground__title">Example Playground</Heading>
        <Badge variant="info">No sign-in · not saved</Badge>
      </Inline>
      <Text variant="sm" tone="muted" as="p" class="example-playground__intro">
        Add or edit API and Transform nodes, then run the flow in your browser. Execution is local only: nothing is
        stored as a server run. The sample uses JSONPlaceholder (demo API) through a restricted public proxy.
      </Text>
    </header>

    <div class="example-playground__toolbar">
      <Inline gap="sm" wrap align="center">
        <Popover v-model:open="addPopoverOpen" position="bottom-center" :show-arrow="true">
          <Button variant="primary" type="button" size="sm">Add node</Button>
          <template #content>
            <div class="example-playground__add-menu">
              <button type="button" class="example-playground__add-item" @click="startAdd('api')">API node</button>
              <button type="button" class="example-playground__add-item" @click="startAdd('transform')">
                Transform node
              </button>
            </div>
          </template>
        </Popover>
        <Button variant="secondary" type="button" size="sm" :loading="running" @click="runLocal">Run flow</Button>
        <Button variant="secondary" type="button" size="sm" :disabled="running" @click="resetSample">
          Reset sample flow
        </Button>
        <router-link class="example-playground__link" to="/login">Sign in for saved webflows →</router-link>
      </Inline>
    </div>

    <div class="example-playground__body">
      <div class="example-playground__canvas-wrap">
        <WebflowEditorCanvas
          :apifluxComposable="apifluxComposable"
          :read-only="false"
          @edit="onEditNode"
          @delete="openDelete"
          @view="openNodeDetail"
        />
      </div>
      <aside class="example-playground__panel" aria-label="Last run output">
        <Heading :level="5" class="example-playground__panel-title">Variable pool (last run)</Heading>
        <Text variant="sm" tone="muted" as="p" class="example-playground__panel-hint">
          Values produced by nodes after the latest Run flow.
        </Text>
        <pre class="example-playground__pre">{{ poolJson }}</pre>
      </aside>
    </div>

    <Drawer :open="drawer.open" :title="drawer.title" @close="closeDrawer">
      <WebflowAddNodeForm
        :type="drawer.type"
        :mode="drawer.mode"
        :editId="drawer.editId"
        :envVarList="[]"
        :apifluxComposable="apifluxComposable"
        @close="closeDrawer"
        @change="onNodeSaved"
      />
    </Drawer>

    <WebflowDeleteNode
      :open="deletePrompt.open"
      :node-name="nodeName(deletePrompt.id)"
      @confirm="confirmDelete"
      @cancel="closeDelete"
    />

    <WebflowNodeDetailDrawer
      :open="detailNodeId != null"
      :node="detailNode"
      :webflow-id="0"
      :run-id="null"
      :variable-pool="apifluxComposable.globalVariableStore.value"
      :env-variable-map="apifluxComposable.envVariableMap.value"
      @close="closeNodeDetail"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, triggerRef } from "vue";
import WebflowEditorCanvas from "@/components/webflowEditor/WebflowEditorCanvas.vue";
import WebflowAddNodeForm from "@/components/webflowEditor/WebflowAddNodeForm.vue";
import WebflowDeleteNode from "@/components/webflowEditor/WebflowDeleteNode.vue";
import WebflowNodeDetailDrawer from "@/components/webflowEditor/WebflowNodeDetailDrawer.vue";
import Drawer from "@/components/common/overlay/Drawer.vue";
import Heading from "@/components/common/typography/Heading.vue";
import Text from "@/components/common/typography/Text.vue";
import Badge from "@/components/common/feedback/Badge.vue";
import Button from "@/components/common/buttons/Button.vue";
import Inline from "@/components/common/foundation/Inline.vue";
import Popover from "@/components/common/overlay/Popover.vue";
import useApiFlux from "@/apifluxCore/composable";
import { configureApiFluxProxyPostPath } from "@/apifluxCore/service";
import { NodeType, type WebflowNode } from "@/apifluxCore/types";
import { buildExamplePlaygroundPayload } from "@/example-playground/sampleFlow";
import type { NodeOption } from "@/types";

const apifluxComposable = useApiFlux();

const running = ref(false);
const addPopoverOpen = ref(false);
const detailNodeId = ref<string | null>(null);

const drawer = ref<{
  open: boolean;
  type: NodeOption;
  mode: "create" | "edit";
  title: string;
  editId: string | null;
}>({
  open: false,
  type: "api",
  mode: "create",
  title: "",
  editId: null,
});

const deletePrompt = ref({ open: false, id: "" as string });

const detailNode = computed(() => {
  const id = detailNodeId.value;
  if (!id) return null;
  return apifluxComposable.nodeMap.value[id] ?? null;
});

const poolJson = computed(() => {
  try {
    return JSON.stringify(apifluxComposable.globalVariableStore.value, null, 2);
  } catch {
    return "—";
  }
});

function nodeName(id: string) {
  return apifluxComposable.nodeMap.value[id]?.name || "Node";
}

function loadSample() {
  apifluxComposable.reset();
  apifluxComposable.deserializedWebflow(buildExamplePlaygroundPayload());
  apifluxComposable.markSaved();
  triggerRef(apifluxComposable.nodeMap);
}

function resetSample() {
  loadSample();
}

function startAdd(type: NodeOption) {
  addPopoverOpen.value = false;
  drawer.value = {
    open: true,
    type,
    mode: "create",
    title: type === "transform" ? "Create Transform node" : "Create API node",
    editId: null,
  };
}

function onEditNode(id: string) {
  const n = apifluxComposable.nodeMap.value[id];
  if (!n) return;
  const type: NodeOption = n.type === NodeType.TRANSFORM ? "transform" : "api";
  drawer.value = {
    open: true,
    type,
    mode: "edit",
    title: type === "transform" ? "Edit Transform node" : "Edit API node",
    editId: id,
  };
}

function closeDrawer() {
  drawer.value.open = false;
}

function onNodeSaved(_node: WebflowNode) {
  closeDrawer();
}

function openDelete(id: string) {
  deletePrompt.value = { open: true, id };
}

function closeDelete() {
  deletePrompt.value = { open: false, id: "" };
}

function confirmDelete() {
  if (deletePrompt.value.id) {
    apifluxComposable.deleteNode(deletePrompt.value.id);
  }
  closeDelete();
}

function openNodeDetail(id: string) {
  detailNodeId.value = id;
}

function closeNodeDetail() {
  detailNodeId.value = null;
}

async function runLocal() {
  running.value = true;
  try {
    await apifluxComposable.runPipeline();
    triggerRef(apifluxComposable.nodeMap);
  } finally {
    running.value = false;
  }
}

onMounted(() => {
  configureApiFluxProxyPostPath("/proxy/playground");
  loadSample();
});

onUnmounted(() => {
  configureApiFluxProxyPostPath("/proxy");
});
</script>

<style scoped>
.example-playground {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.example-playground__header {
  padding: var(--space-4) var(--space-4) var(--space-2);
  border-bottom: 1px solid var(--border-subtle);
}

.example-playground__title {
  margin: 0;
}

.example-playground__intro {
  margin: var(--space-2) 0 0;
  max-width: 52rem;
  line-height: 1.5;
}

.example-playground__link {
  color: var(--accent-blue);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: 600;
}
.example-playground__link:hover {
  text-decoration: underline;
}

.example-playground__toolbar {
  padding: var(--space-2) var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
}

.example-playground__body {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr min(22rem, 92vw);
  gap: 0;
  min-height: 0;
}

.example-playground__canvas-wrap {
  min-height: 420px;
  height: calc(100vh - 200px);
  position: relative;
}

.example-playground__panel {
  border-left: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
  padding: var(--space-3);
  overflow: auto;
}

.example-playground__panel-title {
  margin: 0 0 var(--space-1);
  font-size: var(--text-md);
}

.example-playground__panel-hint {
  margin: 0 0 var(--space-2);
}

.example-playground__pre {
  margin: 0;
  padding: var(--space-2);
  background: var(--bg-elevated);
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  overflow: auto;
  max-height: min(50vh, 360px);
  white-space: pre-wrap;
  word-break: break-word;
}

.example-playground__add-menu {
  display: flex;
  flex-direction: column;
  min-width: 10rem;
}
.example-playground__add-item {
  border: none;
  background: transparent;
  text-align: left;
  padding: 8px 12px;
  font-size: var(--text-sm);
  cursor: pointer;
  color: var(--text-primary);
}
.example-playground__add-item:hover {
  background: var(--bg-elevated);
}

@media (max-width: 900px) {
  .example-playground__body {
    grid-template-columns: 1fr;
  }
  .example-playground__panel {
    border-left: none;
    border-top: 1px solid var(--border-subtle);
  }
}
</style>
