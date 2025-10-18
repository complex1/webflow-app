<template>
  <div class="webflow-playground-canvas">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :fit-view-on-init="true"
      @node-drag="onNodeDrag"
      @connect="onConnect"
      @edges-change="onEdgeChange"
    >
      <Background />
      <MiniMap
        pannable
        zoomable
        position="bottom-left"
        backgroundColor="#f0f0f0"
        :nodeStrokeWidth="2"
        :nodeBorderRadius="4"
        :nodeBorderWidth="1"
        :nodeWidth="100"
        :nodeHeight="50"
      />
      <Controls position="top-right" class="horizontal-controls"></Controls>
      <template #node-API="nodeData">
        <ApiNodeComponent
          v-if="getApiNodeById(nodeData.id)"
          :data="getApiNodeById(nodeData.id)"
          :variablePool="variablePool"
          :envVariableMap="envVariableMap"
          @delete="onDelete"
          @edit="onEdit"
        />
      </template>
      <template #node-FUNCTIONAL="nodeData">
        <FunctionalNodeComponent
          v-if="getFunctionalNodeById(nodeData.id)"
          :data="getFunctionalNodeById(nodeData.id)"
          :variablePool="variablePool"
          :envVariableMap="envVariableMap"
          @delete="onDelete"
          @edit="onEdit"
        />
      </template>
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import type {
  Node,
  Edge,
  NodeDragEvent,
  Connection,
  EdgeChange,
} from "@vue-flow/core";
import { VueFlow } from "@vue-flow/core";
import { MiniMap } from "@vue-flow/minimap";
import { Background } from "@vue-flow/background";
import { Controls } from "@vue-flow/controls";
import { ref } from "vue";
import type { VariablePool, WebflowNode } from "@/apifluxCore/types";
import type { ApiNode } from "@/apifluxCore/nodes/apiNode";
import ApiNodeComponent from "./nodes/apiNode.vue";
import FunctionalNodeComponent from "./nodes/functionalNode.vue";
import FunctionalNode from "@/apifluxCore/nodes/functionalNode";

const props = defineProps<{
  nodes: Node[];
  edges: Edge[];
  nodeMap: Record<string, WebflowNode>;
  variablePool: VariablePool,
  envVariableMap: Record<string, string>
}>();

const emit = defineEmits<{
  (e: "node-drag", event: NodeDragEvent): void;
  (e: "connect", connection: Connection): void;
  (e: "edge-delete", edgeId: string): void;
  (e: "editNode", node: WebflowNode): void;
  (e: "deleteNode", node: WebflowNode): void;
}>();

// Track selected edge
// const selectedEdgeId = ref<string | null>(null);

const getApiNodeById = (id: string): ApiNode => {
  return props.nodeMap[id] as ApiNode;
};
const getFunctionalNodeById = (id: string): FunctionalNode => {
  return props.nodeMap[id] as FunctionalNode;
};
const onDelete = (node: WebflowNode) => {
  emit("deleteNode", node)
};
const onEdit = (node: WebflowNode) => {
  emit("editNode", node)
}

// Handle node drag event
const onNodeDrag = (event: NodeDragEvent) => {
  emit("node-drag", event);
};

// Handle edge connect event
const onConnect = (connection: Connection) => {
  emit("connect", connection);
};

const onEdgeChange = (changes: EdgeChange[]) => {
  changes.forEach((change) => {
    if (change.type === "remove") {
      emit("edge-delete", change.id);
    }
  });
};

</script>

<style scoped>
.webflow-playground-canvas {
  width: 100%;
  height: 100%;
}
</style>