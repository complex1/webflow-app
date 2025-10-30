<template>
  <div class="variable-view variable-view-compact" :class="{ 'compact': compact }">
    <Handle
      class="variable-handle-compact"
      type="target"
      :id="props.variable.id"
      :position="Position.Left"
    />
    <div class="variable-name-compact">{{ props.variable.name }}</div>
    <i 
      ref="viewIconRef"
      class="fa fa-eye view-icon-compact" 
      data-tooltip="View Data"
      @click.stop="toggleDataPopover"
    ></i>
    
    <!-- Data Popover -->
    <UiFixedPopover
      v-model:visible="showDataPopover"
      :target-element="viewIconRef"
      placement="bottom"
      size="md"
      :show-arrow="true"
      :closable="true"
    >
      <div class="variable-popover-content">
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
    </UiFixedPopover>
  </div>
</template>

<script setup lang="ts">
import type Variable from "@/apifluxCore/nodes/variable";
import { Handle } from "@vue-flow/core";
import { computed, ref } from "vue";
import { Position } from "@vue-flow/core";
import { UiJsonEditor, UiFixedPopover } from "@/components/base";
import type { VariablePool } from "@/apifluxCore/types";

const props = defineProps<{
  variable: Variable;
  variablePool?: VariablePool;
  envVariableMap?: Record<string, string>;
  compact?: boolean;
}>();

// Refs for UiFixedPopover
const showDataPopover = ref(false);
const viewIconRef = ref<HTMLElement>();

// Toggle popover
const toggleDataPopover = () => {
  showDataPopover.value = !showDataPopover.value;
};

const getType = computed(() => {
  return typeof getVariableData.value;
});

const getVariableData = computed(() => {
  return props.variable.get(props.variablePool || {}, props.envVariableMap || {});
});
</script>

<style scoped>
/* Compact Variable View Styling */
.variable-view-compact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-size-xs);
  width: 100%;
  position: relative;
}

.variable-view-compact:hover {
  border-color: var(--color-border);
  background: var(--color-background-hover);
}

.variable-view-compact.compact {
  padding: 1px var(--spacing-xs);
  font-size: 10px;
}

.variable-handle-compact {
  width: 6px;
  height: 6px;
  background: var(--color-accent-cyan);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xs);
  top: 50%;
  left: -4px;
  transform: translateY(-50%);
}

.variable-name-compact {
  flex-grow: 1;
  margin-left: var(--spacing-xs);
  color: var(--color-text-tertiary);
  font-weight: var(--font-weight-medium);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
}

.view-icon-compact {
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

.view-icon-compact:hover {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.variable-popover-content {
  max-height: 250px;
  width: 280px;
  overflow: auto;
}

.data-content-compact {
  background: var(--color-background-secondary);
  color: var(--color-text-primary);
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  line-height: 1.3;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}
</style>