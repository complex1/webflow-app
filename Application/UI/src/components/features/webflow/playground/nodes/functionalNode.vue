<template>
  <div
    class="functional-node node-functional"
    :class="{ 'node-executing': isExecuting }"
  >
    <!-- Glass node header with amber gradient -->
    <NodeHeader
      :data="data"
      @edit="onEdit"
      @delete="onDelete"
      @view="onView"
      class="functional-node-header"
    />

    <!-- Compact Transform Method Section - Full Width -->
    <div class="transform-section-full-width">
      <div class="functional-node-property" @click="showTransformPopover = true">
        <div 
          class="property-compact-header clickable" 
          ref="transformTrigger"
        >
          <i class="fas fa-code"></i>
          <span>Transform</span>
          <i class="fas fa-expand-alt view-indicator"></i>
        </div>
        <div class="method-preview-compact">
          <div class="method-preview-content">
            <span class="method-preview-text">{{ getMethodPreview }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- UiFixedPopover for Transform Method -->
    <UiFixedPopover
      v-model:visible="showTransformPopover"
      :target-element="transformTrigger"
      placement="bottom"
      class="transform-popover"
    >
      <div class="method-popover-content">
        <UiCodeMirrorEditor
          :modelValue="data.transform"
          readonly
          :show-footer="false"
        />
      </div>
    </UiFixedPopover>

    <!-- Compact node content -->
    <div class="node-content-group" :class="{ 'no-input': data.parameters.length === 0 }">
      <div class="functional-node-content">
        <!-- Compact Parameters Section -->
        <div v-if="data.parameters.length" class="functional-node-property">
          <div class="property-compact-header">
            <i class="fas fa-sliders-h"></i>
            <span class="property-title">Parameters</span>
            <span class="count-badge">{{
              Object.keys(data.parameters).length
            }}</span>
          </div>
          <div class="property-compact-list">
            <VariableView
              v-for="(value, key) in data.parameters"
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

import { UiFixedPopover, UiCodeMirrorEditor, UiModal } from "@/components/base";
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
const showTransformPopover = ref(false);
const transformTrigger = ref<HTMLElement | null>(null);

// Computed property to check if node is executing
const isExecuting = computed(() => {
  // This would be connected to your execution state
  return false; // Replace with actual execution state
});

// Computed property for method preview
const getMethodPreview = computed(() => {
  const method = props.data.transform;
  if (!method) return "No method defined";

  // Get first meaningful line or function signature
  const lines = method.split("\n").filter((line) => line.trim());
  const firstLine = lines[0] || "";

  if (firstLine.length > 50) {
    return firstLine.substring(0, 47) + "...";
  }

  return firstLine || "function transform(data) { ... }";
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
/* Neo-Systemic Functional Node Styling - Compact Design */
.functional-node {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 2px solid var(--color-functional-node);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  width: 280px;
  position: relative;
}

/* Functional Node Header */
.functional-node-header {
  background: var(--color-functional-node-gradient);
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Content Group - Compact */
.node-content-group {
  padding: var(--spacing-xs);
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-sm);
}

.node-content-group.no-input {
  display: grid;
  grid-template-columns: 1fr;
}


.transform-section-full-width .functional-node-property {
  width: 100%;
}

.functional-node-content {
  background: var(--color-background);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

/* Property Styling - Compact */
.functional-node-property {
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border);
  overflow: hidden;
  transition: all var(--transition-normal);
}

.functional-node-property:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-sm);
}

/* Compact Property Header */
.property-compact-header {
  display: flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-background-subtle);
  border-bottom: 1px solid var(--color-border-subtle);
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.property-compact-header i {
  color: var(--color-warning);
  font-size: var(--font-size-xs);
  width: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.property-compact-header .property-title {
  flex: 1;
}

.count-badge {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  background: var(--color-warning-light);
  padding: 1px 4px;
  border-radius: var(--radius-xs);
  font-weight: var(--font-weight-medium);
  min-width: 16px;
  width: fit-content;
  text-align: center;
}

.view-indicator {
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  opacity: 0.7;
  transition: all var(--transition-fast);
}

/* Clickable Header States */
.property-compact-header.clickable {
  cursor: pointer;
}

.property-compact-header.clickable:hover {
  background: var(--color-background-hover);
}

/* Compact Method Preview */
.method-preview-compact {
  padding: var(--spacing-xs) var(--spacing-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.method-preview-compact:hover {
  background: var(--color-background-hover);
}

.method-preview-content {
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
  line-height: 1.3;
}

.method-preview-text {
  padding: var(--spacing-xs);
  background: var(--color-background-secondary);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--color-warning);
  display: block;
  font-weight: var(--font-weight-medium);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.method-expand-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10px;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Transform Popover - Enhanced */
.transform-popover .method-popover-content {
  height: 400px;
  width: 500px;
  max-width: 90vw;
  overflow: auto;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-xl);
}

/* Legacy Method Popover - Compact */
.method-popover-content {
  height: 280px;
  width: 360px;
  overflow: auto;
  background: var(--color-background);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

/* Compact Parameter List */
.property-compact-list {
  padding: var(--spacing-xs);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* Result Block - Compact */
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

/* Responsive adjustments - Compact */
@media (max-width: 768px) {
  .functional-node {
    width: 260px;
  }

  .functional-node-content {
    padding: var(--spacing-xs);
    gap: 2px;
  }

  .property-compact-header {
    padding: 2px var(--spacing-xs);
    font-size: 10px;
  }

  .method-preview-compact {
    padding: 2px var(--spacing-xs);
  }

  .property-compact-list {
    padding: 2px var(--spacing-xs);
  }

  .method-popover-content {
    width: 300px;
    height: 240px;
  }
}

/* Animation keyframes */
@keyframes pulse-glow {
  0%,
  100% {
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