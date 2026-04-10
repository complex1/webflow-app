<template>
  <Teleport to="body">
    <Transition name="af-fade">
      <div v-if="open" class="af-modal" :class="rootClass" role="dialog" aria-modal="true">
        <div class="af-modal__backdrop" @click="handleBackdrop" />
        <div class="af-modal__panel" :style="panelInlineStyle">
          <header v-if="title" class="af-modal__header">
            <h3>{{ title }}</h3>
            <button class="af-modal__close" type="button" @click="emit('close')">
              <Icon name="times" />
            </button>
          </header>
          <div class="af-modal__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="af-modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/common/utils/Icon.vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    closeOnBackdrop?: boolean
    width?: string
    /** Merged onto the root `.af-modal` node (e.g. for print or theme hooks). */
    rootClass?: string
  }>(),
  { closeOnBackdrop: true }
)

const emit = defineEmits<{ (e: 'close'): void }>()

const panelInlineStyle = computed(() => (props.width ? { width: props.width } : undefined))

const handleBackdrop = () => {
  if (props.closeOnBackdrop) emit('close')
}
</script>

<style scoped>
.af-modal {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
}

.af-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
}

.af-modal__panel {
  position: relative;
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  width: min(520px, 90vw);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
}

.af-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.af-modal__header h3 {
  margin: 0;
  font-size: var(--text-lg);
}

.af-modal__close {
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
}

.af-modal__body {
  color: var(--text-secondary);
}

.af-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
}

.af-fade-enter-active,
.af-fade-leave-active {
  transition: opacity var(--transition-default);
}

.af-fade-enter-from,
.af-fade-leave-to {
  opacity: 0;
}
</style>
