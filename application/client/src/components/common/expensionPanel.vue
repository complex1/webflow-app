<template>
  <div class="expansion-panel">
    <div class="expansion-header" @click="toggle">
      <div class="expansion-header-container">
        <div v-if="title" class="expansion-title">
          <i v-if="icon" :class="'pi ' + icon"></i>
          {{ title }}
        </div>
        <slot name="header"></slot>
      </div>
      <div class="expansion-header-icon" :class="{ open: panelOpen }">
        <i class="pi pi-angle-down"></i>
      </div>
    </div>
    <div class="expansion-content" v-if="panelOpen" :style="{
      maxHeight: maxHeight,
      overflow: 'auto',
    }">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, onMounted } from 'vue';
import type { ExpansionPanelProps } from './types';

export default defineComponent({
  name: "ExpansionPanel",
  props: {
    title: {
      type: String,
      default: ''
    },
    maxHeight: {
      type: String,
      default: "300px"
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const panelOpen = ref(props.isOpen);
    
    const toggle = () => {
      panelOpen.value = !panelOpen.value;
    };
    
    onMounted(() => {
      panelOpen.value = props.isOpen;
    });
    
    return {
      panelOpen,
      toggle
    };
  }
});
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
}

.expansion-header-container {
  flex-grow: 1;
}

.expansion-header-icon {
  transition: transform 0.3s ease;
}

.expansion-header-icon.open {
  transform: rotate(180deg);
}

.expansion-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-small, 8px);
}

.expansion-content {
  padding: var(--spacing-medium);
  background-color: var(--color-background);
  color: var(--color-text-primary);
}
</style>
