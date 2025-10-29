<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div
        v-if="visible"
        class="ui-modal-overlay"
        :class="overlayClasses"
        @click="handleOverlayClick"
      >
        <div
          :class="modalClasses"
          @click.stop
          role="dialog"
          :aria-modal="true"
          :aria-labelledby="titleId"
          :aria-describedby="contentId"
        >
          <div v-if="showHeader" class="ui-modal-header">
            <h2 :id="titleId" class="ui-modal-title">
              <slot name="title">{{ title }}</slot>
            </h2>
            <button
              v-if="closable"
              type="button"
              class="ui-modal-close"
              @click="handleClose"
              :aria-label="closeLabel"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div :id="contentId" class="ui-modal-body">
            <slot></slot>
          </div>
          
          <div v-if="$slots.footer" class="ui-modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onUnmounted, useSlots } from 'vue'

interface Props {
  visible?: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
  closeLabel?: string
  persistent?: boolean
  centered?: boolean
  scrollable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  size: 'md',
  closable: true,
  closeOnOverlay: true,
  closeOnEscape: true,
  closeLabel: 'Close',
  persistent: false,
  centered: true,
  scrollable: true
})

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  close: []
  open: []
}>()

const slots = useSlots()
const titleId = ref(`modal-title-${Math.random().toString(36).substr(2, 9)}`)
const contentId = ref(`modal-content-${Math.random().toString(36).substr(2, 9)}`)

const showHeader = computed(() => {
  return props.title || !!slots.title
})

const overlayClasses = computed(() => [
  'ui-modal-overlay',
  {
    'ui-modal-overlay--centered': props.centered,
    'ui-modal-overlay--persistent': props.persistent
  }
])

const modalClasses = computed(() => [
  'ui-modal',
  `ui-modal--${props.size}`,
  {
    'ui-modal--centered': props.centered,
    'ui-modal--scrollable': props.scrollable
  }
])

const handleOverlayClick = () => {
  if (props.closeOnOverlay && !props.persistent) {
    handleClose()
  }
}

const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEscape && !props.persistent) {
    handleClose()
  }
}

// Watch for visibility changes
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleEscape)
    emit('open')
  } else {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', handleEscape)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
/* Modal overlay */
.ui-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
}

.ui-modal-overlay--centered {
  align-items: center;
  justify-content: center;
}

.ui-modal-overlay--persistent {
  pointer-events: none;
}

/* Modal container */
.ui-modal {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  max-height: 100%;
  overflow: hidden;
  position: relative;
  z-index: var(--z-modal);
}

/* Modal sizes */
.ui-modal--sm {
  width: 100%;
  max-width: 320px;
}

.ui-modal--md {
  width: 100%;
  max-width: 380px;
}

.ui-modal--lg {
  width: 100%;
  max-width: 480px;
}

.ui-modal--xl {
  width: 100%;
  max-width: 540px;
}

.ui-modal--full {
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  border-radius: 0;
}

.ui-modal--centered {
  margin: 0 auto;
}

.ui-modal--scrollable {
  overflow-y: auto;
}

/* Modal sections */
.ui-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.ui-modal-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.ui-modal-close {
  color: var(--color-gray-400);
  padding: var(--spacing-xs);
  border-radius: var(--radius-full);
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-base);
}

.ui-modal-close:hover {
  color: var(--color-gray-600);
  background: var(--color-gray-100);
}

.ui-modal-body {
  padding: var(--spacing-lg);
}

.ui-modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

/* Modal transitions */

/* Focus trap styles */
.ui-modal:focus {
  outline: none;
}

/* Responsive adjustments */
</style>
