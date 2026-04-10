<template>
  <Stack class="transform-node-form" gap="md">
    <TextInput
      v-model="node.name"
      label="Node Name"
      placeholder="Node Name"
      fullWidth
      required
    />

    <TextareaInput
      v-model="node.description"
      label="Description"
      placeholder="Description"
      fullWidth
      :rows="2"
    />

    <CollapsePanel
      :title="`Parameters ${
        node.parameters.length ? `(${node.parameters.length})` : ''
      }`"
      :defaultOpen="false"
    >
      <template #actions>
        <IconButton
          size="sm"
          @click.stop="addParameter"
          icon="plus"
          variant="secondary"
        />
      </template>
      <Stack v-if="node.parameters.length > 0" gap="sm" class="params-stack">
        <VariableForm
          v-for="(param, index) in node.parameters"
          :key="index"
          :label="`Parameter ${index + 1}`"
          :variable="param"
          :envVarList="envVarList"
          :showBottomBorder="index < node.parameters.length - 1"
          show-delete-button
          @delete="node.parameters.splice(index, 1)"
        />
      </Stack>
      <EmptyStateText v-else>
        <template #title>No Parameters Added</template>
        Define inputs your transform function will receive.
      </EmptyStateText>
    </CollapsePanel>

    <div class="code-editor-block">
      <label class="code-editor-block__label">Transform Function</label>
      <CodeEditor
        v-model="node.transform"
        :minHeight="'200px'"
        :maxHeight="'320px'"
      />
    </div>

    <ErrorList :errors="errorList" />

    <Inline justify="end" gap="sm">
      <Button variant="secondary" @click="onCancel">Cancel</Button>
      <Button variant="primary" @click="onSave">Save</Button>
    </Inline>
  </Stack>
</template>

<script setup lang="ts">
import TransformNode from "@/apifluxCore/classes/transformNode";
import Variable from "@/apifluxCore/classes/variable";
import { validateNode } from "@/apifluxCore/validation";
import type { ValidationError } from "@/apifluxCore/types";
import VariableForm from "./formComponent/variableForm.vue";
import { ref } from "vue";
import {
  Stack,
  Inline,
  TextInput,
  TextareaInput,
  CollapsePanel,
  IconButton,
  EmptyStateText,
  Button,
  CodeEditor,
} from "@/components/common";
import ErrorList from "@/components/common/feedback/ErrorList.vue";

const props = defineProps<{
  node: TransformNode;
  envVarList: string[];
}>();

const emit = defineEmits<{
  (e: "change", value: TransformNode): void;
  (e: "close"): void;
}>();

const errorList = ref<ValidationError[]>([]);

const addParameter = () => {
  const param = new Variable({ name: "" });
  props.node.parameters.push(param);
};

const onCancel = () => {
  emit("close");
};

const onSave = () => {
  const errors = validateNode(props.node, props.envVarList);
  if (errors.length > 0) {
    errorList.value = errors;
    return;
  }
  emit("change", props.node);
};
</script>

<style scoped>
.params-stack {
  padding-top: var(--space-1);
}
</style>
