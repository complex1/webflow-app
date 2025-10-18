<template>
  <WidgetMeta
    :name="localApiNode.name"
    :description="localApiNode.description"
    @onUpdate="updateMeta"
  ></WidgetMeta>
  <div
    style="
      display: grid;
      grid-template-columns: 100px 1fr;
      gap: var(--spacing-md);
    "
  >
    <UiDropdown
      v-model="localApiNode.method"
      :options="['GET', 'POST', 'PUT', 'DELETE']"
      label="Method"
      placeholder="Select method..."
    />
    <OnlyStringForm
      label="Base URL"
      :variable="localApiNode?.baseUrl"
      :envVariablesNames="envVariablesNames"
      @onUpdate="onChangeBaseUrl"
    ></OnlyStringForm>
  </div>
  <OnlyStringForm
    label="URL"
    :variable="localApiNode?.url"
    @onUpdate="onChangeUrl"
  ></OnlyStringForm>
  <UiExpansionPanel v-if="localApiNode.method != 'GET'" title="Body" :showAddButton="false">
    <VariableForm
      :variable="localApiNode.body || new Variable({ name: 'body', type: 'object' })"
      :envVariablesNames="props.envVariablesNames"
      defaultType="object"
      :canRemove="false"
      @onUpdate="setBody($event)"
    ></VariableForm>
  </UiExpansionPanel>
  <UiExpansionPanel
    title="Headers"
    :showAddButton="true"
    @add="addHeader"
    :count="localApiNode.headers.length"
  >
    <div>
      <div class="no-data-found" v-if="localApiNode.headers.length === 0">
        No headers found
      </div>
      <div v-for="(header, index) in localApiNode.headers" :key="header.id">
        <VariableForm
          :variable="header"
          :envVariablesNames="props.envVariablesNames"
          defaultType="string"
          :canRemove="true"
          @onUpdate="onHeaderUpdate($event, index)"
          @onRemove="onRemoveHeader(index)"
        ></VariableForm>
        <hr v-if="index < localApiNode.headers.length - 1" class="my-md" />
      </div>
    </div>
  </UiExpansionPanel>
  <UiExpansionPanel
    title="Query Parameters"
    :showAddButton="true"
    @add="addQueryParam"
    :count="localApiNode.queryParams.length"
  >
    <div>
      <div class="no-data-found" v-if="localApiNode.queryParams.length === 0">
        No query parameters found
      </div>
      <div v-for="(param, index) in localApiNode.queryParams" :key="param.id">
        <VariableForm
          :variable="param"
          :envVariablesNames="props.envVariablesNames"
          defaultType="string"
          :canRemove="true"
          @onUpdate="onQueryParamUpdate($event, index)"
          @onRemove="onRemoveQueryParam(index)"
        ></VariableForm>
        <hr v-if="index < localApiNode.queryParams.length - 1" class="my-md" />
      </div>
    </div>
  </UiExpansionPanel>
  <UiExpansionPanel
    title="Path Parameters"
    :showAddButton="true"
    :count="localApiNode.pathParams.length"
    @add="addPathParam"
  >
    <div class="no-data-found" v-if="localApiNode.pathParams.length === 0">
      No path parameters found
    </div>
    <div v-for="(param, index) in localApiNode.pathParams" :key="param.id">
      <VariableForm
        :variable="param"
        :envVariablesNames="props.envVariablesNames"
        defaultType="string"
        :canRemove="true"
        @onUpdate="onPathParamUpdate($event, index)"
        @onRemove="onRemovePathParam(index)"
      ></VariableForm>
      <hr v-if="index < localApiNode.pathParams.length - 1" class="my-md" />
    </div>
  </UiExpansionPanel>
  <div v-if="errorList.length" class="error-messages my-md">
    <ul>
      <li v-for="(error, idx) in errorList" :key="idx" style="color: red;">
        {{ error }}
      </li>
    </ul>
  </div>
  <div class="flex justify-end gap-sm">
    <UiButton variant="secondary" @click="cancel">Cancel</UiButton>
    <UiButton variant="primary" @click="save">
      Save
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import WidgetMeta from "./formWidgets/widgetMeta.vue";
import VariableForm from "./formWidgets/variableForm.vue";
import OnlyStringForm from "./formWidgets/onlyStringForm.vue";
import { UiExpansionPanel, UiDropdown, UiButton } from "@/components/base";
import { ApiNode } from "@/apifluxCore/nodes/apiNode";
import { onMounted, ref } from "vue";
import { cloneApiNode } from "@/apifluxCore/utils/clone";
import Variable from "@/apifluxCore/nodes/variable";
const props = defineProps({
  apiNode: {
    type: ApiNode,
  },
  envVariablesNames: {
    type: Array as () => string[],
    default: () => [],
  },
});
const emit = defineEmits<{
  (e: "onSave", updatedNode: ApiNode): void;
  (e: "onCancel"): void;
}>();

