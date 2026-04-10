<template>
<div class="webflow-editor-canvas">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :fit-view-on-init="true"
      :max-zoom="2"
      :min-zoom="0.1"
      :nodes-draggable="!readOnly"
      :nodes-connectable="!readOnly"
      :edges-connectable="!readOnly"
      zoom-on-scroll
      pan-on-scroll
      pan-on-drag
      @node-drag="onNodeDrag"
      @connect="onConnect"
      @nodes-change="onNodesChange"
      @edges-change="onEdgeChange"
      class="webflow-editor-canvas__flow"
    >
      <Background
        variant="lines"
        :gap="10"
        :lineWidth="1"
        :color="themeStore.isDarkTheme ? 'rgba(255,255,255, 0.1)' : 'rgba(0,0,0,0.1)'"
      />
      <MiniMap
        pannable
        zoomable
        position="bottom-left"
        :node-color="getNodeColor"
        :node-stroke-width="2"
        :node-border-radius="8"
        :node-border-width="1"
        class="neo-minimap"
      />
      <Controls position="top-right" class="neo-controls" />

       <!-- API Node Template -->
      <template #node-API="nodeData">
        <HttpNodeComponent
          class="flow-node api-flow-node"
          v-if="getHttpNode(nodeData.id)"
          :node="getHttpNode(nodeData.id)"
          :read-only="readOnly"
          :globalStore="props.apifluxComposable.globalVariableStore.value"
          :envVariableMap="props.apifluxComposable.envVariableMap.value"
          @edit="$emit('edit', nodeData.id)"
          @delete="$emit('delete', nodeData.id)"
          @view="$emit('view', nodeData.id)"
        />
      </template>

      <!-- Transform Node Template -->
      <template #node-TRANSFORM="nodeData">
        <TransformNodeComponent
          class="flow-node transform-flow-node"
          v-if="getTransformNode(nodeData.id)"
          :node="getTransformNode(nodeData.id)"
          :read-only="readOnly"
          :globalStore="props.apifluxComposable.globalVariableStore.value"
          :envVariableMap="props.apifluxComposable.envVariableMap.value"
          @edit="$emit('edit', nodeData.id)"
          @delete="$emit('delete', nodeData.id)"
          @view="$emit('view', nodeData.id)"
        />
      </template>
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { VueFlow, type Connection, type EdgeChange, type NodeDragEvent } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'
import HttpNodeComponent from './webflowNodes/HttpNodeComponent.vue'
import TransformNodeComponent from './webflowNodes/TransformNodeComponent.vue'
import type { UseApiFluxReturn } from '@/apifluxCore/composable'
import type HttpNode from '@/apifluxCore/classes/httpNode'
import { computed } from 'vue'
import type TransformNode from '@/apifluxCore/classes/transformNode'
import { NodeType } from '@/apifluxCore/types'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore();
const props = withDefaults(
  defineProps<{
    apifluxComposable: UseApiFluxReturn;
    /** View mode: pan/zoom only, no graph edits. */
    readOnly?: boolean;
  }>(),
  { readOnly: false }
);

const emit = defineEmits<{
  (e: "edit", id: string): void;
  (e: "delete", id: string): void;
  (e: "view", id: string): void;
}>();

const nodes = computed(() => props.apifluxComposable.nodes.value);
const edges = computed(() => props.apifluxComposable.edges.value);
const nodeMap = computed(() => props.apifluxComposable.nodeMap.value);

const getTransformNode = (nodeId: string): TransformNode | undefined => {
  const node = nodeMap.value[nodeId];
  if (node) {
    return node as TransformNode;
  }
  return undefined;
};
const getHttpNode = (nodeId: string): HttpNode | undefined => {
  const node = nodeMap.value[nodeId];
  if (node) {
    return node as HttpNode;
  }
  return undefined;
};
const onNodeDrag = (event: NodeDragEvent) => {
  if (props.readOnly) return;
  props.apifluxComposable.setPosition(event);
};

const onConnect = (event: Connection) => {
  if (props.readOnly) return;
  props.apifluxComposable.addEdge(event);
};

const onNodesChange = (event: any) => {
  if (props.readOnly) return;
  event.forEach((change: any) => {
    const eventType = change.type;
    if (eventType === 'remove') {
      props.apifluxComposable.deleteNode(change.id);
    }
  });
};

const onEdgeChange = (event: EdgeChange[]) => {
  if (props.readOnly) return;
  event.forEach((change) => {
    const eventType = change.type;
    if (eventType === 'remove') {
      props.apifluxComposable.deleteEdge(change.id);
    }
  });
};

const getNodeColor = (node: any): string => {
  switch (node.type) {
    case NodeType.API:
      return 'var(--http-node-color)';
    case NodeType.TRANSFORM:
      return 'var(--transform-node-color)';
    default:
      return '#fff';
  }
};

</script>

<style scoped>
.webflow-editor-canvas {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.webflow-editor-canvas__flow {
  width: 100%;
  height: 100%;
}
</style>
