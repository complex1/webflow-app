<template>
  <div class="node-card">
    <div class="node-header">
      <h2 class="node-title">{{ "Untitled Node" }}</h2>
      <span
        class="node-status"
        :class="getStatusClass(node.nodeStatus)"
      >
        {{ node.nodeStatus }}
      </span>
    </div>

    <p class="node-description">
      {{ node.nodeData.description || "No description provided." }}
    </p>

    <div class="node-meta">
      {{ node.nodeData }}
    </div>

    <div v-if="node.hasError" class="node-error">
      ⚠️ {{ node.errorMessage || "An unknown error occurred." }}
    </div>
  </div>
</template>

<script lang="ts">
import Node, { NodeStatus } from "../../../classes/Node";

export default {
  name: "NodeState",
  props: {
    node: {
      type: Node,
      required: true,
    },
  },
  data() {
    return {
    };
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
  padding: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
  color: var(--color-text-primary);
  max-width: 420px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen;
}

.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.node-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.node-status {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-white);
  text-transform: uppercase;
}

.node-status.pending {
  background-color: var(--color-warning);
}

.node-status.in-progress {
  background-color: var(--color-info);
}

.node-status.success {
  background-color: var(--color-success);
}

.node-status.failure {
  background-color: var(--color-danger);
}

.node-status.inactive,
.node-status.skipped {
  background-color: var(--color-border);
  color: var(--color-text-secondary);
}

.node-description {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 8px 0 12px;
}

.node-meta {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.6;
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
