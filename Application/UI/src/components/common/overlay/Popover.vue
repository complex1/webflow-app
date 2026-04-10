<template>
  <span class="af-popover" ref="triggerRef">
    <slot />
    <Teleport to="body">
      <Transition name="af-fade">
        <div v-if="open" class="af-popover__mask" />
      </Transition>
      <Transition name="af-fade">
        <div
          v-if="open"
          class="af-popover__content"
          ref="contentRef"
          role="dialog"
          :style="{ top: position.top + 'px', left: position.left + 'px' }"
          @mouseenter="hovering = true"
          @mouseleave="close"
        >
          <div
            v-if="showArrow"
            class="af-popover__arrow"
            :class="`is-${arrowPlacement}`"
          />
          <slot name="content" />
        </div>
      </Transition>
    </Teleport>
  </span>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

type PopoverPosition =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'left-center'
  | 'right-center'
  | 'top-center'
  | 'bottom-center'

const props = withDefaults(
  defineProps<{ open?: boolean; position?: PopoverPosition; showArrow?: boolean }>(),
  {
    open: false,
    position: 'bottom-center',
    showArrow: true
  }
)
const emit = defineEmits<{ (e: 'update:open', value: boolean): void }>()

const triggerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const hovering = ref(false)
const open = ref(props.open)
const position = ref({ top: 0, left: 0 })
const arrowPlacement = ref<'top' | 'right' | 'bottom' | 'left'>('top')
const offset = 8

const updatePosition = () => {
  if (!open.value || !triggerRef.value || !contentRef.value) return
  const triggerRect = triggerRef.value.getBoundingClientRect()
  const contentRect = contentRef.value.getBoundingClientRect()

  let top = triggerRect.bottom + offset
  let left = triggerRect.left

  switch (props.position) {
    case 'bottom-center':
      top = triggerRect.bottom + offset
      left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2
      break
    case 'top-center':
      top = triggerRect.top - contentRect.height - offset
      left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2
      break
    case 'bottom':
      top = triggerRect.bottom + offset
      left = triggerRect.left
      break
    case 'top':
      top = triggerRect.top - contentRect.height - offset
      left = triggerRect.left
      break
    case 'left':
      top = triggerRect.top
      left = triggerRect.left - contentRect.width - offset
      break
    case 'right':
      top = triggerRect.top
      left = triggerRect.right + offset
      break
    case 'left-center':
      top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2
      left = triggerRect.left - contentRect.width - offset
      break
    case 'right-center':
      top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2
      left = triggerRect.right + offset
      break
    default:
      top = triggerRect.bottom + offset
      left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2
      break
  }

  const maxTop = window.innerHeight - contentRect.height - offset
  const maxLeft = window.innerWidth - contentRect.width - offset
  top = Math.min(Math.max(offset, top), Math.max(offset, maxTop))
  left = Math.min(Math.max(offset, left), Math.max(offset, maxLeft))

  position.value = { top, left }

  switch (props.position) {
    case 'top':
    case 'top-center':
      arrowPlacement.value = 'bottom'
      break
    case 'left':
    case 'left-center':
      arrowPlacement.value = 'right'
      break
    case 'right':
    case 'right-center':
      arrowPlacement.value = 'left'
      break
    default:
      arrowPlacement.value = 'top'
  }
}

const close = () => {
  hovering.value = false
  open.value = false
  emit('update:open', false)
}

const onDocumentClick = (event: MouseEvent) => {
  if (!open.value) return
  const target = event.target as HTMLElement
  if (!triggerRef.value?.contains(target) && !contentRef.value?.contains(target)) {
    close()
  }
}

watch(
  () => props.open,
  (value) => {
    open.value = value
    if (value) {
      nextTick(updatePosition)
    }
  }
)

watch(
  () => props.position,
  () => {
    if (open.value) {
      nextTick(updatePosition)
    }
  }
)

const toggle = (e: MouseEvent) => {
  e.stopPropagation()
  open.value = !open.value
  emit('update:open', open.value)
  if (open.value) {
    nextTick(updatePosition)
  }
}

onMounted(() => {
  triggerRef.value?.addEventListener('click', toggle)
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition, true)
  document.addEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
  triggerRef.value?.removeEventListener('click', toggle)
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
  document.removeEventListener('click', onDocumentClick)
})
</script>

<style scoped>
.af-popover {
  position: relative;
  display: inline-flex;
}

.af-popover__content {
  position: fixed;
  z-index: var(--z-popover);
  min-width: 200px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}

.af-popover__mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: calc(var(--z-popover) - 1);
}

.af-fade-enter-active,
.af-fade-leave-active {
  transition: opacity var(--transition-default);
}

.af-fade-enter-from,
.af-fade-leave-to {
  opacity: 0;
}

.af-popover__arrow {
  position: absolute;
  width: 12px;
  height: 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  transform: rotate(45deg);
}

.af-popover__arrow.is-top {
  top: -6px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  border-bottom: none;
  border-right: none;
}

.af-popover__arrow.is-bottom {
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  border-top: none;
  border-left: none;
}

.af-popover__arrow.is-left {
  left: -6px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  border-top: none;
  border-right: none;
}

.af-popover__arrow.is-right {
  right: -6px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  border-bottom: none;
  border-left: none;
}
</style>
