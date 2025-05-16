<template>
  <div class="functional-node bg-white shadow-1 round-1">
    <connection-handel :id="nodeData.id"></connection-handel>
    <node-header :nodeData="nodeData" />
    <div class="grid-2 px-m py-s">
      <div>
        <hr class="mt-s" />
        <div class="text-s text-primary text-600 my-s">Parameters:</div>
        <hr />
        <div class="mt-m" v-if="nodeData.parameters.length">
          <variable-node
            v-for="(param, index) in nodeData.parameters"
            :key="index"
            :variable="param"
          ></variable-node>
        </div>
      </div>
      <div>
        <node-response :nodeData="nodeData"></node-response>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from "vuex";
import FunctionalNode from "../../../classes/FunctionalNode";
import { Workflow } from "../../../classes/Workflow";
import ConnectionHandel from "./connectionHandel.vue";
import NodeHeader from "./nodeHeader.vue";
import NodeResponse from "./nodeResponse.vue";
import VariableNode from "./variableNode.vue";
export default {
  name: "FunctionalNode",
  components: {
    ConnectionHandel,
    NodeHeader,
    VariableNode,
    NodeResponse,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      workflow: (state): Workflow => state.workflowModule.workflow,
    }),
    nodeData(): FunctionalNode {
      return this.workflow.getNode(this.id);
    },
  },
  methods: {},
};
</script>

<style>
.functional-node {
  min-width: 300px;
  filter: drop-shadow(var(--shadow-drop));
}
</style>
