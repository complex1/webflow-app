<template>
  <div
    class="node-header flex items-center gap-sm"
    :class="{
      'node-header--api': props.data.type === NodeType.API,
      'node-header--functional': props.data.type === NodeType.FUNCTIONAL,
    }"
    @click="$emit('view', props.data)"
  >
    <i :class="getIcon"></i>
    <h3>{{ props.data.name }}</h3>
    <div class="node-status-chip" :status="getNodeStatusDetail.status">
      <i :class="getNodeStatusDetail.icon"></i>
      {{ getNodeStatusDetail.message }}
    </div>
    <div class="dropdown-container" ref="dropdownRef">
      <i
        class="fa fa-ellipsis-v dropdown-trigger"
        @click.stop="toggleDropdown"
      ></i>

      <!-- Dropdown Menu -->
      <div v-if="showDropdown" class="dropdown-menu">
        <button class="dropdown-item" @click.stop="handleAction('edit')">
          <i class="fas fa-edit"></i>
          Edit
        </button>
        <button class="dropdown-item" @click.stop="handleAction('delete')">
          <i class="fas fa-trash"></i>
          Delete
        </button>
        <button class="dropdown-item" @click.stop="handleAction('view')">
          <i class="fas fa-eye"></i>
          View
        </button>
      </div>
    </div>
    <Handle 
    class="variable-handle variable-handle-left"
    type="target"
      :id="props.data.id"
      :position="Position.Left"></Handle>
    <Handle 
    class="variable-handle variable-handle-right"
    type="source"
      :id="props.data.id"
      :position="Position.Right"></Handle>
  </div>
</template>

<script setup lang="ts">
import type { WebflowNode } from "@/apifluxCore/types";
import { NodeType, NodeStatus } from "@/apifluxCore/types";
import { computed, ref, onMounted, onUnmounted } from "vue";
import { Handle, Position } from "@vue-flow/core";

const props = defineProps<{
  data: WebflowNode;
}>();

const emit = defineEmits<{
  (e: "edit", node: WebflowNode): void;
  (e: "delete", node: WebflowNode): void;
  (e: "view", node: WebflowNode): void;
}>();

// Dropdown state
const showDropdown = ref(false);
const dropdownRef = ref<HTMLElement>();

const getIcon = computed(() => {
  switch (props.data.type) {
    case NodeType.API:
      return "fas fa-globe";
    case NodeType.FUNCTIONAL:
      return "fas fa-cogs";
    default:
      return "fas fa-question";
  }
});

const getNodeStatusDetail = computed(() => {
  switch (props.data.nodeStatus) {
    case NodeStatus.PENDING:
      return {
        status: NodeStatus.PENDING,
        message: "Pending",
        icon: "fas fa-clock",
      };
    case NodeStatus.IN_PROGRESS:
      return {
        status: NodeStatus.IN_PROGRESS,
        message: "In Progress",
        icon: "fas fa-spinner",
      };
    case NodeStatus.SUCCESS:
      return {
        status: NodeStatus.SUCCESS,
        message: "Successful",
        icon: "fas fa-check",
      };
    case NodeStatus.FAILURE:
      return {
        status: NodeStatus.FAILURE,
        message: "Failed",
        icon: "fas fa-times",
      };
    case NodeStatus.INACTIVE:
      return {
        status: NodeStatus.INACTIVE,
        message: "Inactive",
        icon: "fas fa-ban",
      };
    case NodeStatus.SKIPPED:
      return {
        status: NodeStatus.SKIPPED,
        message: "Skipped",
        icon: "fas fa-forward",
      };
  }
});

// Methods
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const handleAction = (action: "edit" | "delete" | "view") => {
  showDropdown.value = false;

  switch (action) {
    case "edit":
      emit("edit", props.data);
      break;
    case "delete":
      emit("delete", props.data);
      break;
    case "view":
      emit("view", props.data);
      break;
  }
};

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
<style scoped>
.node-header {
  position: relative;
  padding: var(--spacing-md);
  background: var(--color-background-elevated);
  border-bottom: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  cursor: pointer;
  z-index: 3;
}

.node-header:hover {
  background: var(--color-background-hover);
}

.node-header i {
  font-size: var(--font-size-lg);
  color: var(--color-primary);
  margin-right: var(--spacing-sm);
}

.node-header--functional i {
  color: var(--color-accent);
}

.node-header h3 {
  flex-grow: 1;
  display: inline;
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--color-text-primary);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin: 0;
}

.node-status-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}
.node-status-chip[status="PENDING"] {
  background-color: var(--color-yellow-100);
  color: var(--color-yellow-800);
}
.node-status-chip[status="IN_PROGRESS"] {
  background-color: var(--color-blue-100);
  color: var(--color-blue-800);
}
.node-status-chip[status="SUCCESS"] {
  background-color: var(--color-green-100);
  color: var(--color-green-800);
}
.node-status-chip[status="FAILURE"] {
  background-color: var(--color-red-100);
  color: var(--color-red-800);
}
.node-status-chip[status="INACTIVE"] {
  background-color: var(--color-gray-100);
  color: var(--color-gray-800);
}
.node-status-chip[status="SKIPPED"] {
  background-color: var(--color-orange-100);
  color: var(--color-orange-800);
}
.node-status-chip i {
  font-size: var(--font-size-xs);
}

/* Dropdown styles */
.dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
}

.dropdown-trigger:hover {
  background-color: var(--color-gray-100);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  z-index: 1000;
  min-width: 120px;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  background: none;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  text-align: left;
}

.dropdown-item:hover {
  background-color: var(--color-gray-50);
}

.dropdown-item:active {
  background-color: var(--color-gray-100);
}

.dropdown-item i {
  font-size: var(--font-size-xs);
  width: 14px;
  color: var(--color-text-secondary);
}

.dropdown-item:hover i {
  color: var(--color-primary);
}

/* Theme support removed for monochromatic design */

.variable-handle {
  width: 12px;
  height: 12px;
  background: var(--color-primary);
  border: 2px solid var(--color-background);
  border-radius: 50%;
  top: 50%;
  left: -8px;
  transform: translateY(-40%);
}
.variable-handle-left {
  left: -8px;
}
.variable-handle-right {
  right: -8px;
  left: auto;
  background: var(--color-success);
}
</style>