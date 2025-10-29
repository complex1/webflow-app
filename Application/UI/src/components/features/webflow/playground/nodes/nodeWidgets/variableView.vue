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
  background: var(--color-background-secondary);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  margin-bottom: var(--spacing-xs);
}

.variable-handle {
  width: 10px;
  height: 10px;
  background: var(--color-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  top: 50%;
  left: -6px;
  transform: translateY(-50%);
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
  color: var(--color-primary);
}

.data-content {
  background: var(--color-background-secondary);
  color: var(--color-text-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>