<template>
  <div
    class="node-header node-header-compact flex items-center gap-xs"
    :class="{
      'node-header--api': props.data.type === NodeType.API,
      'node-header--functional': props.data.type === NodeType.FUNCTIONAL,
    }"
    @click="$emit('view', props.data)"
  >
    <i :class="getIcon" class="node-icon"></i>
    <h3 class="node-title">{{ props.data.name }}</h3>
    <div class="node-status-chip-compact" :status="getNodeStatusDetail.status">
      <i :class="getNodeStatusDetail.icon"></i>
    </div>
    <div class="dropdown-container" ref="dropdownRef">
      <i
        class="fa fa-ellipsis-v dropdown-trigger-compact"
        @click.stop="toggleDropdown"
      ></i>

      <!-- Compact Dropdown Menu -->
      <div v-if="showDropdown" class="dropdown-menu-compact">
        <button class="dropdown-item-compact" @click.stop="handleAction('edit')">
          <i class="fas fa-edit"></i>
        </button>
        <button class="dropdown-item-compact" @click.stop="handleAction('delete')">
          <i class="fas fa-trash"></i>
        </button>
        <button class="dropdown-item-compact" @click.stop="handleAction('view')">
          <i class="fas fa-eye"></i>
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
/* Compact Node Header Styling */
.node-header-compact {
  position: relative;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-background-elevated);
  border-bottom: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  cursor: pointer;
  z-index: 3;
  min-height: 36px;
}


.node-icon {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-header--functional .node-icon {
  color: var(--color-warning);
}

.node-title {
  flex-grow: 1;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin: 0;
  line-height: 1.2;
}

/* Compact Status Chip */
.node-status-chip-compact {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: var(--radius-full);
  font-size: 10px;
}

.node-status-chip-compact[status="PENDING"] {
  background-color: var(--color-warning-light);
  color: var(--color-warning-dark);
}

.node-status-chip-compact[status="IN_PROGRESS"] {
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
}

.node-status-chip-compact[status="SUCCESS"] {
  background-color: var(--color-success-light);
  color: var(--color-success-dark);
}

.node-status-chip-compact[status="FAILURE"] {
  background-color: var(--color-danger-light);
  color: var(--color-danger-dark);
}

.node-status-chip-compact[status="INACTIVE"] {
  background-color: var(--color-background-secondary);
  color: var(--color-text-secondary);
}

.node-status-chip-compact[status="SKIPPED"] {
  background-color: var(--color-info-light);
  color: var(--color-info-dark);
}

.node-status-chip-compact i {
  font-size: 8px;
}

/* Compact Dropdown styles */
.dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown-trigger-compact {
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropdown-trigger-compact:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dropdown-menu-compact {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-xs);
  z-index: var(--z-dropdown);
  min-width: 120px;
  display: flex;
  gap: var(--spacing-xs);
}

.dropdown-item-compact {
  background: none;
  border: none;
  padding: var(--spacing-xs);
  cursor: pointer;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.dropdown-item-compact:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

/* Handle styles - Compact */
.variable-handle {
  width: 8px;
  height: 8px;
  background: var(--color-primary);
  border: 2px solid var(--color-background);
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
}

.variable-handle-left {
  left: -6px;
}

.variable-handle-right {
  right: -6px;
  left: auto;
  background: var(--color-success);
}

.variable-handle:hover {
  transform: translateY(-50%) scale(1.2);
}
</style>