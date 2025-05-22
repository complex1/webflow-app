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
      ref="vueFlow"
    >
      <Background />
      <MiniMap pannable zoomable />
      <Controls position="top-right" class="horizontal-controls">
        <add-node></add-node>
      </Controls>
      <template #node-HTTP="nodeData">
        <HttpNode :id="nodeData.id" />
      </template>
      <template #node-FUNCTIONAL="nodeData">
        <FunctionalNode :id="nodeData.id" />
      </template>
    </VueFlow>
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
    
    // Computed properties
    const nodes = computed(() => store.state.workflowModule.viewNodes);
    const edges = computed(() => store.state.workflowModule.viewEdges);
    
    // Methods
    const onConnect = (params: ConnectParams) => {
      store.commit('workflowModule/addEdge', {
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
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
      onConnect,
      onNodeDrag,
      onNodeDragStop,
      onNodesDragStop,
      onZoomChange,
      onViewportChange,
      onNodesInitialized
    };
  }
});
</script>

<style lang='scss' scoped>
.workflow-playground {
  overflow: hidden;
  
  &::before {
    content: 'Press Ctrl+Shift+P to log node positions | Ctrl+Shift+S to save workflow';
    position: absolute;
    bottom: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    opacity: 0.5;
    z-index: 100;
    pointer-events: none;
  }
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
