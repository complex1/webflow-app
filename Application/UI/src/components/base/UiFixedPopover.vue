<template>
  <Teleport to="body">
    <!-- Transparent Mask/Backdrop -->
    <div
      v-if="visible"
      class="ui-popover-mask"
      @click="handleMaskClick"
    ></div>
    
    <div
      v-if="visible"
      class="ui-fixed-popover"
      :class="[
        `placement-${placement}`,
        `size-${size}`,
        { 'has-arrow': showArrow }
      ]"
      :style="popoverStyle"
      ref="popoverRef"
    >
      <!-- Arrow -->
      <div v-if="showArrow" class="popover-arrow" :class="`arrow-${placement}`"></div>
      
      <!-- Header (optional) -->
      <div v-if="title || $slots.header" class="popover-header">
        <slot name="header">
          <div class="popover-title">{{ title }}</div>
        </slot>
        <button
          v-if="closable"
          class="popover-close"
          @click="handleClose"
          aria-label="Close popover"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="popover-content">
        <slot></slot>
      </div>

      <!-- Footer (optional) -->
      <div v-if="$slots.footer" class="popover-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

interface Props {
  visible: boolean
  title?: string
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  position?: {
    x: number
    y: number
  }
  targetElement?: HTMLElement | null
  showArrow?: boolean
  closable?: boolean
  offset?: number
  autoPosition?: boolean
  boundary?: HTMLElement | null
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'bottom',
  size: 'md',
  showArrow: true,
  closable: true,
  offset: 8,
  autoPosition: true,
  boundary: null
})

const emit = defineEmits<{
  close: []
  'update:visible': [visible: boolean]
}>()

const popoverRef = ref<HTMLElement>()

// Calculate popover position
const popoverStyle = computed(() => {
  if (props.visible === false) {
    return { display: 'none' }
  }
  if (props.position) {
    return {
      position: 'fixed',
      left: `${props.position.x}px`,
      top: `${props.position.y}px`,
      zIndex: 9999
    }
  }

  if (props.targetElement) {
    const targetRect = props.targetElement.getBoundingClientRect()
    const { x, y } = calculatePosition(targetRect)
    
    return {
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      zIndex: 9999
    }
  }

  // Default center position
  return {
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999
  }
})

// Calculate optimal position based on target element and placement
const calculatePosition = (targetRect: DOMRect) => {
  const offset = props.offset
  let x = 0
  let y = 0

  // Get viewport dimensions
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  
  // Estimate popover dimensions (will be refined after render)
  const popoverWidth = getPopoverWidth()
  const popoverHeight = getPopoverHeight()

  switch (props.placement) {
    case 'top':
      x = targetRect.left + (targetRect.width / 2) - (popoverWidth / 2)
      y = targetRect.top - popoverHeight - offset
      break
    case 'top-start':
      x = targetRect.left
      y = targetRect.top - popoverHeight - offset
      break
    case 'top-end':
      x = targetRect.right - popoverWidth
      y = targetRect.top - popoverHeight - offset
      break
    case 'bottom':
      x = targetRect.left + (targetRect.width / 2) - (popoverWidth / 2)
      y = targetRect.bottom + offset
      break
    case 'bottom-start':
      x = targetRect.left
      y = targetRect.bottom + offset
      break
    case 'bottom-end':
      x = targetRect.right - popoverWidth
      y = targetRect.bottom + offset
      break
    case 'left':
      x = targetRect.left - popoverWidth - offset
      y = targetRect.top + (targetRect.height / 2) - (popoverHeight / 2)
      break
    case 'left-start':
      x = targetRect.left - popoverWidth - offset
      y = targetRect.top
      break
    case 'left-end':
      x = targetRect.left - popoverWidth - offset
      y = targetRect.bottom - popoverHeight
      break
    case 'right':
      x = targetRect.right + offset
      y = targetRect.top + (targetRect.height / 2) - (popoverHeight / 2)
      break
    case 'right-start':
      x = targetRect.right + offset
      y = targetRect.top
      break
    case 'right-end':
      x = targetRect.right + offset
      y = targetRect.bottom - popoverHeight
      break
  }

  // Auto-position adjustment if enabled
  if (props.autoPosition) {
    // Adjust horizontal position if going outside viewport
    if (x < 8) {
      x = 8
    } else if (x + popoverWidth > viewportWidth - 8) {
      x = viewportWidth - popoverWidth - 8
    }

    // Adjust vertical position if going outside viewport
    if (y < 8) {
      y = 8
    } else if (y + popoverHeight > viewportHeight - 8) {
      y = viewportHeight - popoverHeight - 8
    }
  }

  return { x, y }
}

// Estimate popover dimensions based on size
const getPopoverWidth = () => {
  const sizes = { sm: 200, md: 300, lg: 400, xl: 500 }
  return sizes[props.size]
}

