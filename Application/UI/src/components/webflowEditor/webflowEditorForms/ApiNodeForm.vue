<template>
  <Stack class="api-node-form" gap="md">
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

    <StringVariable
      :variable="node.baseUrl"
      :envVarList="envVarList"
      :fieldName="'Base URL'"
    />

    <StringVariable
      :variable="node.url"
      :envVarList="envVarList"
      :fieldName="'Endpoint URL'"
    />

    <SelectInput
      v-model="node.method"
      :options="
        ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'].map(
          (method) => ({
            label: method,
            value: method,
          })
        )
      "
      label="HTTP Method"
      fullWidth
    />

    <CollapsePanel
      v-if="['POST', 'PUT', 'PATCH'].includes(node.method)"
      title="Body Parameters"
      :defaultOpen="true"
      ref="bodyParamsPanel"
    >
      <VariableForm :variable="node.body" has-default-type has-default-name />
    </CollapsePanel>

    <CollapsePanel
      :title="`Headers ${
        node.headers.length ? `(${node.headers.length})` : ''
      }`"
      :defaultOpen="false"
      ref="headersPanel"
    >
      <template #actions>
        <IconButton
          size="sm"
          @click.stop="addHeader"
          icon="plus"
          variant="secondary"
        >
        </IconButton>
      </template>
      <Stack v-if="node.headers.length > 0" gap="sm" class="headers-stack">
        <VariableForm
          v-for="(header, index) in node.headers"
          :key="index"
          :label="`Header ${index + 1}`"
          :variable="header"
          :envVarList="envVarList"
          has-default-type
          :showBottomBorder="index < node.headers.length - 1"
          show-delete-button
          @delete="node.headers.splice(index, 1)"
        />
      </Stack>
      <EmptyStateText v-else>
        <template #title>No Headers Added</template>
        Add headers to your API request to include additional information such
        as authentication tokens, content types,
      </EmptyStateText>
    </CollapsePanel>

    <CollapsePanel
      :title="`Query Parameters ${
        node.queryParams.length ? `(${node.queryParams.length})` : ''
      }`"
      :defaultOpen="false"
      ref="queryParamsPanel"
    >
      <template #actions>
        <IconButton
          size="sm"
          @click.stop="addQueryParam()"
          icon="plus"
          variant="secondary"
        >
        </IconButton>
      </template>
      <Stack
        v-if="node.queryParams.length > 0"
        gap="sm"
        class="query-params-stack"
      >
        <VariableForm
          v-for="(param, index) in node.queryParams"
          :key="index"
          :label="`Query Parameter ${index + 1}`"
          :variable="param"
          :envVarList="envVarList"
          has-default-type
          :showBottomBorder="index < node.queryParams.length - 1"
          show-delete-button
          @delete="node.queryParams.splice(index, 1)"
        />
      </Stack>
      <EmptyStateText v-else>
        <template #title>No Query Parameters Added</template>
        Add query parameters to your API request to filter or modify the data
        returned by the server.
      </EmptyStateText>
    </CollapsePanel>

    <CollapsePanel
      :title="`Path Parameters ${
        node.pathParams.length ? `(${node.pathParams.length})` : ''
      }`"
      :defaultOpen="false"
      ref="pathParamsPanel"
    >
      <template #actions>
        <IconButton
          size="sm"
          @click.stop="addPathParam()"
          icon="plus"
          variant="secondary"
        >
        </IconButton>
      </template>
      <Stack
        v-if="node.pathParams.length > 0"
        gap="sm"
        class="path-params-stack"
      >
        <VariableForm
          v-for="(param, index) in node.pathParams"
          :key="index"
          :label="`Path Parameter ${index + 1}`"
          :variable="param"
          :envVarList="envVarList"
          has-default-type
          :showBottomBorder="index < node.pathParams.length - 1"
          show-delete-button
          @delete="node.pathParams.splice(index, 1)"
        />
      </Stack>
      <EmptyStateText v-else>
        <template #title>No Path Parameters Added</template>
        Add path parameters to your API request to specify dynamic values in the
        URL path.
      </EmptyStateText>
    </CollapsePanel>
    <ErrorList :errors="errorList"></ErrorList>
    <Inline justify="end" gap="sm">
      <Button variant="secondary" @click="onCancel">Cancel</Button>
      <Button variant="primary" @click="onSave">Save</Button>
    </Inline>
  </Stack>
</template>
<script setup lang="ts">
import type HttpNode from "@/apifluxCore/classes/httpNode";
import StringVariable from "./formComponent/stringVariable.vue";
import Variable from "@/apifluxCore/classes/variable";
import VariableForm from "./formComponent/variableForm.vue";
import { validateNode } from "@/apifluxCore/validation";
import ErrorList from "@/components/common/feedback/ErrorList.vue";
import type { ValidationError } from "@/apifluxCore/types";
import { ref } from "vue";

const props = defineProps<{
  node: HttpNode;
  envVarList: string[];
}>();
const emit = defineEmits<{
  (e: "change", value: HttpNode): void;
  (e: "close"): void;
}>();
const errorList = ref<ValidationError[]>([]);

const addHeader = () => {
  const header = new Variable();
  props.node.headers.push(header);
};
const addQueryParam = () => {
  const param = new Variable();
  props.node.queryParams.push(param);
};

const addPathParam = () => {
  const param = new Variable();
  props.node.pathParams.push(param);
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
<style scoped></style>