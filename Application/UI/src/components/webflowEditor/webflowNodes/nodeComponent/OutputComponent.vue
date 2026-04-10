<template>
  <Stack gap="xs" fullWidth>
    <Inline
      class="output-variable"
      justify="flex-end"
      align="center"
      fullWidth
      gap="sm"
    >
      <div class="variable-name">Output</div>
      <Popover @update:open="toggleViewValue">
        <Icon name="eye" class="card-menu__icon" size="xs" />
        <template #content>
          <div v-if="isDataTypeJson" class="json-variable-viewer">
            <JsonEditor :modelValue="variableValue" :readOnly="true" />
          </div>
          <div v-else class="text-variable-viewer">
            {{ variableValue }}
          </div>
        </template>
      </Popover>
      <Handle
        class="output-variable-handle"
        type="source"
        :id="variable.id"
        :position="Position.Right"
      ></Handle>
    </Inline>
    <Inline
      v-if="props.error && props.error.length > 0"
      class="output-variable-error"
      gap="xs"
      align="center"
    >
      <Icon name="exclamation-triangle" tone="danger" size="xs" />
      <span class="error-text">{{ props.error }}</span>
    </Inline>
  </Stack>
</template>
<script setup lang="ts">
import Inline from "@/components/common/foundation/Inline.vue";
import { Handle, Position } from "@vue-flow/core";
import { ref } from "vue";
import Icon from "@/components/common/utils/Icon.vue";
import JsonEditor from "@/components/common/data/JsonEditor.vue";
import type Variable from "@/apifluxCore/classes/variable";
import Stack from "@/components/common/foundation/Stack.vue";
import type { VariablePool, envVariableMap } from "@/apifluxCore/types";
const props = defineProps<{
  variable: Variable;
  nodeId: string;
  error: string | null | undefined;
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
.output-variable {
  position: relative;
  padding: 0 var(--space-2);
  font-size: var(--text-xs);
}
.output-variable-error {
  color: var(--text-danger);
  padding: 0 var(--space-2);
  font-size: var(--text-xxs);
}
.error-text {
  line-height: 1.2;
}
.output-variable-handle {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--port-output);
  border: 1px solid var(--port-border);
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
}
.variable-name {
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