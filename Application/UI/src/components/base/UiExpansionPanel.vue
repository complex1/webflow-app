<template>
  <div class="ui-expansion-panel">
    <!-- Panel Header -->
    <div
      class="panel-header"
      @click="toggleExpanded"
      :class="{ expanded: isExpanded }"
    >
      <div class="header-left">
        <div class="header-content">
          <span class="panel-title">{{ title }}</span>
          <span v-if="count" class="panel-count"
            >({{ count }})</span
          >
        </div>
        <i
          class="fas fa-chevron-down expand-icon"
          :class="{ rotated: isExpanded }"
        ></i>
      </div>

      <!-- Add Button (visible when expanded) -->
      <div v-if="isExpanded" class="header-right">
        <button
          class="add-button"
          @click.stop="handleAddClick"
          v-if="showAddButton"
        >
          <i class="fas fa-plus"></i>
          Add
        </button>
      </div>
    </div>

    <!-- Panel Content -->
    <div
      class="panel-content"
      :class="{ expanded: isExpanded }"
      ref="contentRef"
    >
      <div class="content-wrapper">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Props
const props = defineProps<{
  title: string;
  count?: number;
  expanded?: boolean;
  showAddButton?: boolean;
}>();

// Emits
const emit = defineEmits<{
  (e: "toggle", expanded: boolean): void;
  (e: "add"): void;
}>();

// Local state
const isExpanded = ref(props.expanded || false);
const contentRef = ref<HTMLElement>();

// Methods
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
  emit("toggle", isExpanded.value);
};

const handleAddClick = () => {
  emit("add");
};
</script>

<style scoped>
.ui-expansion-panel {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  overflow: hidden;
  transition: all var(--transition-normal);
  margin-bottom: var(--spacing-md);
}

.ui-expansion-panel:hover {
  border-color: var(--color-primary-dark);
}

/* Panel Header */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  cursor: pointer;
  background: var(--color-gray-50);
  border-bottom: 1px solid transparent;
  transition: all var(--transition-fast);
  user-select: none;
}

.panel-header:hover {
  background: var(--color-gray-100);
}

.panel-header.expanded {
  border-bottom-color: var(--color-border);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
}

.header-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.panel-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.panel-count {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.expand-icon {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  transition: transform var(--transition-fast);
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

.header-right {
  display: flex;
  align-items: center;
}

/* Add Button */
.add-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.add-button:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.add-button:active {
  transform: translateY(0);
}

.add-button i {
  font-size: var(--font-size-xs);
}

/* Panel Content */
.panel-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--transition-normal) ease-in-out;
}

.panel-content.expanded {
  max-height: 500px; /* Adjust based on your content needs */
  overflow: auto;
}

.content-wrapper {
  padding: var(--spacing-md);
}

/* Responsive Design */
@media (max-width: 768px) {
  .panel-header {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .content-wrapper {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .panel-title {
    font-size: var(--font-size-sm);
  }

  .add-button {
    padding: var(--spacing-xs);
    font-size: var(--font-size-xs);
  }
}

/* Dark Theme Support */
[data-theme="dark"] .ui-expansion-panel {
  background: var(--color-gray-800);
  border-color: var(--color-gray-700);
}

[data-theme="dark"] .panel-header {
  background: var(--color-gray-700);
}

[data-theme="dark"] .panel-header:hover {
  background: var(--color-gray-600);
}

[data-theme="dark"] .panel-header.expanded {
  background: var(--color-primary-dark);
}

[data-theme="dark"] .panel-title {
  color: var(--color-text-inverse);
}

[data-theme="dark"] .panel-count {
  color: var(--color-gray-400);
}

[data-theme="dark"] .expand-icon {
  color: var(--color-gray-400);
}
</style>
