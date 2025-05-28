<template>
  <div class="bg-white round-2 shadow-2">
    <connection-handel :id="nodeData.id"></connection-handel>
    <node-header :nodeData="nodeData" @edit-node="$emit('edit-node', $event)" @delete-node="$emit('delete-node', $event)" />
    <div class="p-m">
      <div class="grid-2 gap-m">
        <div class="parameters-section">
          <div class="section-header border-bottom pb-2xs mb-s">
            <div class="text-s text-primary font-600">Parameters</div>
          </div>

          <div v-if="nodeData.parameters.length" class="mt-s">
            <variable-node
              v-for="(param, index) in nodeData.parameters"
              :key="`param-${index}`"
              :variable="param"
            ></variable-node>
          </div>
          <div v-else class="text-s opacity-50 font-400">
            <i class="pi pi-info-circle mr-xs"></i> No parameters defined
          </div>
        </div>

        <node-response :nodeData="nodeData"></node-response>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex';
import FunctionalNode from '../../../classes/FunctionalNode';
import { Workflow } from '../../../classes/Workflow';
import ConnectionHandel from './connectionHandel.vue';
import NodeHeader from './nodeHeader.vue';
import NodeResponse from './nodeResponse.vue';
import VariableNode from './variableNode.vue';

export default {
  name: 'FunctionalNode',
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
      workflow: (state: any): Workflow => state.workflowModule.workflow as Workflow,
    }),
    nodeData(): FunctionalNode {
      return this.workflow.getNode(this.id) as FunctionalNode;
    },
  },
  methods: {},
};
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid var(--color-border);
}
.pb-2xs {
  padding-bottom: 2px;
}
</style>
