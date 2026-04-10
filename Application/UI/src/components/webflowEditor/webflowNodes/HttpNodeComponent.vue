<template>
  <NodeCard v-if="node" :type="node.type" :id="node.id">
    <NodeHeader
      :node="node"
      :read-only="readOnly"
      @edit="$emit('edit', node.id)"
      @delete="$emit('delete', node.id)"
      @view="$emit('view', node.id)"
    />
    <HttpUrlNode :node="node" />
    <div class="io-container">
      <div class="i-container">
        <InputVariables
          v-if="hasBody"
          :variable="node.body"
          :nodeId="node.id"
          :globalStore="globalStore"
          :envVariableMap="envVariableMap"
        />
        <div v-if="hasHeaders">
          <div class="label-name">Headers:</div>
          <InputVariables
            v-for="param in node.headers"
            :key="param.id"
            :variable="param"
            :nodeId="node.id"
            :globalStore="globalStore"
            :envVariableMap="envVariableMap"
          />
        </div>
        <div v-if="hasQueryParams">
          <div class="label-name">Query Parameters:</div>
          <InputVariables
            v-for="param in node.queryParams"
            :key="param.id"
            :variable="param"
            :nodeId="node.id"
            :globalStore="globalStore"
            :envVariableMap="envVariableMap"
          />
        </div>
        <div v-if="hasPathParams">
          <div class="label-name">Path Parameters:</div>
          <InputVariables
            v-for="param in node.pathParams"
            :key="param.id"
            :variable="param"
            :nodeId="node.id"
            :globalStore="globalStore"
            :envVariableMap="envVariableMap"
          />
        </div>
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
import type HttpNode from "@/apifluxCore/classes/httpNode";
import { computed } from "vue";
import InputVariables from "./nodeComponent/InputVariables.vue";
import HttpUrlNode from "./nodeComponent/HttpUrlNode.vue";
import NodeHeader from "./nodeComponent/NodeHeader.vue";
import NodeCard from "./nodeComponent/NodeCard.vue";
import OutputVariables from "./nodeComponent/OutputComponent.vue";
import type { VariablePool, envVariableMap } from "@/apifluxCore/types";

const props = withDefaults(
  defineProps<{
    node?: HttpNode;
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
const hasBody = computed(() => {
  if (
    props.node?.method === "POST" ||
    props.node?.method === "PUT" ||
    props.node?.method === "PATCH"
  ) {
    return true;
  }
  return false;
});
const hasHeaders = computed(
  () => props.node?.headers && props.node.headers.length > 0
);
const hasQueryParams = computed(
  () => props.node?.queryParams && props.node.queryParams.length > 0
);
const hasPathParams = computed(
  () => props.node?.pathParams && props.node.pathParams.length > 0
);
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
  font-weight: 500;
  border-top: 1px solid var(--text-secondary);
}
</style>