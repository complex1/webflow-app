<template>
  <div class="api-node">
    <NodeHeader :data="data" @edit="onEdit" @delete="onDelete" @view="viewDetail = true" />
    <ApiNodeUrl :data="data" :variable-pool="variablePool" :env-variable-map="envVariableMap" />
    <div class="node-content-group">
      <div class="node-content p-xs">
        <div v-if="data.method !== 'GET'" class="api-node-property">
          <VariableView :variable="data.body" :variable-pool="variablePool" :env-variable-map="envVariableMap" />
        </div>
        <div v-if="data.headers.length" class="api-node-property">
          <div class="api-node-property-title">Headers</div>
          <VariableView
            v-for="(value, key) in data.headers"
            :key="key"
            :variable="value"
            :variable-pool="variablePool"
            :env-variable-map="envVariableMap"
          />
        </div>
        <div v-if="data.queryParams.length" class="api-node-property mt-sm">
          <div class="api-node-property-title">Query Parameters</div>
          <VariableView
            v-for="(value, key) in data.queryParams"
            :key="key"
            :variable="value"
            :variable-pool="variablePool"
            :env-variable-map="envVariableMap"
          />
        </div>
        <div v-if="data.pathParams.length" class="api-node-property mt-sm">
          <div class="api-node-property-title">Path Parameters</div>
          <VariableView
            v-for="(value, key) in data.pathParams"
            :key="key"
            :variable="value"
            :variable-pool="variablePool"
            :env-variable-map="envVariableMap"
          />
        </div>
      </div>
      <NodeResultBlock :node="data" :variable-pool="variablePool" :env-variable-map="envVariableMap" />
    </div>
  </div>
  <UiModal v-model:visible="viewDetail" title="API Node Details" size="xl">
    <ApiNodeDetail :apiNode="data" @edit="onEdit" @delete="onDelete" :global-store="variablePool" />
  </UiModal>
</template>

<script setup lang="ts">
import NodeHeader from "./nodeWidgets/nodeHeader.vue";
import { ApiNode } from "@/apifluxCore/nodes/apiNode";
import ApiNodeUrl from "./nodeWidgets/apiNodeUrl.vue";
import VariableView from "./nodeWidgets/variableView.vue";
import NodeResultBlock from "./nodeWidgets/nodeResultBlock.vue";
import { UiModal } from "@/components/base";
import ApiNodeDetail from "../forms/nodeDetails/apiNodeDetail.vue";
import { ref } from "vue";
import type { VariablePool } from "@/apifluxCore/types";

const props = defineProps<{
  data: ApiNode;
  variablePool: VariablePool;
  envVariableMap: Record<string, string>;
}>();

const emit = defineEmits<{
  (e: "edit", node: ApiNode): void;
  (e: "delete", node: ApiNode): void;
}>();


const viewDetail = ref(false);

const onEdit = () => {
  emit("edit", props.data);
};
const onDelete = () => {
  emit("delete", props.data);
};

</script>

<style scoped>
.api-node {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-background);
  width: 300px;
  position: relative;
}

.api-node-property-title {
  font-weight: 600;
  font-size: var(--font-size-xs);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--spacing-xs);
}

.api-node-property {
  margin-bottom: var(--spacing-sm);
  padding: var(--spacing-xs);
  background: var(--color-background-secondary);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.node-content-group {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-sm);
  position: relative;
  z-index: 2;
}

.node-content {
  border-radius: var(--radius-sm);
}
</style>