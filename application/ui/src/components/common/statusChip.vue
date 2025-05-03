<template>
  <div class="status-chip text-s px-m py-s round-2 text-bold" :class="statusClass">
    <i :class="iconClass"></i>
    <span>{{ status }}</span>
  </div>
</template>

<script>
import { NodeStatus } from "../../classes/Node";

export default {
  name: "StatusChip",
  props: {
    status: {
      type: String,
      required: true,
      validator(value) {
        return Object.values(NodeStatus).includes(value);
      },
    },
  },
  computed: {
    statusClass() {
      switch (this.status) {
        case NodeStatus.PENDING:
          return 'bg-yellow text-white';
        case NodeStatus.IN_PROGRESS:
          return 'bg-primary text-white';
        case NodeStatus.SUCCESS:
          return 'bg-success text-white';
        case NodeStatus.FAILURE:
          return 'bg-danger text-white';
        case NodeStatus.INACTIVE:
          return 'bg-light text-dark';
        case NodeStatus.SKIPPED:
          return 'bg-secondary text-white';
        default:
          return "";
      }
    },
    iconClass() {
      switch (this.status) {
        case NodeStatus.PENDING:
          return "pi pi-clock";
        case NodeStatus.IN_PROGRESS:
          return "pi pi-spinner pi-spin";
        case NodeStatus.SUCCESS:
          return "pi pi-check-circle";
        case NodeStatus.FAILURE:
          return "pi pi-times-circle";
        case NodeStatus.INACTIVE:
          return "pi pi-ban";
        case NodeStatus.SKIPPED:
          return "pi pi-forward";
        default:
          return "pi pi-question-circle";
      }
    },
  },
};
</script>

<style scoped>
.status-chip {
  display: inline-flex;
  align-items: center;
    gap: 4px;
}
</style>
