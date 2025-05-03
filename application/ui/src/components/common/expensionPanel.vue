<template>
  <div class="expansion-panel">
    <div class="expansion-header" @click="toggle">
      <div class="expansion-header-container">
        <slot name="header"></slot>
      </div>
      <div class="expansion-header-icon" :class="{ open: isOpen }">
        <i class="pi pi-angle-down"></i>
      </div>
    </div>
    <div class="expansion-content" v-if="isOpen" :style="{
      maxHeight: maxHeight,
      overflow: 'auto',
    }">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExpansionPanel",
  props: {
    maxHeight: {
      type: String,
      default: "300px",
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style scoped lang="scss">
.expansion-panel {
  border: 1px solid var(--color-border);
  border-radius: 4px;
  overflow: hidden;
}

.expansion-header {
  background-color: var(--color-background);
  padding: var(--spacing-medium);
  cursor: pointer;
  font-weight: bold;
  color: var(--color-text-primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  &-container {
    flex-grow: 1;
  }
  &-icon {
    transition: transform 0.3s ease;
    &.open {
      transform: rotate(180deg);
    }
  }
}

.expansion-content {
  padding: var(--spacing-medium);
  background-color: var(--color-background);
  color: var(--color-text-primary);
}
</style>
