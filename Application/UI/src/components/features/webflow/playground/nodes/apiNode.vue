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
    
    <!-- Compact node content -->
    <div
      class="node-content-group"
      :class="{
        'no-input': data.headers.length === 0 && data.queryParams.length === 0 && data.pathParams.length === 0 && (data.method === 'GET' || !data.body)
      }">
      <!-- Condensed property list -->
      <div class="node-properties">
        <!-- Request Body (for non-GET methods) -->
        <div v-if="data.method !== 'GET'" class="property-compact">
          <div class="property-compact-header">
            <i class="fas fa-file-code"></i>
            <span>Body</span>
          </div>
          <div class="property-compact-value">
            <VariableView 
              :variable="data.body" 
              :variable-pool="variablePool" 
              :env-variable-map="envVariableMap"
              compact
            />
          </div>
        </div>
        
        <!-- Headers -->
        <div v-if="data.headers.length" class="property-compact">
          <div class="property-compact-header">
            <i class="fas fa-list-ul"></i>
            <span class="property-title" >Headers</span>
            <span class="count-badge">{{ Object.keys(data.headers).length }}</span>
          </div>
          <div class="property-compact-list">
            <VariableView
              v-for="(value, key) in data.headers"
              :key="key"
              :variable="value"
              :variable-pool="variablePool"
              :env-variable-map="envVariableMap"
              compact
            />
          </div>
        </div>
        
        <!-- Query Parameters -->
        <div v-if="data.queryParams.length" class="property-compact">
          <div class="property-compact-header">
            <i class="fas fa-search"></i>
            <span class="property-title">Query</span>
            <span class="count-badge">{{ Object.keys(data.queryParams).length }}</span>
          </div>
          <div class="property-compact-list">
            <VariableView
              v-for="(value, key) in data.queryParams"
              :key="key"
              :variable="value"
              :variable-pool="variablePool"
              :env-variable-map="envVariableMap"
              compact
            />
          </div>
        </div>
        
        <!-- Path Parameters -->
        <div v-if="data.pathParams.length" class="property-compact">
          <div class="property-compact-header">
            <i class="fas fa-route"></i>
            <span class="property-title">Path</span>
            <span class="count-badge">{{ Object.keys(data.pathParams).length }}</span>
          </div>
          <div class="property-compact-list">
            <VariableView
              v-for="(value, key) in data.pathParams"
              :key="key"
              :variable="value"
              :variable-pool="variablePool"
              :env-variable-map="envVariableMap"
              compact
            />
          </div>
        </div>
      </div>
      
      <!-- Compact result block -->
      <NodeResultBlock 
        :node="data" 
        :variable-pool="variablePool" 
        :env-variable-map="envVariableMap"
        class="node-result"
        compact
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
/* Neo-Systemic API Node Styling - Compact Design */
.api-node {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border-radius: var(--radius-sm);
  min-width: 280px;
  max-width: 400px;
  position: relative;
}

.api-node:hover {
  border-color: var(--color-primary-hover);
}

/* API Node Header */
.api-node-header {
  background: var(--color-api-node-gradient);
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* URL Section - Compact */
.api-node-url-section {
  padding: 0 var(--spacing-xs);
  background: var(--color-background-subtle);
  border-bottom: 1px solid var(--color-border-subtle);
}

/* Content Group - Compact */
.node-content-group {
  padding: var(--spacing-xs);
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-sm)
}

.node-content-group.no-input {
  display: grid;
  grid-template-columns: 1fr;
}

.node-properties {
  background: var(--color-background);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  border-bottom-left-radius: var(--radius-lg);
  border-bottom-right-radius: var(--radius-lg);
}

/* Compact Property Header */
.property-compact:not(:last-child) {
  border-bottom: 1px solid var(--color-border-subtle);
  padding-bottom: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
}

.property-compact-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.property-compact-header i {
  color: var(--color-primary);
  width: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.property-compact-header .property-title {
  flex: 1;
}

.count-badge {
  color: var(--color-text-secondary);
  background: var(--color-primary-light);
  padding: 1px 4px;
  border-radius: var(--radius-xs);
  font-weight: var(--font-weight-medium);
  min-width: 16px;
  text-align: center;
  width: fit-content;
}

/* Compact Property Value */
.property-compact-value {
  padding: var(--spacing-xs);
}

/* Compact Property List */
.property-compact-list {
  margin-top: var(--spacing-xs);
  padding-left: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: 2px;
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



/* Responsive adjustments - Compact */
@media (max-width: 768px) {
  .api-node {
    width: 260px;
  }
  
  .node-properties {
    padding: var(--spacing-xs);
    gap: 2px;
  }
  
  .property-compact-header {
    padding: 2px var(--spacing-xs);
    font-size: 10px;
  }
  
  .property-compact-value,
  .property-compact-list {
    padding: 2px var(--spacing-xs);
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