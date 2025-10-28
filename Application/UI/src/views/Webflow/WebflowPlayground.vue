<template>
  <div class="webflow-playground">
    <!-- Loading state -->
    <div v-if="playgroundStore.isLoading" class="loading-container">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">Loading webflow playground...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="playgroundStore.hasError" class="error-container">
      <div class="error-content">
        <div class="error-icon">⚠️</div>
        <h2 class="error-title">Failed to load webflow</h2>
        <p class="error-message">{{ playgroundStore.error }}</p>
        <button @click="loadWebflow" class="retry-btn">Retry</button>
      </div>
    </div>

    <!-- Main content -->
    <div v-else>
      <webflow-playground-header
        :webflow-details="playgroundStore.webflowDetails"
        @play="handlePlay"
        @add-node="handleAddNode"
        @env-file-changed="onSelectEnvFile"
        @save="saveWebflow"
        @export="handleExport"
      />

      <!-- Playground Content Area -->
      <div class="playground-content">
        <div class="canvas-container">
            <webflow-playground-canvas
              :nodes="apiFluxCore.nodes.value"
              :edges="apiFluxCore.edges.value"
              :node-map="apiFluxCore.nodeMap.value"
              :variablePool="apiFluxCore.variablePool.value"
              :envVariableMap="apiFluxCore.envVariableMap.value"
              @node-drag="apiFluxCore.setPosition"
              @connect="apiFluxCore.addEdge"
              @editNode="onEditNode"
              @deleteNode="onDeleteNode"
            />
        </div>
      </div>
    </div>

    <!-- Add New Node Drawer -->
    <UiDrawer
      v-model:visible="addNewDrawerVisible"
      :title="`Add New ${addNewNodeType} Node`"
      size="lg"
    >
      <api-node-form
        v-if="addNewNodeType === 'API'"
        :apiNode="nodeForEdit"
        :envVariablesNames="apiFluxCore.envVariablesNames.value"
        @on-save="saveNode"
        @on-cancel="addNewDrawerVisible = false"
      />
      <functional-node-form
        v-else-if="addNewNodeType === 'FUNCTIONAL'"
        :envVariablesNames="apiFluxCore.envVariablesNames.value"
        :fnNode="nodeForEdit"
        @on-save="saveNode"
        @on-cancel="addNewDrawerVisible = false"
      />
      <CurlNodeForm
        v-else-if="addNewNodeType === 'CURL'"
        :envVariablesNames="apiFluxCore.envVariablesNames.value"
        :curlNode="nodeForEdit"
        @on-save="saveNode"
        @on-cancel="addNewDrawerVisible = false"
      />
    </UiDrawer>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import WebflowPlaygroundHeader from "../../components/features/webflow/playground/webflowPlaygroundHeader.vue";
import WebflowPlaygroundCanvas from "../../components/features/webflow/playground/webflowPlaygroundCanvas.vue";
import { useWebflowPlaygroundStore } from "../../stores/webflowPlayground";
import { UiDrawer } from "@/components/base";
import ApiNodeForm from "../../components/features/webflow/playground/forms/apiNodeForm.vue";
import useApiFlux from "@/apifluxCore/apifluxComposable";
import type { WebflowNode } from "@/apifluxCore/types";
import FunctionalNodeForm from "../../components/features/webflow/playground/forms/functionalNodeForm.vue";
import { alert } from "@/utils";
import CurlNodeForm from "@/components/features/webflow/playground/forms/curlNodeForm.vue";

const route = useRoute();
const playgroundStore = useWebflowPlaygroundStore();
const addNewDrawerVisible = ref(false);
const addNewNodeType = ref("");
const apiFluxCore = useApiFlux();
const nodeForEdit = ref<any | null>(null);
const loadWebflow = async () => {
  const wfid = route.query.wfid as string;

  if (!wfid) {
    playgroundStore.setError("Webflow ID is required");
    return;
  }

  const webflowId = parseInt(wfid, 10);

  if (isNaN(webflowId)) {
    playgroundStore.setError("Invalid webflow ID");
    return;
  }

  await playgroundStore.loadAll(webflowId);
};

const onSelectEnvFile = (envFileId: number | null) => {
  const envFile = playgroundStore.webflowEnvLinks.find(file => file.id === envFileId) || null;
  if (!envFile) {
    apiFluxCore.setEnvironmentVariableMap({});
    return;
  }
  const envVariableMap = {} as Record<string, string>;
  envFile.configs.forEach(variable => {
    envVariableMap[variable.key] = variable.value;
  });
  apiFluxCore.setEnvironmentVariableMap(envVariableMap);
};

// Event handlers
const handlePlay = () => {
  console.log("Playing webflow...");
  apiFluxCore.play();
  // Implement play functionality
};

const handleAddNode = (nodeType: string) => {
  console.log("Adding node of type:", nodeType);
  nodeForEdit.value = null;
  addNewNodeType.value = nodeType;
  addNewDrawerVisible.value = true;
};

const saveNode = (nodeData: WebflowNode) => {
  apiFluxCore.addNode(nodeData);
  addNewDrawerVisible.value = false;
  nodeForEdit.value = null;
};

const onEditNode = (node: WebflowNode) => {
  nodeForEdit.value = node;
  addNewNodeType.value = node.type;
  addNewDrawerVisible.value = true;
};

const onDeleteNode = (node: WebflowNode) => {
  alert.confirm(`Are you sure you want to delete the node "${node.name}"? This action cannot be undone.`, {
    title: "Confirm Deletion",
    type: "warning",
    confirmText: "Delete",
    cancelText: "Cancel",
    onConfirm: () => {
      apiFluxCore.deleteNode(node.id);
    },
  })
};

const saveWebflow = () => {
  console.log("Saving webflow...", apiFluxCore.getSerializedData());
};
const handleExport = () => {
  console.log("Exporting webflow...");
  // Implement export functionality
};

// Load webflow when component mounts
onMounted(() => {
  loadWebflow();
});

// Watch for changes in wfid query parameter
watch(
  () => route.query.wfid,
  (newWfid) => {
    if (newWfid) {
      playgroundStore.reset();
      loadWebflow();
    }
  }
);
</script>

<style scoped>
/* Webflow Playground Styles using Design System */

.webflow-playground {
  min-height: 100vh;
  background-color: var(--color-background-secondary);
}

/* Loading State */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 2px solid var(--color-gray-200);
  border-top: 2px solid var(--color-primary);
  border-radius: var(--radius-full);
  margin: 0 auto var(--spacing-md) auto;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
}

/* Error State */
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.error-content {
  text-align: center;
  max-width: 24rem;
  padding: var(--spacing-xl);
}

.error-icon {
  font-size: var(--font-size-5xl);
  margin-bottom: var(--spacing-md);
}

.error-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.error-message {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  line-height: var(--line-height-normal);
}

.retry-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.retry-btn:hover {
  background-color: var(--color-primary-hover);
  /* transform: translateY(-1px); */
  box-shadow: var(--shadow-md);
}

.retry-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

/* Main Content */
.playground-content {
  padding: var(--spacing-lg);
}

.canvas-container {
  background-color: var(--color-background);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
}

.canvas-placeholder {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
}

/* Responsive Design */
@media (max-width: 768px) {
  .playground-content {
    padding: var(--spacing-lg);
  }

  .canvas-container {
    height: 20rem;
  }

  .error-content {
    padding: var(--spacing-lg);
  }
}

@media (max-width: 480px) {
  .playground-content {
    padding: var(--spacing-md);
  }

  .canvas-container {
    height: 16rem;
  }

  .canvas-placeholder {
    font-size: var(--font-size-base);
  }
}
</style>