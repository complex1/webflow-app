<template>
  <div class="api-node node-api" :class="{ 'node-executing': isExecuting }">
    <!-- Glass node header with gradient -->
    <NodeHeader 
      :data="data" 
      @edit="onEdit" 
      @delete="onDelete" 
      @view="viewDetail = true"
      class="api-node-header"
    />
    
    <!-- API URL section with glass styling -->
    <div class="api-node-url-section">
      <ApiNodeUrl 
        :data="data" 
        :variable-pool="variablePool" 
        :env-variable-map="envVariableMap" 
      />
    </div>
    
    <!-- Node content with glass panels -->
    <div class="node-content-group">
      <div class="node-content">
        <!-- Request Body (for non-GET methods) -->
        <div v-if="data.method !== 'GET'" class="api-node-property">
          <div class="property-header">
            <i class="fas fa-file-code property-icon"></i>
            <span class="property-title">Request Body</span>
          </div>
          <VariableView 
            :variable="data.body" 
            :variable-pool="variablePool" 
            :env-variable-map="envVariableMap" 
          />
        </div>
        
        <!-- Headers -->
        <div v-if="data.headers.length" class="api-node-property">
          <div class="property-header">
            <i class="fas fa-list-ul property-icon"></i>
            <span class="property-title">Headers</span>
            <span class="property-count">{{ Object.keys(data.headers).length }}</span>
          </div>
          <div class="property-list">
            <VariableView
              v-for="(value, key) in data.headers"
              :key="key"
              :variable="value"
              :variable-pool="variablePool"
              :env-variable-map="envVariableMap"
              class="property-item"
            />
          </div>
        </div>
        
        <!-- Query Parameters -->
        <div v-if="data.queryParams.length" class="api-node-property">
          <div class="property-header">
            <i class="fas fa-search property-icon"></i>
            <span class="property-title">Query Parameters</span>
            <span class="property-count">{{ Object.keys(data.queryParams).length }}</span>
          </div>
          <div class="property-list">
            <VariableView
              v-for="(value, key) in data.queryParams"
              :key="key"
              :variable="value"
              :variable-pool="variablePool"
              :env-variable-map="envVariableMap"
              class="property-item"
            />
          </div>
        </div>
        
        <!-- Path Parameters -->
        <div v-if="data.pathParams.length" class="api-node-property">
          <div class="property-header">
            <i class="fas fa-route property-icon"></i>
            <span class="property-title">Path Parameters</span>
            <span class="property-count">{{ Object.keys(data.pathParams).length }}</span>
          </div>
          <div class="property-list">
            <VariableView
              v-for="(value, key) in data.pathParams"
              :key="key"
              :variable="value"
              :variable-pool="variablePool"
              :env-variable-map="envVariableMap"
              class="property-item"
            />
          </div>
        </div>
      </div>
      
      <!-- Result block with glass styling -->
      <NodeResultBlock 
        :node="data" 
        :variable-pool="variablePool" 
        :env-variable-map="envVariableMap"
        class="node-result"
      />
    </div>
    
    <!-- Execution indicator -->
    <div v-if="isExecuting" class="execution-pulse"></div>
  </div>
  
  <!-- Enhanced modal with glass design -->
  <UiModal 
    v-model:visible="viewDetail" 
    title="API Node Details" 
    subtitle="Configure your API request settings"
    size="xl"
    variant="glass"
  >
    <ApiNodeDetail 
      :apiNode="data" 
      @edit="onEdit" 
      @delete="onDelete" 
      :global-store="variablePool" 
    />
  </UiModal>
</template>

<script setup lang="ts">
// @ts-ignore
import NodeHeader from "./nodeWidgets/nodeHeader.vue";
import { ApiNode } from "@/apifluxCore/nodes/apiNode";
// @ts-ignore
import ApiNodeUrl from "./nodeWidgets/apiNodeUrl.vue";
// @ts-ignore
import VariableView from "./nodeWidgets/variableView.vue";
// @ts-ignore
import NodeResultBlock from "./nodeWidgets/nodeResultBlock.vue";
import { UiModal } from "@/components/base";
// @ts-ignore
import ApiNodeDetail from "../forms/nodeDetails/apiNodeDetail.vue";
import { ref, computed } from "vue";
import type { VariablePool } from "@/apifluxCore/types";

