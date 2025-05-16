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
    }),
    onConnect(params) {
      this.addEdge({
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
      });
    },
  },
  created() {},
  mounted() {},
};
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