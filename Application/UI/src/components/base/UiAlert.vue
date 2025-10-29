<template>
  <div
    v-if="visible"
    :class="alertClasses"
    role="alert"
    :aria-live="type === 'error' ? 'assertive' : 'polite'"
  >
    <div class="ui-alert-content">
      <i v-if="icon" :class="iconClass" class="ui-alert-icon"></i>
      
      <div class="ui-alert-body">
        <h4 v-if="title" class="ui-alert-title">{{ title }}</h4>
        <div v-if="$slots.default" class="ui-alert-message">
          <slot></slot>
        </div>
      </div>
      
      <button
        v-if="dismissible"
        type="button"
        class="ui-alert-close"
        @click="handleDismiss"
        :aria-label="closeLabel"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  dismissible?: boolean
  closeLabel?: string
  variant?: 'default' | 'filled' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  autoClose?: boolean
  autoCloseDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  dismissible: false,
  closeLabel: 'Close',
  variant: 'default',
  size: 'md',
  autoClose: false,
  autoCloseDelay: 5000
})

const emit = defineEmits<{
  dismiss: []
  close: []
}>()

const visible = ref(true)

const alertClasses = computed(() => {
  const baseClasses = [
    'ui-alert',
    `ui-alert--${props.type}`,
    `ui-alert--${props.variant}`,
    `ui-alert--${props.size}`
  ]

  return baseClasses
})

const iconClass = computed(() => {
  if (props.icon) {
    return `fas fa-${props.icon}`
  }

  const defaultIcons = {
    info: 'fa-info-circle',
    success: 'fa-check-circle',
    warning: 'fa-exclamation-triangle',
    error: 'fa-exclamation-circle'
  }

  return `fas ${defaultIcons[props.type]}`
})

const handleDismiss = () => {
  visible.value = false
  emit('dismiss')
  emit('close')
}

// Auto close functionality
if (props.autoClose) {
  setTimeout(() => {
    handleDismiss()
  }, props.autoCloseDelay)
}
</script>

<style scoped>
/* Base alert styles */
.ui-alert {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  border: 1px solid;
}

.ui-alert::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: currentColor;
}

/* Alert variants */
.ui-alert--default {
  background: var(--color-background-elevated);
}

.ui-alert--filled {
  color: var(--color-text-inverse);
  background: var(--color-gray-800);
}

.ui-alert--outlined {
  background: var(--color-background-subtle);
  border: 2px solid;
}

/* Alert sizes */
.ui-alert--sm {
  font-size: var(--font-size-xs);
  padding: var(--spacing-sm);
}

.ui-alert--md {
  font-size: var(--font-size-sm);
  padding: var(--spacing-md);
}

.ui-alert--lg {
  font-size: var(--font-size-base);
  padding: var(--spacing-lg);
}

/* Type-specific styles */
.ui-alert--info {
  --current-alert-color: var(--color-primary);
  border-color: var(--color-primary);
  background: var(--color-background-elevated);
  color: var(--color-primary);
}

.ui-alert--info.ui-alert--filled {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.ui-alert--info.ui-alert--outlined {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-background-subtle);
}

.ui-alert--success {
  --current-alert-color: var(--color-success);
  border-color: var(--color-success);
  background: var(--color-background-elevated);
  color: var(--color-success);
}

.ui-alert--success.ui-alert--filled {
  background: var(--color-success);
  border-color: var(--color-success);
  color: var(--color-text-inverse);
}

.ui-alert--success.ui-alert--outlined {
  border-color: var(--color-success);
  color: var(--color-success);
  background: var(--color-background-subtle);
}

.ui-alert--warning {
  --current-alert-color: var(--color-warning);
  border-color: var(--color-warning);
  background: var(--color-background-elevated);
  color: var(--color-warning);
}

.ui-alert--warning.ui-alert--filled {
  background: var(--color-warning);
  border-color: var(--color-warning);
  color: var(--color-text-inverse);
}

.ui-alert--warning.ui-alert--outlined {
  border-color: var(--color-warning);
  color: var(--color-warning);
  background: var(--color-background-subtle);
}

.ui-alert--error {
  --current-alert-color: var(--color-danger);
  border-color: var(--color-danger);
  background: var(--color-background-elevated);
  color: var(--color-danger);
}

.ui-alert--error.ui-alert--filled {
  background: var(--color-danger);
  border-color: var(--color-danger);
  color: var(--color-text-inverse);
}

.ui-alert--error.ui-alert--outlined {
  border-color: var(--color-danger);
  color: var(--color-danger);
  background: transparent;
}

/* Alert content */
.ui-alert-content {
  display: flex;
  align-items: flex-start;
}

.ui-alert-icon {
  flex-shrink: 0;
  margin-right: var(--spacing-md);
  margin-top: 2px;
}

.ui-alert-body {
  flex: 1;
}

.ui-alert-title {
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-xs);
}

.ui-alert-message {
  font-size: var(--font-size-sm);
}

.ui-alert-close {
  flex-shrink: 0;
  margin-left: var(--spacing-md);
  color: currentColor;
  opacity: 0.7;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xs);
}

.ui-alert-close:hover {
  opacity: 1;
}

/* Animation removed for minimal design */
</style>
