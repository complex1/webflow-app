<template>
  <div>
    <add-node></add-node>
    <div style="height: 800px; width: 100%">
      <VueFlow
        :nodes="nodes"
        :edges="edges"
        :fitView="true"
        :zoomOnScroll="true"
        :zoomOnPinch="true"
        :panOnScroll="true"
      >
        <Background />
        <MiniMap pannable zoomable />
        <template #node-HTTP="nodeData">
          <http-node :id="nodeData.id" />
        </template>
      </VueFlow>
    </div>
    {{ nodes }}
    {{ edges }}
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import addNode from "../components/playground/addNode.vue";
import { VueFlow } from "@vue-flow/core";
import { MiniMap } from "@vue-flow/minimap";
import { Background } from "@vue-flow/background";
import HttpNode from '../components/playground/nodes/httpNode.vue';
export default {
  components: { addNode, VueFlow, Background, MiniMap, HttpNode },
  name: "Playground",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      nodes: (state) => state.workflowModule.viewNodes,
      edges: (state) => state.workflowModule.viewEdges,
    }),
  },
  methods: {
    ...mapMutations({
      setWorkflow: "workflowModule/setWorkflow",
    }),
  },
  mounted() {},
};
</script>

<style lang="scss">
/* import the necessary styles for Vue Flow to work */
@import "@vue-flow/core/dist/style.css";

/* import the default theme, this is optional but generally recommended */
@import "@vue-flow/core/dist/theme-default.css";
</style>
