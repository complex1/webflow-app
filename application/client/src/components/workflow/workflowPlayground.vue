<template>
  <div class="workflow-playground fh fw">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :fitView="true"
      :zoomOnScroll="true"
      :zoomOnPinch="true"
      :panOnScroll="true"
      :zoom="1"
      
      @connect="onConnect"
      @nodeDrag="onNodeDrag"
      @nodeDragStop="onNodeDragStop"
      @nodesDragStop="onNodesDragStop"
      @zoomChange="onZoomChange"
      @viewportChange="onViewportChange"
      @nodesInitialized="onNodesInitialized"
      @edgesChange="onEdgesChange"
      ref="vueFlow"
    >
      <Background />
      <MiniMap
        pannable
        zoomable
        :nodeColor="miniMapNodeColor"
        position="bottom-left"
        backgroundColor="#f0f0f0"
        :nodeStrokeWidth="2"
        :nodeBorderRadius="4"
        :nodeBorderWidth="1"
        :nodeWidth="100"
        :nodeHeight="50"
      />
      <Controls position="top-right" class="horizontal-controls">
        <add-node></add-node>
      </Controls>
      <template #node-HTTP="nodeData">
        <HttpNode :id="nodeData.id" @editNode="editNode" @delete-node="deleteNode" />
      </template>
      <template #node-FUNCTIONAL="nodeData">
        <FunctionalNode :id="nodeData.id" @editNode="editNode" @delete-node="deleteNode" />
      </template>
    </VueFlow>
    <edit-node :id="editNodeId" :open="openEdit" @close="closeEdit" />
    <workflow-logs />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { VueFlow } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';
import { Background } from '@vue-flow/background';
import { Controls, ControlButton } from '@vue-flow/controls';
import { useStore } from 'vuex';
import AddNode from '../playground/addNode.vue';
import HttpNode from '../playground/nodes/httpNode.vue';
import FunctionalNode from '../playground/nodes/functionalNode.vue';
import EditNode from '../playground/editNode.vue';
import WorkflowLogs from './workflowLogs.vue';

// Define your interfaces here since there were issues with the external types file
interface NodePosition {
  x: number;
  y: number;
}

interface Node {
  id: string;
  type?: string;
  position: NodePosition;
  positionAbsolute?: NodePosition;
}

// Define MouseTouchEvent to match Vue Flow's type
type MouseTouchEvent = MouseEvent | TouchEvent;

interface NodeDragEvent {
  node: Node;
  event: MouseTouchEvent;
}

