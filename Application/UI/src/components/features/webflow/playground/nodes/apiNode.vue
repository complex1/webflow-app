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
  border-top: 3px solid var(--gradient-primary);
  border-radius: var(--radius-lg);
  background: var(--color-background-elevated);
  backdrop-filter: var(--blur-md);
  width: 300px;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
  position: relative;
  /* overflow: hidden; */
}

/* .api-node::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-primary);
  z-index: 1;
} */

.api-node:hover {
  /* transform: translateY(-2px); */
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary);
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
  background: var(--color-background-subtle);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--color-accent);
}

.node-content-group {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-sm);
  position: relative;
  z-index: 2;
}

.node-content {
  /* background: linear-gradient(135deg, var(--color-background-subtle) 0%, transparent 100%); */
  border-radius: var(--radius-md);
}
</style>