const localApiNode = ref<ApiNode>(new ApiNode(props.apiNode?.id || ""));
const errorList = ref<string[]>([]);

const updateMeta = (value: {
  name: string | null;
  description: string | null;
  isValid: boolean;
}) => {
  localApiNode.value.name = value.name || "";
  localApiNode.value.description = value.description || "";
};

const onChangeBaseUrl = (updatedVar: Variable) => {
  localApiNode.value.baseUrl?.setConfig(updatedVar);
};
const onChangeUrl = (updatedVar: Variable) => {
  localApiNode.value.url?.setConfig(updatedVar);
};

const setBody = (updatedVar: Variable) => {
  localApiNode.value.body?.setConfig(updatedVar);
};

const addHeader = () => {
  const newHeader = new Variable({ name: "", type: "string" });
  localApiNode.value.headers.push(newHeader);
};
const onHeaderUpdate = (updatedVar: Variable, index: number) => {
  if (localApiNode.value.headers[index]) {
    localApiNode.value.headers[index].setConfig(updatedVar);
  }
};
const onRemoveHeader = (index: number) => {
  localApiNode.value.headers.splice(index, 1);
};

const addQueryParam = () => {
  const newParam = new Variable({ name: "", type: "string" });
  localApiNode.value.queryParams.push(newParam);
};
const onQueryParamUpdate = (updatedVar: Variable, index: number) => {
  if (localApiNode.value.queryParams[index]) {
    localApiNode.value.queryParams[index].setConfig(updatedVar);
  }
};
const onRemoveQueryParam = (index: number) => {
  localApiNode.value.queryParams.splice(index, 1);
};

const addPathParam = () => {
  const newParam = new Variable({ name: "", type: "string" });
  localApiNode.value.pathParams.push(newParam);
};
const onPathParamUpdate = (updatedVar: Variable, index: number) => {
  if (localApiNode.value.pathParams[index]) {
    localApiNode.value.pathParams[index].setConfig(updatedVar);
  }
};
const onRemovePathParam = (index: number) => {
  localApiNode.value.pathParams.splice(index, 1);
};

const save = () => {
  const validation = localApiNode.value.validate(props.envVariablesNames);
  if (!validation.valid) {
    errorList.value = validation.errors;
    return;
  }
  emit("onSave", cloneApiNode(localApiNode.value as ApiNode));
};

const cancel = () => {
  emit("onCancel");
};

onMounted(() => {
  if (props.apiNode) {
    localApiNode.value = cloneApiNode(props.apiNode);
    // Ensure body is a Variable instance if null
    if (localApiNode.value.body == null) {
      localApiNode.value.body = new Variable({ name: "body", type: "object" });
    }
  }
});
</script>

<style scoped>
/* Empty styles */
.no-data-found {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  padding: var(--spacing-md) 0;
}
</style>