<template>
  <div class="webflow-playground-canvas">
    <!-- Glass overlay for Flow Lab branding -->
    <div class="canvas-branding">
      <div class="flow-lab-logo">
        <i class="fas fa-project-diagram"></i>
        <span>Flow Lab</span>
      </div>
    </div>
    
    <!-- Enhanced Vue Flow with Neo-Systemic styling -->
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :fit-view-on-init="true"
      max-zoom="2"
      min-zoom="0.1"
      zoom-on-scroll
      pan-on-scroll
      pan-on-drag
      @node-drag="onNodeDrag"
      @connect="onConnect"
      @edges-change="onEdgeChange"
      class="neo-vue-flow"
    >
      <!-- Enhanced Background with Flow Lab pattern -->
      <Background 
        :pattern-color="'var(--color-primary-subtle)'" 
        :bg-color="'var(--color-canvas-bg)'"
        pattern="dots"
        :gap="20"
        :size="2"
      />
      
      <!-- Glass MiniMap with Apple styling -->
      <MiniMap
        pannable
        zoomable
        position="bottom-left"
        :background-color="'var(--glass-bg)'"
        :node-stroke-width="2"
        :node-border-radius="8"
        :node-border-width="1"
        :node-width="120"
        :node-height="60"
        class="neo-minimap"
      />
      
      <!-- Glass Controls with enhanced styling -->
      <Controls 
        position="top-right" 
        class="neo-controls"
      />
      
      <!-- API Node Template -->
      <template #node-API="nodeData">
        <ApiNodeComponent
          v-if="getApiNodeById(nodeData.id)"
          :data="getApiNodeById(nodeData.id)"
          :variablePool="variablePool"
          :envVariableMap="envVariableMap"
          @delete="onDelete"
          @edit="onEdit"
          class="flow-node api-flow-node"
        />
      </template>
      
      <!-- Functional Node Template -->
      <template #node-FUNCTIONAL="nodeData">
        <FunctionalNodeComponent
          v-if="getFunctionalNodeById(nodeData.id)"
          :data="getFunctionalNodeById(nodeData.id)"
          :variablePool="variablePool"
          :envVariableMap="envVariableMap"
          @delete="onDelete"
          @edit="onEdit"
          class="flow-node functional-flow-node"
        />
      </template>
    </VueFlow>
    
    <!-- Flow Lab Enhancement Indicators -->
    <div class="flow-enhancements">
      <!-- Connection Quality Indicator -->
      <div class="connection-status" :class="{ active: hasActiveConnections }">
        <i class="fas fa-wifi"></i>
        <span>{{ connectionCount }} connections</span>
      </div>
      
      <!-- Performance Indicator -->
      <div class="performance-indicator">
        <i class="fas fa-tachometer-alt"></i>
        <span>{{ nodeCount }} nodes</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  Node,
  Edge,
  NodeDragEvent,
  Connection,
  EdgeChange,
} from "@vue-flow/core";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import { MiniMap } from "@vue-flow/minimap";
import { Background } from "@vue-flow/background";
import { Controls } from "@vue-flow/controls";
import { ref, computed } from "vue";
import type { VariablePool, WebflowNode } from "@/apifluxCore/types";
import type { ApiNode } from "@/apifluxCore/nodes/apiNode";
// @ts-ignore
import ApiNodeComponent from "./nodes/apiNode.vue";
// @ts-ignore
import FunctionalNodeComponent from "./nodes/functionalNode.vue";
import FunctionalNode from "@/apifluxCore/nodes/functionalNode";

const props = defineProps<{
  nodes: Node[];
  edges: Edge[];
  nodeMap: Record<string, WebflowNode>;
  variablePool: VariablePool,
  envVariableMap: Record<string, string>
}>();

const emit = defineEmits<{
  (e: "node-drag", event: NodeDragEvent): void;
  (e: "connect", connection: Connection): void;
  (e: "edge-delete", edgeId: string): void;
  (e: "editNode", node: WebflowNode): void;
  (e: "deleteNode", node: WebflowNode): void;
}>();

// Get Vue Flow instance for programmatic control
const { fitView } = useVueFlow();

// Computed properties for canvas enhancements
const nodeCount = computed(() => props.nodes.length);
const connectionCount = computed(() => props.edges.length);
const hasActiveConnections = computed(() => connectionCount.value > 0);

const getApiNodeById = (id: string): ApiNode => {
  return props.nodeMap[id] as ApiNode;
};

const getFunctionalNodeById = (id: string): FunctionalNode => {
  return props.nodeMap[id] as FunctionalNode;
};

const onDelete = (node: WebflowNode) => {
  emit("deleteNode", node)
};

const onEdit = (node: WebflowNode) => {
  emit("editNode", node)
}

// Handle node drag event
const onNodeDrag = (event: NodeDragEvent) => {
  emit("node-drag", event);
};

// Handle edge connect event
const onConnect = (connection: Connection) => {
  emit("connect", connection);
};

const onEdgeChange = (changes: EdgeChange[]) => {
  changes.forEach((change) => {
    if (change.type === "remove") {
      emit("edge-delete", change.id);
    }
  });
};

