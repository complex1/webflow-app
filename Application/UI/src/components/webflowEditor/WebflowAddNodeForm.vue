<template>
  <div class="webflow-add-node-form">
    <ApiNodeForm
      v-if="nodeData?.type === NodeType.API"
      :node="nodeData"
      :envVarList="envVarList"
      @close="emit('close')"
      @change="emit('change', $event)"
    />
    <TransformNodeForm
      v-else-if="nodeData?.type === NodeType.TRANSFORM"
      :node="nodeData"
      :envVarList="envVarList"
      @close="emit('close')"
      @change="emit('change', $event)"
    />

    <ApiNodeByCurl
      v-if="curlFormVisible"
      @cancel="handleCurlCancel"
      @converted="handleCurlConverted"
    />

    <OpenApiSelector
      v-if="openApiSelectorVisible"
      @cancel="handleOpenApiCancel"
      @add="handleOpenApiAdd"
    />
  </div>
</template>

<script setup lang="ts">
import HttpNode from "@/apifluxCore/classes/httpNode";
import TransformNode from "@/apifluxCore/classes/transformNode";
import { onMounted, ref } from "vue";
import ApiNodeForm from "./webflowEditorForms/ApiNodeForm.vue";
import { NodeType, type WebflowNode } from "@/apifluxCore/types";
import TransformNodeForm from "./webflowEditorForms/TransformNodeForm.vue";
import type { UseApiFluxReturn } from "@/apifluxCore/composable";
import ApiNodeByCurl from "./webflowEditorForms/ApiNodeByCurl.vue";
import OpenApiSelector from "./webflowEditorForms/OpenApiSelector.vue";
import type { NodeOption, ExtractedAPI } from "@/types";
import Variable from "@/apifluxCore/classes/variable";

const props = defineProps<{
  type: NodeOption;
  mode: "create" | "edit";
  editId: string | null;
  envVarList: string[];
  apifluxComposable: UseApiFluxReturn;
}>();
const emit = defineEmits<{
  (e: "close"): void;
  (e: "change", value: WebflowNode): void;
}>();
const nodeData = ref<any>(null);
const curlFormVisible = ref(false);
const openApiSelectorVisible = ref(false);

onMounted(() => {
  // Load node data if in edit mode
  if (props.mode === "edit" && props.editId) {
    const nodes = props.apifluxComposable.nodeMap.value;
    if (props.editId in nodes) {
      const nodeType = nodes[props.editId]?.type;
      switch (nodeType) {
        case NodeType.API:
          nodeData.value = new HttpNode();
          break;
        case NodeType.TRANSFORM:
          nodeData.value = new TransformNode();
          break;
      }
      nodeData.value.deserialized(nodes[props.editId]);
    }
  } else {
    // Initialize empty data for create mode
    switch (props.type) {
      case "api":
        nodeData.value = new HttpNode();
        break;
      case "transform":
        nodeData.value = new TransformNode();
        break;
      case "curl":
        curlFormVisible.value = true;
        break;
      case "openapi":
        openApiSelectorVisible.value = true;
        break;
    }
  }
});

const handleCurlConverted = (node: WebflowNode) => {
  curlFormVisible.value = false;
  nodeData.value = node;
};

const handleCurlCancel = () => {
  curlFormVisible.value = false;
  emit("close");
};

const apiConfigToNode = (apiConfig: ExtractedAPI[]): WebflowNode[] => {
  const webflowNodes: WebflowNode[] = [];

  apiConfig.forEach((api) => {
    const node = new HttpNode();
    node.name = api.name;
    node.description = api.description || '';
    node.url = new Variable({
      name: 'url',
      description: 'API Endpoint URL',
      defaultValue: api.url,
      type: 'string'
    });
    node.baseUrl = new Variable({
      name: 'baseUrl',
      description: 'Base URL',
      defaultValue: '',
      type: 'string'
    });
    node.method = api.method;
    node.headers = (api.header || []).map(header => new Variable({
      name: header.name,
      description: header.description || '',
      defaultValue: '',
      type: header.type
    }));
    node.queryParams = (api.queryParam || []).map(param => new Variable({
      name: param.name,
      description: param.description || '',
      defaultValue: '',
      type: param.type
    }));
    node.pathParams = (api.pathParam || []).map(param => new Variable({
      name: param.name,
      description: param.description || '',
      defaultValue: '',
      type: param.type
    }));
    node.body = new Variable({
      name: 'body',
      description: 'Request Body',
      defaultValue: api.body || null,
      type: 'object'
    });
    webflowNodes.push(node);
  });
  return webflowNodes;
}

const handleOpenApiAdd = (apis: ExtractedAPI[]) => {
  openApiSelectorVisible.value = false;
  console.log('Selected APIs from OpenAPI:', apis);
  apiConfigToNode(apis).forEach((node) => emit("change", node));
  emit("close");
};

const handleOpenApiCancel = () => {
  openApiSelectorVisible.value = false;
  emit("close");
};
</script>

<style scoped></style>
