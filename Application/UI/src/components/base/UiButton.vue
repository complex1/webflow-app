<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
    v-bind="$attrs"
  >
    <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
    <i v-else-if="icon" :class="iconClass" :style="{ marginRight: $slots.default ? '0.5rem' : '0' }"></i>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  iconPosition: 'left',
  fullWidth: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const baseClasses = ['ui-button']

  // Variant classes
  const variantClasses = {
    primary: ['ui-button--primary'],
    secondary: ['ui-button--secondary'],
    success: ['ui-button--success'],
    warning: ['ui-button--warning'],
    error: ['ui-button--error'],
    ghost: ['ui-button--ghost'],
    link: ['ui-button--link']
  }

  // Size classes
  const sizeClasses = {
    xs: ['ui-button--xs'],
    sm: ['ui-button--sm'],
    md: ['ui-button--md'],
    lg: ['ui-button--lg'],
    xl: ['ui-button--xl']
  }

  // Full width
  if (props.fullWidth) {
    baseClasses.push('ui-button--full-width')
  }

  return [
    ...baseClasses,
    ...variantClasses[props.variant],
    ...sizeClasses[props.size]
  ]
})

const iconClass = computed(() => {
  if (!props.icon) return ''
  return `fas fa-${props.icon}`
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
/* Base button styles */
.ui-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-medium);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-decoration: none;
  outline: none;
  user-select: none;
  background: var(--color-background-elevated);
  color: var(--color-text-primary);
}

.ui-button:focus {
  border-color: var(--color-border-focus);
}

.ui-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ui-button:hover:not(:disabled) {
  background: var(--color-background-hover);
  border-color: var(--color-border-hover);
}

/* Size variants */
.ui-button--xs {
  font-size: var(--font-size-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
}

.ui-button--sm {
  font-size: var(--font-size-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
}

.ui-button--md {
  font-size: var(--font-size-base);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
}

.ui-button--lg {
  font-size: var(--font-size-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
}

.ui-button--xl {
  font-size: var(--font-size-xl);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-xl);
}

/* Color variants */
.ui-button--primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-color: var(--color-primary);
}

.ui-button--primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.ui-button--secondary {
  background: var(--color-background-elevated);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.ui-button--secondary:hover:not(:disabled) {
  background: var(--color-background-hover);
  border-color: var(--color-border-hover);
}

.ui-button--success {
  background: var(--color-success);
  color: var(--color-text-inverse);
  border: 1px solid var(--color-success);
}

.ui-button--success:hover:not(:disabled) {
  background: var(--color-success);
  border-color: var(--color-success);
  opacity: 0.9;
}

.ui-button--warning {
  background: var(--color-warning);
  color: var(--color-text-inverse);
  border: 1px solid var(--color-warning);
}

.ui-button--warning:hover:not(:disabled) {
  background: var(--color-warning);
  border-color: var(--color-warning);
  opacity: 0.9;
}

.ui-button--error {
  background: var(--color-danger);
  color: var(--color-text-inverse);
  border: 1px solid var(--color-danger);
}

.ui-button--error:hover:not(:disabled) {
  background: var(--color-danger);
  border-color: var(--color-danger);
  opacity: 0.9;
}

.ui-button--ghost {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.ui-button--ghost:hover:not(:disabled) {
  background: var(--color-background-subtle);
  border-color: var(--color-border-hover);
}

.ui-button--link {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid transparent;
  padding: 0;
  text-decoration: underline;
}

.ui-button--link:hover:not(:disabled) {
  text-decoration: none;
  color: var(--color-primary-hover);
}

/* Full width */
.ui-button--full-width {
  width: 100%;
}

/* Loading animation */
.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
