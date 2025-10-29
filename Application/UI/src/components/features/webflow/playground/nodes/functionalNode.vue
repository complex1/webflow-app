<template>
  <div class="functional-node node-functional" :class="{ 'node-executing': isExecuting }">
    <!-- Glass node header with amber gradient -->
    <NodeHeader 
      :data="data" 
      @edit="onEdit" 
      @delete="onDelete" 
      @view="onView"
      class="functional-node-header"
    />
    
    <!-- Node content with glass panels -->
    <div class="node-content-group">
      <div class="functional-node-content">
        <!-- Transform Method Section -->
        <div class="functional-node-property">
          <div class="property-header">
            <i class="fas fa-code property-icon"></i>
            <span class="property-title">Transform Method</span>
            <i class="fas fa-expand-alt view-indicator"></i>
          </div>
          <UiPopover trigger="click" placement="bottom" class="method-popover">
            <template #trigger>
              <div class="method-preview">
                <div class="method-preview-content">
                  <span class="method-preview-text">{{ getMethodPreview }}</span>
                </div>
                <div class="method-expand-hint">
                  <span>Click to expand</span>
                  <i class="fas fa-chevron-down"></i>
                </div>
              </div>
            </template>
            <div class="method-popover-content">
              <UiCodeMirrorEditor
                :modelValue="data.transform"
                readonly
                :show-footer="false"
              />
            </div>
          </UiPopover>
        </div>
        
        <!-- Parameters Section -->
        <div v-if="data.parameters.length" class="functional-node-property">
          <div class="property-header">
            <i class="fas fa-sliders-h property-icon"></i>
            <span class="property-title">Parameters</span>
            <span class="property-count">{{ Object.keys(data.parameters).length }}</span>
          </div>
          <div class="property-list">
            <VariableView
              v-for="(value, key) in data.parameters"
              :key="key"
              :variable="value"
              :variable-pool="variablePool"
              :env-variable-map="envVariableMap"
              class="parameter-item"
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
    v-model:visible="showDetailModal" 
    size="xl" 
    title="Functional Node Details"
    subtitle="Configure your data transformation logic"
    variant="glass"
  >
    <FunctionalNodeDetail
      :functional-node="data"
      :global-store="variablePool"
      :env-variable-map="envVariableMap"
    />
  </UiModal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type FunctionalNode from "@/apifluxCore/nodes/functionalNode";
// @ts-ignore
import NodeHeader from "./nodeWidgets/nodeHeader.vue";
// @ts-ignore
import VariableView from "./nodeWidgets/variableView.vue";
// @ts-ignore
import NodeResultBlock from "./nodeWidgets/nodeResultBlock.vue";
// @ts-ignore
import FunctionalNodeDetail from "../forms/nodeDetails/functionalNodeDetail.vue";

import { UiPopover, UiCodeMirrorEditor, UiModal } from "@/components/base";
import type { VariablePool } from "@/apifluxCore/types";

const props = defineProps<{
  data: FunctionalNode;
  variablePool: VariablePool;
  envVariableMap: Record<string, string>;
}>();

const emit = defineEmits<{
  (e: "edit", node: FunctionalNode): void;
  (e: "delete", node: FunctionalNode): void;
}>();

// Modal state
const showDetailModal = ref(false);

// Computed property to check if node is executing
const isExecuting = computed(() => {
  // This would be connected to your execution state
  return false; // Replace with actual execution state
});

// Computed property for method preview
const getMethodPreview = computed(() => {
  const method = props.data.transform;
  if (!method) return 'No method defined';
  
  // Get first meaningful line or function signature
  const lines = method.split('\n').filter(line => line.trim());
  const firstLine = lines[0] || '';
  
  if (firstLine.length > 50) {
    return firstLine.substring(0, 47) + '...';
  }
  
  return firstLine || 'function transform(data) { ... }';
});

const onEdit = () => {
  emit("edit", props.data);
};

const onDelete = () => {
  emit("delete", props.data);
};

const onView = () => {
  showDetailModal.value = true;
};
</script>

<style scoped>
/* Neo-Systemic Functional Node Styling */
.functional-node {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 2px solid var(--color-functional-node);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  width: 320px;
  position: relative;
  overflow: hidden;
  transition: all var(--transition-spring);
}

.functional-node:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl), 0 0 20px var(--color-functional-node-light);
  border-color: var(--color-warning-hover);
}

/* Functional Node Header */
.functional-node-header {
  background: var(--color-functional-node-gradient);
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Content Group */
.node-content-group {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.functional-node-content {
  padding: var(--spacing-md);
  background: var(--color-background);
}

/* Property Styling */
.functional-node-property {
  margin-bottom: var(--spacing-md);
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all var(--transition-normal);
}

.functional-node-property:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-sm);
}

.functional-node-property:last-child {
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
  color: var(--color-warning);
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
  background: var(--color-warning-light);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-medium);
}

.view-indicator {
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  opacity: 0.7;
  transition: all var(--transition-fast);
}

/* Method Preview */
.method-preview {
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.method-preview:hover {
  background: var(--color-background-hover);
}

.method-preview-content {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
  line-height: 1.4;
}

.method-preview-text {
  padding: var(--spacing-xs);
  background: var(--color-background-secondary);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--color-warning);
  display: block;
  font-weight: var(--font-weight-medium);
}

.method-expand-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Method Popover */
.method-popover-content {
  height: 310px;
  width: 400px;
  overflow: auto;
  background: var(--color-background);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

/* Parameter List */
.property-list {
  padding: var(--spacing-sm);
}

.parameter-item {
  margin-bottom: var(--spacing-xs);
  padding: var(--spacing-xs);
  background: var(--color-background);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border-subtle);
  transition: all var(--transition-fast);
}

.parameter-item:hover {
  border-color: var(--color-border);
  background: var(--color-background-hover);
}

.parameter-item:last-child {
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

/* Node Type Specific Styling */
.node-functional {
  border-color: var(--color-functional-node);
}

.node-functional .property-icon {
  color: var(--color-warning);
}

.node-functional .property-count {
  background: var(--color-warning-light);
  color: var(--color-warning-dark);
}

/* Flow Connection Points */
.functional-node::before,
.functional-node::after {
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

.functional-node::before {
  left: -8px;
}

.functional-node::after {
  right: -8px;
}

.functional-node:hover::before,
.functional-node:hover::after {
  background: var(--color-connector-active);
  transform: translateY(-50%) scale(1.2);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .functional-node {
    width: 280px;
  }
  
  .functional-node-content {
    padding: var(--spacing-sm);
  }
  
  .property-header {
    padding: var(--spacing-xs) var(--spacing-sm);
  }
  
  .method-popover-content {
    width: 320px;
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
  .functional-node::before,
  .functional-node::after {
    border-color: var(--color-bg-dark);
  }
  
  .method-preview-text {
    background: var(--color-background-tertiary);
  }
}
</style>