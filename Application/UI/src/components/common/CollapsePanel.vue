<template>
  <div class="collapse-panel" :style="panelStyle">
    <header class="collapse-panel__header" @click.stop="toggle">
      <div class="collapse-panel__title">{{ title }}</div>
      <div class="collapse-panel__actions">
        <slot v-if="isOpen" name="actions"></slot>
        <button class="collapse-panel__toggle" type="button" aria-label="Toggle" @click.stop="toggle">
          <Icon :name="isOpen ? 'chevron-up' : 'chevron-down'" size="sm" />
        </button>
      </div>
    </header>
    <transition name="collapse-fade">
      <section v-show="isOpen" class="collapse-panel__content" :style="contentStyle">
        <slot></slot>
      </section>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '@/components/common/utils/Icon.vue'

const props = withDefaults(
  defineProps<{
    title: string
    maxHeight?: string
    defaultOpen?: boolean
  }>(),
  {
    maxHeight: '400px',
    defaultOpen: false
  }
)

const isOpen = ref(!!props.defaultOpen)

const toggle = () => {
  isOpen.value = !isOpen.value
}

const panelStyle = computed(() => ({
  maxHeight: props.maxHeight || 'none'
}))

const contentStyle = computed(() => ({
  maxHeight: props.maxHeight || 'none',
  overflow: 'auto'
}))
</script>

<style scoped>
.collapse-panel {
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
}

.collapse-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  cursor: pointer;
  user-select: none;
}

.collapse-panel__title {
  font-size: var(--text-md);
  font-weight: 600;
}

.collapse-panel__actions {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.collapse-panel__toggle {
  border: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  padding: 6px;
  cursor: pointer;
}

.collapse-panel__toggle:hover {
  border-color: var(--accent-blue);
  box-shadow: var(--focus-ring);
}

.collapse-panel__content {
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid var(--border-default);
}

.collapse-fade-enter-active,
.collapse-fade-leave-active {
  transition: opacity var(--transition-default), max-height var(--transition-default);
}
.collapse-fade-enter-from,
.collapse-fade-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
