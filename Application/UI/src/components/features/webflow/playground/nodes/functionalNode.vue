<template>
  <div class="functional-node">
    <NodeHeader :data="data" @edit="onEdit" @delete="onDelete" @view="onView" />
    <div class="functional-content-group">
      <div class="functional-node-content p-xs">
        <UiPopover trigger="click" placement="bottom">
          <template #trigger>
            <div class="functional-node-property-title">View Method</div>
          </template>
          <div style="height: 310px; width: 300px; overflow: auto">
            <UiCodeMirrorEditor
              :modelValue="data.transform"
              readonly
              :show-footer="false"
            />
          </div>
        </UiPopover>
        <div v-if="data.parameters.length" class="functional-node-property">
          <div class="functional-node-property-title">Parameters</div>
          <VariableView
            v-for="(value, key) in data.parameters"
            :key="key"
            :variable="value"
            :variable-pool="variablePool"
            :env-variable-map="envVariableMap"
          />
        </div>
      </div>
      <NodeResultBlock :node="data" :variable-pool="variablePool" :env-variable-map="envVariableMap" />
    </div>

    <!-- Node Detail Modal -->
    <UiModal v-model:visible="showDetailModal" size="xl" title="Functional Node Details">
      <FunctionalNodeDetail
        :functional-node="data"
        :global-store="variablePool"
        :env-variable-map="envVariableMap"
      />
    </UiModal>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import type FunctionalNode from "@/apifluxCore/nodes/functionalNode";
import NodeHeader from "./nodeWidgets/nodeHeader.vue";
import VariableView from "./nodeWidgets/variableView.vue";
import NodeResultBlock from "./nodeWidgets/nodeResultBlock.vue";
import FunctionalNodeDetail from "../forms/nodeDetails/functionalNodeDetail.vue";

import { UiPopover, UiCodeMirrorEditor, UiModal } from "@/components/base";
import type { VariablePool } from "@/apifluxCore/types";

const props = defineProps<{
  data: FunctionalNode;
  variablePool: VariablePool;
  envVariableMap: Record<string, string>;
}>();

const emit = defineEmits<{
  (e: "edit", node: FunctionalNode): void;
  (e: "delete", node: FunctionalNode): void;
}>();

// Modal state
const showDetailModal = ref(false);

const onEdit = () => {
  emit("edit", props.data);
};

const onDelete = () => {
  emit("delete", props.data);
};

const onView = () => {
  showDetailModal.value = true;
};
</script>
<style scoped>
.functional-node {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-background);
  width: 300px;
  position: relative;
}

.functional-node-property-title {
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-xs);
  color: var(--color-text-primary);
}

.functional-content-group {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-sm);
}
</style>