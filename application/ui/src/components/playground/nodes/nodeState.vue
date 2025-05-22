<template>
  <div class="bg-white round-2 shadow-2 p-m">
    <div class="node-meta" style="height: 300px; width: 400px;">
      <json-editor :modelValue="node.nodeData" :readonly="true" />
    </div>

    <div v-if="node.hasError" class="bg-danger p-s round-1 text-white text-s mt-m">
      <i class="pi pi-exclamation-triangle mr-s"></i>
      {{ node.errorMessage || "An unknown error occurred." }}
    </div>
  </div>
</template>

<script lang="ts">
import Node, { NodeStatus } from "../../../classes/Node";
import JsonEditor from '../../common/code/jsonEditor.vue';

export default {
  components: { JsonEditor },
  name: "NodeState",
  props: {
    node: {
      type: Node,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    getStatusClass(status) {
      switch (status) {
        case NodeStatus.PENDING:
          return "pending";
        case NodeStatus.IN_PROGRESS:
          return "in-progress";
        case NodeStatus.SUCCESS:
          return "success";
        case NodeStatus.FAILURE:
          return "failure";
        case NodeStatus.INACTIVE:
          return "inactive";
        case NodeStatus.SKIPPED:
          return "skipped";
        default:
          return "";
      }
    },
  },
};
</script>
