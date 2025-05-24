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
      <MiniMap pannable zoomable />
      <Controls position="top-right" class="horizontal-controls">
        <add-node></add-node>
      </Controls>
      <template #node-HTTP="nodeData">
        <HttpNode :id="nodeData.id" @editNode="editNode" />
      </template>
      <template #node-FUNCTIONAL="nodeData">
        <FunctionalNode :id="nodeData.id" @editNode="editNode" />
      </template>
    </VueFlow>
    <edit-node :id="editNodeId" :open="openEdit" @close="closeEdit" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { VueFlow } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';
import { Background } from '@vue-flow/background';
import { Controls, ControlButton } from '@vue-flow/controls';
import { useStore } from 'vuex';
import AddNode from '../playground/addNode.vue';
import HttpNode from '../playground/nodes/httpNode.vue';
import FunctionalNode from '../playground/nodes/functionalNode.vue';
import EditNode from '../playground/editNode.vue';

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

interface NodeDragEvent {
  node: Node;
  event: MouseEvent;
}

interface ConnectParams {
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
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
    
    // Methods
    const editNode = (nodeId: string) => {
      openEdit.value = true;
      editNodeId.value = nodeId;
    };
    const closeEdit = () => {
      openEdit.value = false;
      editNodeId.value = null;
    };

    const onConnect = (params: ConnectParams) => {
      store.commit('workflowModule/addEdge', {
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
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
    
    const onNodeDrag = ({ node, event }: NodeDragEvent) => {
      // We don't log during drag to avoid console spam
      // But you could use this to update a state or UI element
    };
    
    const onNodeDragStop = ({ node }: NodeDragEvent) => {
      if (!node) return;
      
      // Save the node to our last dragged nodes list
      lastDraggedNodes.value = [node];
      
      const nodePosition = {
        id: node.id,
        type: node.type,
        position: { x: node.position.x, y: node.position.y },
        positionAbsolute: node.positionAbsolute ? 
          { x: node.positionAbsolute.x, y: node.positionAbsolute.y } : undefined
      };
      
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
    
    const onNodesDragStop = ({ nodes }: { nodes: Node[] }) => {
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
      // Log position of all nodes at this zoom level if we have dragged nodes recently
    };
    
    const onViewportChange = (viewport: ViewportState) => {
      viewportState.value = {
        x: viewport.x,
        y: viewport.y,
        zoom: viewport.zoom
      };
    };

    const onNodesInitialized = () => {
      // Initialization logic when nodes are ready
    };

    // Lifecycle hooks
    onMounted(() => {
      // Log initial positions of all nodes when component is mounted
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
      onEdgesChange
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
