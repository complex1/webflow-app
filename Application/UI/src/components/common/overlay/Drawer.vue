<template>
  <Teleport to="body">
    <Transition name="af-slide">
      <div v-if="open" class="af-drawer" role="dialog" aria-modal="true">
        <div class="af-drawer__backdrop" @click="handleBackdrop" />
        <div class="af-drawer__panel" :class="`af-drawer__panel--${side}`">
          <header v-if="title" class="af-drawer__header">
            <h3>{{ title }}</h3>
            <button class="af-drawer__close" type="button" @click="emit('close')">
              <Icon name="times" />
            </button>
          </header>
          <div class="af-drawer__body">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/common/utils/Icon.vue'

type DrawerSide = 'left' | 'right'

const props = withDefaults(
  defineProps<{ open: boolean; title?: string; side?: DrawerSide; closeOnBackdrop?: boolean }>(),
  { side: 'right', closeOnBackdrop: true }
)

const emit = defineEmits<{ (e: 'close'): void }>()

const side = computed(() => props.side ?? 'right')

const handleBackdrop = () => {
  if (props.closeOnBackdrop) emit('close')
}
</script>

<style scoped>
.af-drawer {
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  display: flex;
}

.af-drawer__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.af-drawer__panel {
  position: relative;
  width: min(420px, 90vw);
  background: var(--bg-secondary);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  height: 100%;
}

.af-drawer__panel--right {
  margin-left: auto;
  border-left: 1px solid var(--border-default);
}

.af-drawer__panel--left {
  margin-right: auto;
  border-right: 1px solid var(--border-default);
}

.af-drawer__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.af-drawer__close {
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
}

.af-drawer__body {
  flex: 1;
  overflow-y: auto;
}

.af-slide-enter-active,
.af-slide-leave-active {
  transition: opacity var(--transition-default);
}

.af-slide-enter-from,
.af-slide-leave-to {
  opacity: 0;
}
</style>
