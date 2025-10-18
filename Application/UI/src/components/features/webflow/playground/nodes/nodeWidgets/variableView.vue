<template>
  <div class="variable-view px-sm">
    <Handle
      class="variable-handle"
      type="target"
      :id="props.variable.id"
      :position="Position.Left"
    />
    <div class="variable-name">{{ props.variable.name }}</div>
    <UiPopover trigger="click" placement="bottom">
      <template #trigger>
        <i class="fa fa-eye" data-tooltip="View Data"></i>
      </template>
      <div style="max-height: 310px; width: 300px; overflow: auto">
        <pre v-if="getType !== 'object'" class="data-content">{{
          getVariableData
        }}</pre>
        <UiJsonEditor
          v-else
          :modelValue="getVariableData"
          readonly
          :show-footer="false"
        />
      </div>
    </UiPopover>
  </div>
</template>

<script setup lang="ts">
import type Variable from "@/apifluxCore/nodes/variable";
import { Handle } from "@vue-flow/core";
import { computed } from "vue";
import { Position } from "@vue-flow/core";
import { UiJsonEditor, UiPopover } from "@/components/base";
import type { VariablePool } from "@/apifluxCore/types";

const props = defineProps<{
  variable: Variable;
  variablePool?: VariablePool;
  envVariableMap?: Record<string, string>;
}>();

const getType = computed(() => {
  return typeof getVariableData.value;
});

const getVariableData = computed(() => {
  return props.variable.get(props.variablePool || {}, props.envVariableMap || {});
});
</script>

<style scoped>
.variable-view {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-size-sm);
  width: 160px;
  padding: var(--spacing-xs);
  background: var(--color-background-elevated);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border-subtle);
  margin-bottom: var(--spacing-xs);
  transition: all 0.2s ease;
}

.variable-view:hover {
  background: var(--color-background-hover);
  border-color: var(--color-primary);
}

.variable-handle {
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  border: 2px solid var(--color-background);
  border-radius: 50%;
  top: 50%;
  left: -8px;
  transform: translateY(-40%);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.variable-handle:hover {
  transform: translateY(-40%) scale(1.1);
  box-shadow: var(--shadow-md);
}

.variable-name {
  flex-grow: 1;
  margin-left: var(--spacing-sm);
  color: var(--color-text-primary);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fa.fa-eye {
  position: relative;
  font-size: var(--font-size-sm);
  margin-left: var(--spacing-xs);
  cursor: pointer;
  color: var(--color-primary);
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}

.fa.fa-eye:hover {
  background: var(--color-primary-subtle);
  color: var(--color-primary-bright);
  transform: scale(1.1);
}

.data-content {
  background: var(--color-background-code);
  color: var(--color-text-code);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>