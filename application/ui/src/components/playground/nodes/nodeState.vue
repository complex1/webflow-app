<template>
  <div class="node-card">
    <div class="node-meta" style="height: 300px; width: 400px;" >
      <json-editor :modelValue="node.nodeData" :readonly="true" />
    </div>

    <div v-if="node.hasError" class="node-error">
      ⚠️ {{ node.errorMessage || "An unknown error occurred." }}
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

<style scoped>
.node-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 16px;
}
.node-error {
  margin-top: 12px;
  padding: 10px;
  background-color: var(--color-danger);
  color: var(--color-white);
  border-radius: 8px;
  font-size: 13px;
}
</style>