// Enhanced fit view method with smooth animation
const fitToView = (options?: { padding?: number; includeHiddenNodes?: boolean; duration?: number }) => {
  fitView({
    padding: options?.padding || 0.15,
    includeHiddenNodes: options?.includeHiddenNodes || false,
    duration: options?.duration || 1200,
  });
};

// Expose methods for parent components
defineExpose({
  fitToView,
});
</script>

<style scoped>
/* Neo-Systemic Canvas Styling */
.webflow-playground-canvas {
  width: 100%;
  height: 100%;
  position: relative;
  background: var(--color-canvas-bg);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* Canvas Branding */
.canvas-branding {
  position: absolute;
  top: var(--spacing-md);
  left: var(--spacing-md);
  z-index: 1000;
  pointer-events: none;
}

.flow-lab-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.flow-lab-logo i {
  font-size: var(--font-size-md);
  color: var(--color-primary);
}

/* Enhanced Vue Flow */
.neo-vue-flow {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-lg);
}

/* Canvas Background Enhancements */
:deep(.vue-flow__background) {
  background: var(--color-canvas-bg);
}

/* Neo-Systemic MiniMap */
:deep(.neo-minimap) {
  background: var(--glass-bg) !important;
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border) !important;
  border-radius: var(--radius-md) !important;
  box-shadow: var(--shadow-md) !important;
  overflow: hidden;
}

:deep(.neo-minimap .vue-flow__minimap-mask) {
  fill: var(--color-primary-subtle) !important;
  stroke: var(--color-primary) !important;
  stroke-width: 2px;
}

:deep(.neo-minimap .vue-flow__minimap-node) {
  fill: var(--color-primary-light) !important;
  stroke: var(--color-primary) !important;
  stroke-width: 1px;
}

/* Neo-Systemic Controls */
:deep(.neo-controls) {
  background: var(--glass-bg) !important;
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border) !important;
  border-radius: var(--radius-md) !important;
  box-shadow: var(--shadow-md) !important;
  padding: var(--spacing-xs);
  gap: var(--spacing-xs);
}

:deep(.neo-controls .vue-flow__controls-button) {
  background: transparent !important;
  border: 1px solid var(--color-border-subtle) !important;
  border-radius: var(--radius-sm) !important;
  color: var(--color-text-primary) !important;
  transition: all var(--transition-fast) !important;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.neo-controls .vue-flow__controls-button:hover) {
  background: var(--color-primary-light) !important;
  border-color: var(--color-primary) !important;
  color: var(--color-primary) !important;
  transform: scale(1.05);
}

:deep(.neo-controls .vue-flow__controls-button:active) {
  transform: scale(0.95);
}

/* Flow Node Enhancements */
.flow-node {
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
  transition: all var(--transition-spring);
}

.api-flow-node {
  --node-glow: var(--color-primary-light);
}

.functional-flow-node {
  --node-glow: var(--color-warning-light);
}

/* Edge Styling */
:deep(.vue-flow__edge-path) {
  stroke: var(--color-connector) !important;
  stroke-width: 2px;
  transition: all var(--transition-normal);
}

:deep(.vue-flow__edge:hover .vue-flow__edge-path) {
  stroke: var(--color-connector-active) !important;
  stroke-width: 3px;
  filter: drop-shadow(0 0 6px var(--color-connector-active));
}

:deep(.vue-flow__edge.selected .vue-flow__edge-path) {
  stroke: var(--color-primary) !important;
  stroke-width: 3px;
  filter: drop-shadow(0 0 8px var(--color-primary-light));
}

/* Connection Handle Styling */

/* Flow Enhancements Panel */
.flow-enhancements {
  position: absolute;
  bottom: var(--spacing-md);
  right: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  z-index: 1000;
}

.connection-status,
.performance-indicator {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.connection-status.active {
  border-color: var(--color-success);
  color: var(--color-success);
}

.connection-status.active i {
  color: var(--color-success);
  animation: pulse 2s infinite;
}

.performance-indicator i {
  color: var(--color-info);
}

/* Canvas Responsive Design */
@media (max-width: 768px) {
  .canvas-branding {
    top: var(--spacing-sm);
    left: var(--spacing-sm);
  }
  
  .flow-lab-logo {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-xs);
  }
  
  .flow-enhancements {
    bottom: var(--spacing-sm);
    right: var(--spacing-sm);
  }
  
  :deep(.neo-minimap) {
    transform: scale(0.8);
    transform-origin: bottom left;
  }
  
  :deep(.neo-controls) {
    transform: scale(0.9);
    transform-origin: top right;
  }
}

/* Dark theme canvas adjustments */
@media (prefers-color-scheme: dark) {
  .webflow-playground-canvas {
    background: var(--color-canvas-bg-dark);
  }
  
  :deep(.vue-flow__background) {
    background: var(--color-canvas-bg-dark);
  }
}

/* Animation keyframes */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* Flow Lab Canvas Grid Enhancement */
:deep(.vue-flow__background .vue-flow__background-pattern) {
  opacity: 0.6;
}
</style>