<template>
  <Inline class="input-variable"
    justify="space-between"
    align="center"
    fullWidth
    gap="sm"
  >
    <Handle
      class="input-variable-handle"
      type="target"
      :id="variable.id"
      :position="Position.Left"
    ></Handle>
    <div class="variable-name">{{ variable.name }}</div>
    <Popover @update:open="toggleViewValue">
      <Icon
        name="eye"
        class="card-menu__icon"
        size="xs"
      />
      <template #content>
          <div v-if="isDataTypeJson" class="json-variable-viewer">
            <JsonEditor :modelValue="variableValue" :readOnly="true" />
          </div>
          <div v-else class="text-variable-viewer">
            {{ variableValue }}
          </div>
      </template>
    </Popover>
</Inline>
</template>
<script setup lang="ts">
import { ref } from "vue";
import type Variable from "@/apifluxCore/classes/variable";
import { Handle, Position } from "@vue-flow/core";
import JsonEditor from "@/components/common/data/JsonEditor.vue";
import type { envVariableMap, VariablePool } from "@/apifluxCore/types";

const props = defineProps<{
  variable: Variable;
  nodeId: string;
  globalStore: VariablePool;
  envVariableMap: envVariableMap;
}>();
const variableValue = ref(null);
const isDataTypeJson = ref(false);

const toggleViewValue = (val: boolean) => {
  if (val) {
    readVariableValue();
  }
};
const readVariableValue = () => {
  variableValue.value = props.variable.get(props.globalStore, props.envVariableMap);
  isDataTypeJson.value = typeof variableValue.value === "object";
};
</script>
<style scoped>
.input-variable {
  position: relative;
  padding: 0 var(--space-1);
  font-size: var(--text-xs);
}
.input-variable-handle {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: 1px solid var(--port-border);
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--port-input);
}
.variable-name {
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 var(--space-1);
}
.json-variable-viewer {
  font-size: var(--text-xs);
}
.text-variable-viewer {
  font-size: var(--text-sm);
}
</style>