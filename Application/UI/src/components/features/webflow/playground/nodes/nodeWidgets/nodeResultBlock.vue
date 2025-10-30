<template>
  <div class="node-result-block-compact" :class="{ compact: compact }">
    <!-- Compact Result Header -->
    <div class="result-header-compact">
      <div class="result-status-indicator" :class="getResultStatus">
        <i :class="getResultIcon"></i>
      </div>
      <span class="result-label">Output</span>
      <i
        ref="viewIconRef"
        class="fa fa-eye result-view-icon"
        data-tooltip="View Result"
        @click.stop="toggleResultPopover"
      ></i>
      <Handle
        class="result-handle-compact"
        type="source"
        :id="props.node.nodeData.id"
        :position="Position.Right"
      />
    </div>

    <!-- Result Data Popover -->
    <UiFixedPopover
      v-model:visible="showResultPopover"
      :target-element="viewIconRef"
      placement="bottom"
      size="lg"
      :show-arrow="true"
      :closable="true"
      title="Execution Result"
    >
      <div class="result-popover-content">
        <div class="result-data">
          <pre v-if="getType !== 'object'" class="data-content-compact">{{
            getVariableData
          }}</pre>
          <UiJsonEditor
            v-else
            :modelValue="getVariableData"
            readonly
            :show-footer="false"
          />
        </div>
      </div>
    </UiFixedPopover>
  </div>
</template>
<script setup lang="ts">
import type { VariablePool, WebflowNode } from "@/apifluxCore/types";
import { Handle } from "@vue-flow/core";
import { computed, ref } from "vue";
import { Position } from "@vue-flow/core";
import { UiJsonEditor, UiFixedPopover } from "@/components/base";

const props = defineProps<{
  node: WebflowNode;
  variablePool: VariablePool;
  envVariableMap: Record<string, string>;
  compact?: boolean;
}>();

// Refs for UiFixedPopover
const showResultPopover = ref(false);
const viewIconRef = ref<HTMLElement>();

// Toggle popover
const toggleResultPopover = () => {
  showResultPopover.value = !showResultPopover.value;
};

const getType = computed(() => {
  return typeof getVariableData.value;
});

const getVariableData = computed(() => {
  // Logic to fetch and return the variable data
  return props.node.nodeData.get(
    props.variablePool || {},
    props.envVariableMap || new Map()
  );
});

// Get result status based on execution state
const getResultStatus = computed(() => {
  // This would be connected to your actual execution state
  const hasError = false; // Replace with actual error checking
  const isExecuting = false; // Replace with actual execution state
  const hasResult =
    getVariableData.value !== undefined && getVariableData.value !== null;

  if (isExecuting) return "status-executing";
  if (hasError) return "status-error";
  if (hasResult) return "status-success";
  return "status-pending";
});

// Get result icon based on status
const getResultIcon = computed(() => {
  const status = getResultStatus.value;
  switch (status) {
    case "status-executing":
      return "fas fa-spinner fa-spin";
    case "status-error":
      return "fas fa-exclamation-triangle";
    case "status-success":
      return "fas fa-check-circle";
    default:
      return "fas fa-clock";
  }
});

// Get result status text
const getResultStatusText = computed(() => {
  const status = getResultStatus.value;
  switch (status) {
    case "status-executing":
      return "Executing";
    case "status-error":
      return "Error";
    case "status-success":
      return "Success";
    default:
      return "Pending";
  }
});

// Get execution time (mock - replace with actual timing)
const getExecutionTime = computed(() => {
  // This would be connected to your actual execution timing
  return null; // Replace with actual execution time
});
</script>
<style scoped>

.node-result-block-compact {
  border-left: 1px solid var(--color-border-subtle);
  padding-left: var(--spacing-xs);
}

/* Compact Result Header */
.result-header-compact {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
  padding: 2px 0;
  position: relative;
}

.result-status-indicator {
  width: 16px;
  height: 16px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  flex-shrink: 0;
}

.result-status-indicator.status-pending {
  background: var(--color-warning-light);
  color: var(--color-warning-dark);
}

.result-status-indicator.status-executing {
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
}

.result-status-indicator.status-success {
  background: var(--color-success-light);
  color: var(--color-success-dark);
}

.result-status-indicator.status-error {
  background: var(--color-danger-light);
  color: var(--color-danger-dark);
}

.result-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex: 1;
}

.result-view-icon {
  font-size: 10px;
  cursor: pointer;
  color: var(--color-text-tertiary);
  padding: 2px;
  border-radius: var(--radius-xs);
  transition: all var(--transition-fast);
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-view-icon:hover {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

/* Result Handle */
.result-handle-compact {
  width: 8px;
  height: 8px;
  background: var(--color-success);
  border: 2px solid var(--color-background);
  border-radius: var(--radius-full);
  position: absolute;
  top: 50%;
  right: -6px;
  transform: translateY(-50%);
  transition: all var(--transition-normal);
}

.result-handle-compact:hover {
  background: var(--color-success-hover);
  transform: translateY(-50%) scale(1.2);
}

/* Popover Content Styling */
.result-popover-content {
  padding: var(--spacing-sm);
  min-width: 300px;
  max-width: 400px;
}

.result-meta {
  background: var(--color-background-subtle);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.meta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xs);
}

.meta-item:last-child {
  margin-bottom: 0;
}

.meta-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.meta-value {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  font-family: var(--font-family-mono);
}

.meta-value.status-pending {
  color: var(--color-warning);
}

.meta-value.status-executing {
  color: var(--color-primary);
}

.meta-value.status-success {
  color: var(--color-success);
}

.meta-value.status-error {
  color: var(--color-danger);
}

.result-data {
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-sm);
  overflow: hidden;
  max-height: 300px;
  overflow-y: auto;
}

.data-content-compact {
  background: var(--color-background-code);
  color: var(--color-text-code);
  padding: var(--spacing-sm);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  border: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .node-result-block-compact {
    padding: 2px var(--spacing-xs);
    min-height: 44px;
  }

  .result-header-compact {
    gap: 2px;
  }

  .result-status-indicator {
    width: 14px;
    height: 14px;
    font-size: 7px;
  }

  .result-label {
    font-size: 10px;
  }

  .result-view-icon {
    width: 14px;
    height: 14px;
    font-size: 8px;
  }

  .result-preview-compact {
    padding: 2px var(--spacing-xs);
    min-height: 20px;
  }

  .result-preview-text {
    font-size: 10px;
  }

  .result-popover-content {
    min-width: 280px;
    max-width: 320px;
  }
}
</style>