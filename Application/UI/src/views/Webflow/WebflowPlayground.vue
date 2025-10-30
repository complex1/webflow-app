<template>
  <div class="webflow-playground">
    <!-- Loading state -->
    <div v-if="playgroundStore.isLoading" class="loading-container">
      <div class="loading-content glass-panel">
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <div class="loading-text-content">
          <h4 class="loading-title">Loading Webflow Playground</h4>
          <p class="loading-text">Initializing your workspace...</p>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="playgroundStore.hasError" class="error-container">
      <div class="error-content glass-panel">
        <div class="error-illustration">
          <div class="error-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="error-glow"></div>
        </div>
        <div class="error-text-content">
          <h2 class="error-title">Failed to Load Webflow</h2>
          <p class="error-message">{{ playgroundStore.error }}</p>
          <button @click="loadWebflow" class="retry-btn glass-button">
            <i class="fas fa-refresh"></i>
            Try Again
          </button>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div v-else class="playground-main">
      <webflow-playground-header
        :webflow-details="playgroundStore.webflowDetails"
        :has-unsaved-changes="apiFluxCore.hasUnsavedChanges.value"
        @play="handlePlay"
        @add-node="handleAddNode"
        @env-file-changed="onSelectEnvFile"
        @save="saveWebflow"
        @export="handleExport"
      />

      <!-- Playground Content Area -->
      <div class="playground-content">
        <div class="canvas-container glass-panel">
          <webflow-playground-canvas
            ref="webflowCanvas"
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
      <OpenApiNodeForm
        v-else-if="addNewNodeType === 'OPENAPI'"
        :openapiApis="playgroundStore.openapiApis"
        @on-save="addSelectedApis"
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
import { alert, toast } from "@/utils";
import CurlNodeForm from "@/components/features/webflow/playground/forms/curlNodeForm.vue";
import OpenApiNodeForm from "@/components/features/webflow/playground/forms/openapiNodeForm.vue";
import type { ExtractedAPI } from "@/types";
const route = useRoute();
const playgroundStore = useWebflowPlaygroundStore();
const addNewDrawerVisible = ref(false);
const addNewNodeType = ref("");
const apiFluxCore = useApiFlux();
const nodeForEdit = ref<any | null>(null);
const webflowCanvas = ref<InstanceType<typeof WebflowPlaygroundCanvas> | null>(null);
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
  apiFluxCore.play();
};

const handleAddNode = (nodeType: string) => {
  nodeForEdit.value = null;
  addNewNodeType.value = nodeType;
  addNewDrawerVisible.value = true;
};

const saveNode = (nodeData: WebflowNode) => {
  apiFluxCore.addNode(nodeData);
  addNewDrawerVisible.value = false;
  nodeForEdit.value = null;
  webflowCanvas.value?.fitToView();
};

const addSelectedApis = (selectedApis: ExtractedAPI[]) => {
  apiFluxCore.addNodeFromConfig(selectedApis);
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
      toast.success(`Node "${node.name}" deleted successfully.`);
      webflowCanvas.value?.fitToView();
    },
  })
};

const saveWebflow = () => {
  const data = apiFluxCore.getSerializedData();
  playgroundStore.updateWebflowConfig(
    data.nodes,
    data.edges
  ).then(() => {
    toast.success("Webflow saved successfully!");
  }).catch((error) => {
    toast.error(`Failed to save webflow: ${error.message}`);
  });
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

watch(
  () => playgroundStore.webflowConfig,
  (newConfig) => {
    if (newConfig) {
      apiFluxCore.setWebflowData(newConfig);
      webflowCanvas.value?.fitToView();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
/* Webflow Playground Styles - Neo-Systemic Design */

.webflow-playground {
  min-height: 100vh;
  background: var(--color-canvas-bg);
  font-family: var(--font-family-base);
}

/* ===== Loading State ===== */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--spacing-xl);
}

.loading-content {
  text-align: center;
  padding: var(--spacing-2xl);
  max-width: 24rem;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  margin: 0 auto var(--spacing-lg) auto;
  color: var(--color-primary);
  font-size: var(--font-size-xl);
}

.loading-spinner i {
  animation: spin 1s linear infinite;
}

.loading-text-content {
  margin-top: var(--spacing-md);
}

.loading-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
  letter-spacing: var(--letter-spacing-tight);
}

.loading-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-normal);
}

/* ===== Error State ===== */
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--spacing-xl);
}

.error-content {
  text-align: center;
  max-width: 28rem;
  padding: var(--spacing-2xl);
}

.error-illustration {
  position: relative;
  display: inline-block;
  margin-bottom: var(--spacing-xl);
}

.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  border-radius: var(--radius-full);
  background: var(--color-danger-light);
  color: var(--color-danger);
  font-size: var(--font-size-2xl);
  position: relative;
  z-index: 1;
}

.error-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6rem;
  height: 6rem;
  border-radius: var(--radius-full);
  background: radial-gradient(
    circle,
    var(--color-danger-subtle) 0%,
    transparent 70%
  );
  animation: pulse-glow 2s ease-in-out infinite;
}

.error-text-content {
  margin-top: var(--spacing-lg);
}

.error-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
  letter-spacing: var(--letter-spacing-tight);
}

.error-message {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
  line-height: var(--line-height-normal);
  font-size: var(--font-size-md);
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--gradient-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  font-family: var(--font-family-base);
  cursor: pointer;
  transition: all var(--transition-spring);
  box-shadow: var(--shadow-md);
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.retry-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.retry-btn:active {
  transform: translateY(0);
}

/* ===== Main Content ===== */
.playground-main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.playground-content {
  flex: 1;
  padding: var(--spacing-lg);
  padding-top: 0;
}

.canvas-container {
  width: 100%;
  height: calc(100vh - 8rem);
  min-height: 32rem;
  position: relative;
  overflow: hidden;
}

/* ===== Animations ===== */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* ===== Responsive Design ===== */
@media (max-width: 1024px) {
  .playground-content {
    padding: var(--spacing-md);
  }

  .canvas-container {
    height: calc(100vh - 6rem);
    min-height: 24rem;
  }
}

@media (max-width: 768px) {
  .loading-container,
  .error-container {
    padding: var(--spacing-lg);
  }

  .loading-content,
  .error-content {
    padding: var(--spacing-xl);
  }

  .playground-content {
    padding: var(--spacing-sm);
  }

  .canvas-container {
    height: calc(100vh - 5rem);
    min-height: 20rem;
  }

  .error-icon {
    width: 4rem;
    height: 4rem;
    font-size: var(--font-size-xl);
  }

  .error-glow {
    width: 5rem;
    height: 5rem;
  }

  .loading-spinner {
    width: 2.5rem;
    height: 2.5rem;
    font-size: var(--font-size-lg);
  }
}

@media (max-width: 480px) {
  .loading-title,
  .error-title {
    font-size: var(--font-size-lg);
  }

  .loading-text,
  .error-message {
    font-size: var(--font-size-sm);
  }

  .retry-btn {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-sm);
  }

  .canvas-container {
    height: calc(100vh - 4rem);
    min-height: 16rem;
  }
}
</style>