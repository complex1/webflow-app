<template>
  <Teleport to="body">
    <Transition name="modal">
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
          <!-- Glass modal header -->
          <div v-if="showHeader || title" class="ui-modal-header">
            <div class="modal-header-content">
              <h2 :id="titleId" class="ui-modal-title">
                <slot name="title">{{ title }}</slot>
              </h2>
              <p v-if="subtitle" class="ui-modal-subtitle">{{ subtitle }}</p>
            </div>
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
          
          <!-- Modal body with glass background -->
          <div :id="contentId" class="ui-modal-body" :class="{ 'no-padding': noPadding }">
            <slot></slot>
          </div>
          
          <!-- Glass modal footer -->
          <div v-if="$slots.footer" class="ui-modal-footer">
            <slot name="footer"></slot>
          </div>
          
          <!-- Loading overlay -->
          <div v-if="loading" class="modal-loading-overlay">
            <div class="loading-spinner"></div>
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
  subtitle?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  variant?: 'glass' | 'elevated' | 'minimal'
  closable?: boolean
  closeOnOverlay?: boolean
  persistent?: boolean
  loading?: boolean
  noPadding?: boolean
  showHeader?: boolean
  closeLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  size: 'md',
  variant: 'glass',
  closable: true,
  closeOnOverlay: true,
  persistent: false,
  loading: false,
  noPadding: false,
  showHeader: true,
  closeLabel: 'Close modal'
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
  open: []
}>()

const slots = useSlots()

const titleId = ref(`modal-title-${Math.random().toString(36).substr(2, 9)}`)
const contentId = ref(`modal-content-${Math.random().toString(36).substr(2, 9)}`)
const isOpening = ref(false)

const overlayClasses = computed(() => [
  'ui-modal-overlay',
  `ui-modal-overlay--${props.variant}`
])

const modalClasses = computed(() => [
  'ui-modal',
  `ui-modal--${props.size}`,
  `ui-modal--${props.variant}`,
  {
    'ui-modal--loading': props.loading,
    'ui-modal--no-header': !props.showHeader && !props.title
  }
])

const handleClose = () => {
  if (!props.persistent && !props.loading) {
    emit('update:visible', false)
    emit('close')
  }
}

const handleOverlayClick = () => {
  // Prevent closing if modal is still opening
  if (props.closeOnOverlay && !isOpening.value) {
    handleClose()
  }
}

// Handle escape key
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.visible && props.closable) {
    handleClose()
  }
}

// Body scroll lock
const lockBodyScroll = () => {
  document.body.style.overflow = 'hidden'
}

const unlockBodyScroll = () => {
  document.body.style.overflow = ''
}

// Watch for visibility changes
watch(() => props.visible, (newValue) => {
  if (newValue) {
    isOpening.value = true
    lockBodyScroll()
    emit('open')
    // Add delay to prevent immediate event conflicts and allow animation
    setTimeout(() => {
      document.addEventListener('keydown', handleEscape)
      isOpening.value = false
    }, 200)
  } else {
    isOpening.value = false
    unlockBodyScroll()
    document.removeEventListener('keydown', handleEscape)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  unlockBodyScroll()
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
/* Neo-Systemic Modal Overlay */
.ui-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-lg);
}

.ui-modal-overlay--glass {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.ui-modal-overlay--elevated {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.ui-modal-overlay--minimal {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

/* Glass Modal Container */
.ui-modal {
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 1;
  transform: scale(1);
  transition: all var(--transition-spring);
}

/* Modal Variants */
.ui-modal--glass {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-2xl);
}

.ui-modal--elevated {
  background: var(--color-background-elevated);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-2xl);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.ui-modal--minimal {
  background: var(--color-background);
  border: 1px solid var(--color-border-subtle);
  box-shadow: var(--shadow-lg);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

/* Modal Sizes */
.ui-modal--sm {
  width: 400px;
  max-width: 90vw;
}

.ui-modal--md {
  width: 600px;
  max-width: 90vw;
}

.ui-modal--lg {
  width: 800px;
  max-width: 90vw;
}

.ui-modal--xl {
  width: 1000px;
  max-width: 95vw;
}

.ui-modal--full {
  width: 95vw;
  height: 95vh;
  max-width: none;
  max-height: none;
}

/* Modal Header */
.ui-modal-header {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border-subtle);
  background: var(--color-background-subtle);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-top-left-radius: var(--radius-2xl);
  border-top-right-radius: var(--radius-2xl);
  gap: var(--spacing-sm);
}

.modal-header-content {
  flex: 1;
}

.ui-modal-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
  background: var(--gradient-flow-blue);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: var(--line-height-tight);
}

.ui-modal-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: var(--spacing-sm) 0 0 0;
  line-height: var(--line-height-normal);
}

.ui-modal-close {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-full);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-spring);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.ui-modal-close:hover {
  background: var(--color-danger-subtle);
  border-color: var(--color-danger);
  color: var(--color-danger);
  transform: scale(1.05);
}

.ui-modal-close:active {
  transform: scale(0.95);
}

/* Modal Body */
.ui-modal-body {
  flex: 1;
  overflow-y: auto;
  color: var(--color-text-primary);
  line-height: var(--line-height-normal);
}

.ui-modal-body.no-padding {
  padding: 0;
}

.ui-modal-body::-webkit-scrollbar {
  width: 8px;
}

.ui-modal-body::-webkit-scrollbar-track {
  background: var(--color-background-subtle);
  border-radius: var(--radius-sm);
}

.ui-modal-body::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--radius-sm);
}

.ui-modal-body::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-hover);
}

/* Modal Footer */
.ui-modal-footer {
  padding: var(--spacing-xl);
  border-top: 1px solid var(--color-border-subtle);
  background: var(--color-background-subtle);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-md);
  border-bottom-left-radius: var(--radius-2xl);
  border-bottom-right-radius: var(--radius-2xl);
}

/* Loading Overlay */
.modal-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--glass-bg);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: inherit;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border-subtle);
  border-top-color: var(--color-primary);
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
}

/* Modal without header */
.ui-modal--no-header .ui-modal-body {
  border-top-left-radius: var(--radius-2xl);
  border-top-right-radius: var(--radius-2xl);
}

/* Transition Animations */
.modal-enter-active,
.modal-leave-active {
  transition: all var(--transition-spring);
}

.modal-enter-active .ui-modal,
.modal-leave-active .ui-modal {
  transition: all var(--transition-spring);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .ui-modal,
.modal-leave-to .ui-modal {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

.modal-enter-to .ui-modal,
.modal-leave-from .ui-modal {
  transform: scale(1) translateY(0);
  opacity: 1;
}

/* Responsive Design */
@media (max-width: 768px) {
  .ui-modal-overlay {
    padding: var(--spacing-md);
  }
  
  .ui-modal--sm,
  .ui-modal--md,
  .ui-modal--lg,
  .ui-modal--xl {
    width: 100%;
    max-width: none;
  }
  
  .ui-modal--full {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }
  
  .ui-modal-header,
  .ui-modal-body,
  .ui-modal-footer {
    padding: var(--spacing-lg);
  }
  
  .ui-modal-title {
    font-size: var(--font-size-xl);
  }
}

/* Animation keyframes */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Vue Transition Classes for Modal */
.modal-enter-active,
.modal-leave-active {
  transition: all var(--transition-spring);
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Overlay transition */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity var(--transition-spring);
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .ui-modal,
  .ui-modal-close,
  .modal-enter-active,
  .modal-leave-active,
  .modal-enter-active .ui-modal,
  .modal-leave-active .ui-modal {
    transition: none;
  }
}
</style>
  