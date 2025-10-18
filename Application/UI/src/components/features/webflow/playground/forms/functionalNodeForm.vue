<template>
  <WidgetMeta
    :name="localFnNode.name"
    :description="localFnNode.description"
    @onUpdate="updateMeta"
  ></WidgetMeta>
  <UiExpansionPanel
    title="Parameters"
    :showAddButton="true"
    @add="addHeader"
    :count="localFnNode.parameters.length"
  >
    <div>
      <div class="no-data-found" v-if="localFnNode.parameters.length === 0">
        No parameters found
      </div>
      <div v-for="(param, index) in localFnNode.parameters" :key="param.id">
        <VariableForm
          :variable="param"
          :showDescription="true"
          :showType="true"
          :envVariablesNames="props.envVariablesNames"
          :canRemove="true"
          @onUpdate="onParamUpdate($event, index)"
          @onRemove="onRemoveParam(index)"
        ></VariableForm>
        <hr v-if="index < localFnNode.parameters.length - 1" class="my-md" />
      </div>
    </div>
  </UiExpansionPanel>
  <UiExpansionPanel title="Function" :showAddButton="false" :count="0">
    <div class="form-group">
      <label class="form-label" for="function-textarea">Transform Function</label>
      <UiCodeMirrorEditor
        v-model="localFnNode.transform"
      />
      <p class="form-help-text">
        Define a JavaScript function named <code>transform</code> that takes
        <code>params</code> as input and returns the transformed data.
      </p>
    </div>
  </UiExpansionPanel>
  <div class="flex justify-end gap-sm">
    <UiButton variant="secondary" @click="cancel">Cancel</UiButton>
    <UiButton variant="primary" @click="save"> Save </UiButton>
  </div>
</template>
<script setup lang="ts">
import FunctionalNode from "@/apifluxCore/nodes/functionalNode";
import Variable from "@/apifluxCore/nodes/variable";
import { cloneFunctionalNode } from "@/apifluxCore/utils/clone";
import { defineProps, onMounted, ref } from "vue";
import WidgetMeta from "./formWidgets/widgetMeta.vue";
import VariableForm from "./formWidgets/variableForm.vue";
import { UiExpansionPanel, UiButton, UiCodeMirrorEditor } from "@/components/base";

const props = defineProps({
  fnNode: {
    type: Object as () => FunctionalNode,
  },
  envVariablesNames: {
    type: Array as () => string[],
    default: () => [],
  },
});

const emit = defineEmits<{
  (e: "onSave", updatedNode: FunctionalNode): void;
  (e: "onCancel"): void;
}>();

const localFnNode = ref<FunctionalNode>(
  new FunctionalNode({
    id: props.fnNode?.id || "",
    parameters: props.fnNode?.parameters || [],
    transform: props.fnNode?.transform || "",
  })
);

const updateMeta = (value: {
  name: string | null;
  description: string | null;
  isValid: boolean;
}) => {
  localFnNode.value.name = value.name || "";
  localFnNode.value.description = value.description || "";
};

const addHeader = () => {
  localFnNode.value.parameters.push(
    new Variable({
      name: `param_${localFnNode.value.parameters.length + 1}`,
      type: "string",
    })
  );
  localFnNode.value.parameters = [...localFnNode.value.parameters];
};
const onParamUpdate = (updatedVar: Variable, index: number) => {
  if (localFnNode.value.parameters[index]) {
    localFnNode.value.parameters[index].setConfig(updatedVar);
  }
};
const onRemoveParam = (index: number) => {
  localFnNode.value.parameters.splice(index, 1);
  localFnNode.value.parameters = [...localFnNode.value.parameters];
};

const save = () => {
  emit("onSave", cloneFunctionalNode(localFnNode.value as FunctionalNode));
};
const cancel = () => {
  emit("onCancel");
};

onMounted(() => {
  if (props.fnNode) {
    localFnNode.value = cloneFunctionalNode(props.fnNode as FunctionalNode);
  }
});
</script>
<style scoped>
.no-data-found {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  padding: var(--spacing-md) 0;
}
</style>