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
<script>
import { VueFlow } from "@vue-flow/core";
import { MiniMap } from "@vue-flow/minimap";
import { Background } from "@vue-flow/background";
import { Controls, ControlButton } from "@vue-flow/controls";
import AddNode from "../playground/addNode.vue";
import { mapMutations, mapState } from "vuex";
import HttpNode from '../playground/nodes/httpNode.vue';
import FunctionalNode from '../playground/nodes/functionalNode.vue';
export default {
  name: "workflowPlaygroundComponent",
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
  data() {
    return {
      currentZoom: 1,
      viewportState: {
        x: 0,
        y: 0,
        zoom: 1
      },
      lastDraggedNodes: []
    };
  },
  computed: {
    ...mapState({
      nodes: (state) => state.workflowModule.viewNodes,
      edges: (state) => state.workflowModule.viewEdges,
    }),
  },
  watch: {},
  methods: {
    ...mapMutations({
      addEdge: "workflowModule/addEdge",
      updateNodePosition: "workflowModule/updateNodePosition",
      updateMultipleNodePositions: "workflowModule/updateMultipleNodePositions"
    }),
    onConnect(params) {
      this.addEdge({
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
      });
    },
    onNodeDrag({ node, event }) {
      // We don't log during drag to avoid console spam
      // But you could use this to update a state or UI element
    },
    
    onNodeDragStop({ node }) {
      if (!node) return;
      
      // Save the node to our last dragged nodes list
      this.lastDraggedNodes = [node];
      
      const nodePosition = {
        id: node.id,
        type: node.type,
        position: { x: node.position.x, y: node.position.y },
        positionAbsolute: node.positionAbsolute ? 
          { x: node.positionAbsolute.x, y: node.positionAbsolute.y } : undefined
      };
      
      // Save node position to store
      try {
        this.updateNodePosition({
          id: node.id,
          position: { 
            x: node.position.x,
            y: node.position.y
          }
        });
      } catch (error) {
        console.error('Error updating node position in store:', error);
      }
    },
    
    onNodesDragStop({ nodes }) {
      if (!nodes || nodes.length === 0) return;
      nodes.map(node => ({
        id: node.id,
        position: node.position
      }));

      // Update all dragged nodes positions in the store
      try {
        const nodePositions = nodes.map(node => ({
          id: node.id,
          position: { 
            x: node.position.x, 
            y: node.position.y 
          }
        }));
        
        if (nodePositions.length > 0) {
          this.updateMultipleNodePositions(nodePositions);
        }
      } catch (error) {
        console.error('Error updating multiple node positions in store:', error);
      }
    },
    onZoomChange({ zoom }) {
      this.currentZoom = zoom;
      // Log position of all nodes at this zoom level if we have dragged nodes recently
    },
    onViewportChange(viewport) {
      this.viewportState = {
        x: viewport.x,
        y: viewport.y,
        zoom: viewport.zoom
      };
    },
  },
  created() {},
  mounted() {
    // Log initial positions of all nodes when component is mounted
  },
  beforeUnmount() {
    // Cleanup if needed
  },
};
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