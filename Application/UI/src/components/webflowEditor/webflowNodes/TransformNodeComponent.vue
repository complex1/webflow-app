<template>
  <NodeCard v-if="node" :type="node.type" :id="node.id">
    <NodeHeader
      :node="node"
      :read-only="readOnly"
      @edit="$emit('edit', node.id)"
      @delete="$emit('delete', node.id)"
      @view="$emit('view', node.id)"
    />
    <TransformMethod :node="node" />
    <div class="io-container">
      <div class="i-container">
        <div class="label-name">Input:</div>
        <InputVariables
          v-for="param in node.parameters"
          :key="param.id"
          :variable="param"
          :nodeId="node.id"
          :globalStore="globalStore"
          :envVariableMap="envVariableMap"
        />
      </div>
      <OutputVariables
        :nodeId="node.id"
        :variable="node.nodeData"
        :error="node.error"
        :globalStore="globalStore"
        :envVariableMap="envVariableMap"
      />
    </div>
  </NodeCard>
</template>
<script setup lang="ts">
import type TransformNode from "@/apifluxCore/classes/transformNode";
import NodeCard from "./nodeComponent/NodeCard.vue";
import NodeHeader from "./nodeComponent/NodeHeader.vue";
import InputVariables from "./nodeComponent/InputVariables.vue";
import OutputVariables from "./nodeComponent/OutputComponent.vue";
import TransformMethod from "./nodeComponent/TransformMethod.vue";
import type { VariablePool, envVariableMap } from "@/apifluxCore/types";

const props = withDefaults(
  defineProps<{
    node?: TransformNode;
    globalStore: VariablePool;
    envVariableMap: envVariableMap;
    readOnly?: boolean;
  }>(),
  { readOnly: false }
);
const emit = defineEmits<{
  (e: "edit", id: string): void;
  (e: "delete", id: string): void;
  (e: "view", id: string): void;
}>();
</script>
<style scoped>
.io-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
}
.label-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 var(--space-1);
  font-size: var(--text-xs);
}
</style>