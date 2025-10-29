<template>
  <Teleport to="body">
    <Transition name="drawer" appear>
      <div
        v-if="visible"
        class="ui-drawer-overlay"
        :class="overlayClasses"
        @click="handleOverlayClick"
      >
        <div
          :class="drawerClasses"
          @click.stop
          role="dialog"
          :aria-modal="true"
          :aria-labelledby="titleId"
        >
          <div v-if="showHeader" class="ui-drawer-header">
            <h2 :id="titleId" class="ui-drawer-title">
              <slot name="title">{{ title }}</slot>
            </h2>
            <button
              v-if="closable"
              type="button"
              class="ui-drawer-close"
              @click="handleClose"
              :aria-label="closeLabel"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="ui-drawer-body">
            <slot></slot>
          </div>
          
          <div v-if="$slots.footer" class="ui-drawer-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, onUnmounted, useSlots } from 'vue'

interface Props {
  visible?: boolean
  title?: string
  position?: 'left' | 'right' | 'top' | 'bottom'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
  closeLabel?: string
  persistent?: boolean
  overlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  position: 'right',
  size: 'md',
  closable: true,
  closeOnOverlay: true,
  closeOnEscape: true,
  closeLabel: 'Close',
  persistent: false,
  overlay: true
})

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  close: []
  open: []
}>()

const slots = useSlots()
const titleId = ref(`drawer-title-${Math.random().toString(36).substr(2, 9)}`)

const showHeader = computed(() => {
  return props.title || !!slots.title
})

const overlayClasses = computed(() => [
  'ui-drawer-overlay',
  {
    'ui-drawer-overlay--no-overlay': !props.overlay,
    'ui-drawer-overlay--persistent': props.persistent
  }
])

const drawerClasses = computed(() => [
  'ui-drawer',
  `ui-drawer--${props.position}`,
  `ui-drawer--${props.size}`,
  {
    'ui-drawer--no-header': !showHeader.value
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
/* Drawer overlay */
.ui-drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-modal);
  background: rgba(0, 0, 0, 0.5);
}

.ui-drawer-overlay--no-overlay {
  pointer-events: none;
}

.ui-drawer-overlay--persistent {
  pointer-events: none;
}

/* Drawer container */
.ui-drawer {
  position: fixed;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

/* Position variants */
.ui-drawer--left {
  top: 0;
  left: 0;
  height: 100%;
}

.ui-drawer--right {
  top: 0;
  right: 0;
  height: 100%;
}

.ui-drawer--top {
  top: 0;
  left: 0;
  width: 100%;
}

.ui-drawer--bottom {
  bottom: 0;
  left: 0;
  width: 100%;
}

/* Size variants */
.ui-drawer--sm {
  width: 280px;
}

.ui-drawer--md {
  width: 320px;
}

.ui-drawer--lg {
  width: 40%;
}

.ui-drawer--xl {
  width: 60%;
}

.ui-drawer--full {
  width: 100%;
}

/* Top/Bottom size variants */
.ui-drawer--top.ui-drawer--sm,
.ui-drawer--bottom.ui-drawer--sm {
  width: auto;
  height: 280px;
}

.ui-drawer--top.ui-drawer--md,
.ui-drawer--bottom.ui-drawer--md {
  width: auto;
  height: 320px;
}

.ui-drawer--top.ui-drawer--lg,
.ui-drawer--bottom.ui-drawer--lg {
  width: auto;
  height: 40%;
}

.ui-drawer--top.ui-drawer--xl,
.ui-drawer--bottom.ui-drawer--xl {
  width: auto;
  height: 60%;
}

.ui-drawer--top.ui-drawer--full,
.ui-drawer--bottom.ui-drawer--full {
  width: 100%;
  height: 100%;
}

/* Drawer sections */
.ui-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.ui-drawer-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.ui-drawer-close {
  color: var(--color-gray-400);
  padding: var(--spacing-xs);
  border-radius: var(--radius-full);
  background: none;
  border: none;
  cursor: pointer;
}

.ui-drawer-close:hover {
  color: var(--color-gray-600);
  background: var(--color-gray-100);
}

.ui-drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
}

.ui-drawer-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  flex-shrink: 0;
}

/* Drawer transitions */

/* Responsive adjustments */
</style>
