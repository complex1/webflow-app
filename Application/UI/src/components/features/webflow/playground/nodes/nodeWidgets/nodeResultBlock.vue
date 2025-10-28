<template>
  <div class="node-result-block m-xs">
    <div class="node-result-header">Output</div>
    <div class="result-content">
      Result:
      <UiPopover trigger="click" placement="bottom">
        <template #trigger>
          <i
            class="fa fa-eye"
            data-tooltip="View Data"
          ></i>
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

      <Handle
        class="variable-handle"
        type="source"
        :id="props.node.nodeData.id"
        :position="Position.Right"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { VariablePool, WebflowNode } from "@/apifluxCore/types";
const props = defineProps<{
  node: WebflowNode;
  variablePool: VariablePool;
  envVariableMap: Record<string, string>;
}>();
import { Handle } from "@vue-flow/core";
import { computed } from "vue";
import { Position } from "@vue-flow/core";
import { UiJsonEditor, UiPopover } from "@/components/base";

const getType = computed(() => {
  return typeof getVariableData.value;
});
const getVariableData = computed(() => {
  // Logic to fetch and return the variable data
  return props.node.nodeData.get(props.variablePool || {}, props.envVariableMap || new Map());
});

</script>
<style scoped>
.node-result-block {
  width: 120px;
  background: var(--color-background-subtle);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border-subtle);
  backdrop-filter: var(--blur-sm);
}

.node-result-header {
  position: relative;
  font-weight: 600;
  font-size: var(--font-size-sm);
  color: var(--color-success);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--spacing-xs);
}

.result-content {
  position: relative;
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--color-text-primary);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
  background: var(--color-background-elevated);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--color-success);
}

.variable-handle {
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, var(--color-success) 0%, var(--color-accent) 100%);
  border: 2px solid var(--color-background);
  border-radius: 50%;
  top: 50%;
  right: -8px;
  transform: translateY(-40%);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.variable-handle:hover {
  transform: translateY(-40%) scale(1.1);
  box-shadow: var(--shadow-md);
}

.fa.fa-eye {
  cursor: pointer;
  color: var(--color-success);
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}

.fa.fa-eye:hover {
  background: var(--color-success-subtle);
  color: var(--color-success-bright);
  /* transform: scale(1.1); */
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