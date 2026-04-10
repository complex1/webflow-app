<template>
  <div class="node-card" :class="`node-card--${props.type.toLowerCase()}`">
    <slot></slot>
    <Handle
      class="variable-handle variable-handle-left"
      type="target"
      :id="props.id"
      :position="Position.Left"
    ></Handle>
    <Handle
      class="variable-handle variable-handle-right"
      type="source"
      :id="props.id"
      :position="Position.Right"
    ></Handle>
  </div>
</template>
<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core";
const props = defineProps<{
  type: string;
  id: string;
}>();
</script>
<style scoped>
.node-card {
  position: relative;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  width: 260px;
  padding-bottom: var(--space-2);
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
}
.node-card--api {
  background: var(--http-node-color);
}
.node-card--transform {
  background: var(--transform-node-color);
}
.variable-handle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid var(--port-border);
}
.variable-handle-left {
  left: -4px;
  top: 20px;
  transform: translateY(-50%);
  background-color: var(--port-input);
}
.variable-handle-right {
  right: -4px;
  top: 20px;
  transform: translateY(-50%);
  background-color: var(--port-output);
}
</style>