<template>
  <Inline
    class="node-header"
    :class="`node-header--${props.node.type.toLowerCase()}`"
    justify="space-between"
    align="center"
    fullWidth
    gap="sm"
  >
    <Icon :name="nodeIcon" />
    <Text class="node-header__titles flex-grow">
      <TruncateText :title="props.node.name">{{
        props.node.name
      }}</TruncateText>
    </Text>
    <span class="node-header__status" :class="nodeStatusBadgeClass">
      {{ statusMap[props.node.nodeStatus] }}
    </span>
    <button
      v-if="readOnly"
      type="button"
      class="node-header__info-btn"
      aria-label="Node details"
      @click="emit('view')"
    >
      <Icon name="info-circle" class="card-menu__icon" />
    </button>
    <Popover v-if="!readOnly" v-model:open="menuOpen">
      <Icon
        name="ellipsis-v"
        class="card-menu__icon"
      />
      <template #content>
        <div class="card-menu">
          <button type="button" @click="handleView">
            <Icon name="eye" class="card-menu__icon" />
            <span>View</span>
          </button>
          <button type="button" @click="handleEdit">
            <Icon name="pencil" class="card-menu__icon" />
            <span>Edit</span>
          </button>
          <button type="button" class="danger" @click="handleDelete">
            <Icon name="trash" class="card-menu__icon" />
            <span>Delete</span>
          </button>
        </div>
      </template>
    </Popover>
  </Inline>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { NodeStatus, NodeType, type WebflowNode } from "@/apifluxCore/types";
import Icon from "@/components/common/utils/Icon.vue";

const props = withDefaults(
  defineProps<{
    node: WebflowNode;
    /** Hide node menu (view mode canvas). */
    readOnly?: boolean;
  }>(),
  { readOnly: false }
);
const menuOpen = ref(false);
const statusMap = {
  [NodeStatus.PENDING]: "Pending",
  [NodeStatus.IN_PROGRESS]: "In Progress",
  [NodeStatus.SUCCESS]: "Success",
  [NodeStatus.FAILURE]: "Failure",
  [NodeStatus.INACTIVE]: "Inactive",
  [NodeStatus.SKIPPED]: "Skipped",
};
const nodeIcon = computed(() => {
  switch (props.node.type) {
    case NodeType.API:
      return "globe";
    case NodeType.TRANSFORM:
      return "cog";
    default:
      return "question";
  }
});
const nodeStatusBadgeClass = computed(() => {
  switch (props.node.nodeStatus) {
    case NodeStatus.PENDING:
      return "is-pending";
    case NodeStatus.IN_PROGRESS:
      return "is-running";
    case NodeStatus.SUCCESS:
      return "is-success";
    case NodeStatus.FAILURE:
      return "is-failure";
    case NodeStatus.INACTIVE:
      return "is-cancelled";
    case NodeStatus.SKIPPED:
      return "is-skipped";
    default:
      return "";
  }
});
const emit = defineEmits<{
  (e: "edit"): void;
  (e: "delete"): void;
  (e: "view"): void;
}>();

function handleView() {
  emit("view");
  menuOpen.value = false;
}

function handleEdit() {
  emit("edit");
  menuOpen.value = false;
}
function handleDelete() {
  emit("delete");
  menuOpen.value = false;
}

</script>

<style scoped>
.node-header {
  gap: var(--space-2);
  padding: var(--space-2);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}

.node-header--api {
  background-color: var(--http-node-header-color);
}

.node-header--transform {
  background-color: var(--transform-node-header-color);
}

.node-header__titles {
  min-width: 0;
  font-size: var(--text-sm);
}

.node-header__status {
  padding: 0 var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--text-xxs);
}
.node-header__status.is-pending {
  background-color: hsl(0, 0%, 66%);
  color: hsl(0, 0%, 20%);
  border: 1px solid hsl(0, 0%, 50%);
}
.node-header__status.is-running {
  background-color: hsl(221, 100%, 90%);
  color: hsl(221, 100%, 20%);
  border: 1px solid hsl(221, 100%, 50%);
}
.node-header__status.is-success {
  background-color: hsl(120, 100%, 90%);
  color: hsl(120, 100%, 20%);
  border: 1px solid hsl(120, 100%, 50%);
}
.node-header__status.is-failure {
  background-color: hsl(0, 100%, 90%);
  color: hsl(0, 100%, 20%);
  border: 1px solid hsl(0, 100%, 50%);
}
.node-header__status.is-cancelled {
  background-color: hsl(0, 0%, 80%);
  color: hsl(0, 0%, 20%);
  border: 1px solid hsl(0, 0%, 50%);
}
.node-header__status.is-skipped {
  background-color: hsl(240, 100%, 90%);
  color: hsl(240, 100%, 20%);
  border: 1px solid hsl(240, 100%, 50%);
}

.node-header__info-btn {
  border: none;
  background: transparent;
  padding: 4px;
  cursor: pointer;
  color: inherit;
  opacity: 0.85;
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.node-header__info-btn:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.08);
}
</style>