const props = defineProps<{
  data: ApiNode;
  variablePool: VariablePool;
  envVariableMap: Record<string, string>;
}>();

const emit = defineEmits<{
  (e: "edit", node: ApiNode): void;
  (e: "delete", node: ApiNode): void;
}>();

const viewDetail = ref(false);

// Computed property to check if node is executing
const isExecuting = computed(() => {
  // This would be connected to your execution state
  return false; // Replace with actual execution state
});

const onEdit = () => {
  emit("edit", props.data);
};

const onDelete = () => {
  emit("delete", props.data);
};
</script>

<style scoped>
/* Neo-Systemic API Node Styling */
.api-node {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 2px solid var(--color-api-node);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  width: 320px;
  position: relative;
  overflow: hidden;
  transition: all var(--transition-spring);
}

.api-node:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl), 0 0 20px var(--color-api-node-light);
  border-color: var(--color-primary-hover);
}

/* API Node Header */
.api-node-header {
  background: var(--color-api-node-gradient);
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* URL Section */
.api-node-url-section {
  padding: var(--spacing-sm);
  background: var(--color-background-subtle);
  border-bottom: 1px solid var(--color-border-subtle);
}

/* Content Group */
.node-content-group {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.node-content {
  padding: var(--spacing-md);
  background: var(--color-background);
}

/* Property Styling */
.api-node-property {
  margin-bottom: var(--spacing-md);
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all var(--transition-normal);
}

.api-node-property:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-sm);
}

.api-node-property:last-child {
  margin-bottom: 0;
}

/* Property Header */
.property-header {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-background-subtle);
  border-bottom: 1px solid var(--color-border-subtle);
  gap: var(--spacing-sm);
}

.property-icon {
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.property-title {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-xs);
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex: 1;
}

.property-count {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  background: var(--color-primary-light);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-medium);
}

/* Property List */
.property-list {
  padding: var(--spacing-sm);
}

.property-item {
  margin-bottom: var(--spacing-xs);
  padding: var(--spacing-xs);
  background: var(--color-background);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border-subtle);
  transition: all var(--transition-fast);
}

.property-item:hover {
  border-color: var(--color-border);
  background: var(--color-background-hover);
}

.property-item:last-child {
  margin-bottom: 0;
}

/* Result Block */
.node-result {
  border-top: 1px solid var(--color-border-subtle);
  background: var(--color-background-subtle);
}

/* Execution States */
.node-executing {
  border-color: var(--color-accent-cyan);
  box-shadow: var(--shadow-lg), 0 0 25px var(--color-info-subtle);
}

.execution-pulse {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid var(--color-accent-cyan);
  border-radius: var(--radius-lg);
  animation: pulse-glow 2s ease-in-out infinite;
  pointer-events: none;
}

/* HTTP Method Color Coding */
.api-node[data-method="GET"] {
  border-color: var(--color-success);
}

.api-node[data-method="POST"] {
  border-color: var(--color-primary);
}

.api-node[data-method="PUT"] {
  border-color: var(--color-warning);
}

.api-node[data-method="DELETE"] {
  border-color: var(--color-danger);
}

.api-node[data-method="PATCH"] {
  border-color: var(--color-info);
}

/* Flow Connection Points */
.api-node::before,
.api-node::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  background: var(--color-connector);
  border: 2px solid white;
  border-radius: var(--radius-full);
  top: 50%;
  transform: translateY(-50%);
  transition: all var(--transition-normal);
}

.api-node::before {
  left: -8px;
}

.api-node::after {
  right: -8px;
}

.api-node:hover::before,
.api-node:hover::after {
  background: var(--color-connector-active);
  transform: translateY(-50%) scale(1.2);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .api-node {
    width: 280px;
  }
  
  .node-content-group {
    gap: 0;
  }
  
  .node-content {
    padding: var(--spacing-sm);
  }
  
  .property-header {
    padding: var(--spacing-xs) var(--spacing-sm);
  }
}

/* Animation keyframes */
@keyframes pulse-glow {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.02);
  }
}

/* Dark theme adjustments */
@media (prefers-color-scheme: dark) {
  .api-node::before,
  .api-node::after {
    border-color: var(--color-bg-dark);
  }
}
</style>