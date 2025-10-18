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
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-medium);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-decoration: none;
  outline: none;
  user-select: none;
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(10px);
}

.ui-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.ui-button:hover::before {
  left: 100%;
}

.ui-button:active {
  transform: translateY(1px);
}

.ui-button:focus {
  box-shadow: var(--shadow-glow);
}

.ui-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ui-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
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
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
  color: var(--color-text-inverse);
  border: 1px solid var(--color-primary);
}

.ui-button--primary:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-primary-hover), var(--color-primary-dark));
  border-color: var(--color-primary-hover);
}

.ui-button--secondary {
  background: var(--color-background-tertiary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.ui-button--secondary:hover:not(:disabled) {
  background: var(--color-gray-600);
  border-color: var(--color-border-hover);
}

.ui-button--success {
  background: linear-gradient(135deg, var(--color-success), var(--color-success-dark));
  color: var(--color-text-inverse);
  border: 1px solid var(--color-success);
}

.ui-button--success:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-success-dark), #2e7d32);
  border-color: var(--color-success-dark);
}

.ui-button--warning {
  background: linear-gradient(135deg, var(--color-warning), var(--color-warning-dark));
  color: var(--color-text-inverse);
  border: 1px solid var(--color-warning);
}

.ui-button--warning:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-warning-dark), #ef6c00);
  border-color: var(--color-warning-dark);
}

.ui-button--error {
  background: linear-gradient(135deg, var(--color-error), var(--color-error-dark));
  color: var(--color-text-inverse);
  border: 1px solid var(--color-error);
}

.ui-button--error:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-error-dark), #b71c1c);
  border-color: var(--color-error-dark);
}

.ui-button--ghost {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-primary);
  border: 1px solid var(--color-border);
  backdrop-filter: blur(10px);
}

.ui-button--ghost:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--color-primary);
}

.ui-button--link {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid transparent;
  padding: 0;
  text-decoration: underline;
  box-shadow: none;
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