interface ConnectParams {
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

interface ViewportState {
  x: number;
  y: number;
  zoom: number;
}

interface NodePositionUpdate {
  id: string;
  position: NodePosition;
}

export default defineComponent({
  name: 'WorkflowPlaygroundComponent',
  components: {
    VueFlow,
    MiniMap,
    Background,
    Controls,
    ControlButton,
    AddNode,
    HttpNode,
    FunctionalNode,
    EditNode,
    WorkflowLogs,
  },
  setup() {
    // Store access
    const store = useStore();
    
    // Component state
    const currentZoom = ref<number>(1);
    const viewportState = ref<ViewportState>({
      x: 0,
      y: 0,
      zoom: 1
    });
    const lastDraggedNodes = ref<Node[]>([]);
    const vueFlow = ref<InstanceType<typeof VueFlow> | null>(null);
    const openEdit = ref<boolean>(false);
    const editNodeId = ref<string | null>(null);
    
    // Computed properties
    const nodes = computed(() => store.state.workflowModule.viewNodes);
    const edges = computed(() => store.state.workflowModule.viewEdges);

    // Watchers
    // if nodes changes form empty to non-empty, log the positions of all nodes
    watch(nodes, (newNodes, oldValue) => {
      if (newNodes.length > 0 && oldValue?.length === 0) {
        vueFlow?.value?.fitView();
      }
    }, { immediate: true });
    
    // Methods
    const editNode = (nodeId: string) => {
      openEdit.value = true;
      editNodeId.value = nodeId;
    };
    const closeEdit = () => {
      openEdit.value = false;
      editNodeId.value = null;
    };

    const deleteNode = (nodeId: string) => {
      store.commit('workflowModule/removeNode', nodeId);
    };

    const onConnect = (params: ConnectParams) => {
      store.commit('workflowModule/addEdge', {
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle ?? undefined,
        targetHandle: params.targetHandle ?? undefined,
      });
    };

    const onEdgesChange = (changes: Array<any>) => {
      // Process edge changes from Vue Flow
      changes.forEach(change => {
        // If it's a remove change, call the removeEdge mutation
        if (change.type === 'remove' && change.id) {
          store.commit('workflowModule/removeEdge', change.id);
        }
      });
    };
    
    const onNodeDrag = () => {
      // We don't log during drag to avoid console spam
      // But you could use this to update a state or UI element
    };
    
    const onNodeDragStop = (dragEvent: NodeDragEvent) => {
      const { node } = dragEvent;
      if (!node) return;
      
      // Save the node to our last dragged nodes list
      lastDraggedNodes.value = [node];
      
      // Save node position to store
      try {
        store.commit('workflowModule/updateNodePosition', {
          id: node.id,
          position: { 
            x: node.position.x,
            y: node.position.y
          }
        });
      } catch (error) {
        console.error('Error updating node position in store:', error);
      }
    };
    
    const onNodesDragStop = (event: { nodes: Node[] }) => {
      const { nodes } = event;
      if (!nodes || nodes.length === 0) return;
      
      // Update all dragged nodes positions in the store
      try {
        const nodePositions = nodes.map(node => ({
          id: node.id,
          position: { 
            x: node.position.x, 
            y: node.position.y 
          }
        })) as NodePositionUpdate[];
        
        if (nodePositions.length > 0) {
          store.commit('workflowModule/updateMultipleNodePositions', nodePositions);
        }
      } catch (error) {
        console.error('Error updating multiple node positions in store:', error);
      }
    };
    
    const onZoomChange = ({ zoom }: { zoom: number }) => {
      currentZoom.value = zoom;
      setZoomCssVariable(zoom);
      // Log position of all nodes at this zoom level if we have dragged nodes recently
    };
    
    const onViewportChange = (viewport: ViewportState) => {
      viewportState.value = {
        x: viewport.x,
        y: viewport.y,
        zoom: viewport.zoom
      };
      setZoomCssVariable(viewport.zoom);
    };

    const setZoomCssVariable = (zoom: number) => {
      // Set a CSS variable for zoom level
      document.documentElement.style.setProperty('--vue-flow-zoom', zoom.toString());
    };

    const miniMapNodeColor = (node: Node) => {
      switch (node.type) {
        case 'HTTP':
          return '#00aaff';
        case 'FUNCTIONAL':
          return '#ffaa00';
        default:
          return '#ccc';
      }
    };

    const onNodesInitialized = () => {
      // Initialization logic when nodes are ready
    };

    // Lifecycle hooks
    onMounted(() => {
      // Log initial positions of all nodes when component is mounted
      vueFlow.value?.fitView();
    });

    onBeforeUnmount(() => {
      // Cleanup if needed
    });
    
    return {
      nodes,
      edges,
      currentZoom,
      viewportState,
      lastDraggedNodes,
      vueFlow,
      openEdit,
      editNodeId,
      editNode,
      closeEdit,
      onConnect,
      onNodeDrag,
      onNodeDragStop,
      onNodesDragStop,
      onZoomChange,
      onViewportChange,
      onNodesInitialized,
      onEdgesChange,
      miniMapNodeColor,
      deleteNode
    };
  }
});
</script>

<style lang='scss' scoped>
.workflow-playground {
  overflow: hidden;
}
</style>

<style lang="scss">
.horizontal-controls {
  display: flex;
  flex-direction: row-reverse !important;
  align-items: center;
  box-shadow: none !important;
  & > button {
    border-right: 1px solid var(--color-border) !important;
  }
}
</style>