const getPopoverHeight = () => {
  const sizes = { sm: 100, md: 150, lg: 200, xl: 250 }
  return sizes[props.size]
}

// Handle close
const handleClose = () => {
  emit('close')
  emit('update:visible', false)
}

// Handle mask click
const handleMaskClick = () => {
  if (props.closable) {
    handleClose()
  }
}

// Handle click outside
const handleClickOutside = (event: Event) => {
  if (popoverRef.value && !popoverRef.value.contains(event.target as Node)) {
    if (props.targetElement && props.targetElement.contains(event.target as Node)) {
      return // Don't close if clicking on target element
    }
    handleClose()
  }
}

// Handle escape key
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.visible) {
    handleClose()
  }
}

// Watch visibility changes
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    nextTick(() => {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    })
  } else {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleEscape)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
/* Glass Popover Container */
.ui-fixed-popover {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  overflow: hidden;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: popover-enter var(--transition-spring);
}

@keyframes popover-enter {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Size Variants */
.size-sm {
  min-width: 200px;
  max-width: 250px;
}

.size-md {
  min-width: 300px;
  max-width: 400px;
}

.size-lg {
  min-width: 400px;
  max-width: 500px;
}

.size-xl {
  min-width: 500px;
  max-width: 600px;
}

/* Arrow Styles */
.popover-arrow {
  position: absolute;
  width: 12px;
  height: 12px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  transform: rotate(45deg);
  z-index: -1;
}

.arrow-top {
  bottom: -6px;
  left: 50%;
  margin-left: -6px;
  border-top: none;
  border-left: none;
}

.arrow-bottom {
  top: -6px;
  left: 50%;
  margin-left: -6px;
  border-bottom: none;
  border-right: none;
}

.arrow-left {
  right: -6px;
  top: 50%;
  margin-top: -6px;
  border-left: none;
  border-bottom: none;
}

.arrow-right {
  left: -6px;
  top: 50%;
  margin-top: -6px;
  border-right: none;
  border-top: none;
}

/* Placement adjustments for arrows */
.placement-top-start .arrow-top,
.placement-bottom-start .arrow-bottom {
  left: 20px;
  margin-left: 0;
}

.placement-top-end .arrow-top,
.placement-bottom-end .arrow-bottom {
  right: 20px;
  left: auto;
  margin-left: 0;
}

.placement-left-start .arrow-left,
.placement-right-start .arrow-right {
  top: 20px;
  margin-top: 0;
}

.placement-left-end .arrow-left,
.placement-right-end .arrow-right {
  bottom: 20px;
  top: auto;
  margin-top: 0;
}

/* Header Styles */
.popover-header {
  padding: var(--spacing-lg) var(--spacing-lg) var(--spacing-md);
  border-bottom: 1px solid var(--glass-border);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: linear-gradient(
    135deg,
    var(--gradient-flow-glass-start),
    var(--gradient-flow-glass-end)
  );
  gap: var(--spacing-md);
}

.popover-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  background: var(--gradient-flow-blue);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: var(--leading-tight);
}

.popover-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--glass-bg-subtle);
  border: 1px solid var(--glass-border-subtle);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-spring);
  backdrop-filter: var(--glass-backdrop-subtle);
  -webkit-backdrop-filter: var(--glass-backdrop-subtle);
  flex-shrink: 0;
}

.popover-close:hover {
  background: var(--color-flow-red);
  border-color: var(--color-flow-red);
  color: white;
  transform: scale(1.05);
}

.popover-close:active {
  transform: scale(0.95);
}

/* Content Styles */
.popover-content {
  flex: 1;
  overflow-y: auto;
  color: var(--text-primary);
  line-height: var(--leading-normal);
}


/* Footer Styles */
.popover-footer {
  padding: var(--spacing-md) var(--spacing-lg) var(--spacing-lg);
  border-top: 1px solid var(--glass-border);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  background: linear-gradient(
    135deg,
    var(--gradient-flow-glass-start),
    var(--gradient-flow-glass-end)
  );
}

/* Transparent Mask/Backdrop */
.ui-popover-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
  z-index: 9998;
  animation: maskFadeIn 0.15s ease-out;
}

@keyframes maskFadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
    -webkit-backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .ui-fixed-popover {
    max-width: 95vw;
    max-height: 80vh;
  }
  
  .size-sm,
  .size-md,
  .size-lg,
  .size-xl {
    min-width: auto;
    width: 95vw;
  }
  
  .popover-header,
  .popover-content,
  .popover-footer {
    padding-left: var(--spacing-md);
    padding-right: var(--spacing-md);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .ui-fixed-popover {
    animation: none;
  }
  
  .popover-close {
    transition: none;
  }
}
</style>