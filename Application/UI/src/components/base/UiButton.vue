<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
    v-bind="$attrs"
  >
    <div class="button-content">
      <i v-if="loading" class="fas fa-spinner fa-spin loading-icon"></i>
      <i v-else-if="icon" :class="iconClass" class="button-icon"></i>
      <span v-if="$slots.default" class="button-text">
        <slot></slot>
      </span>
    </div>
    <div v-if="variant === 'primary'" class="button-glow"></div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'ghost' | 'glass'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  rounded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'secondary',
  size: 'sm',
  disabled: false,
  loading: false,
  iconPosition: 'left',
  fullWidth: false,
  rounded: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const classes = ['ui-button', `ui-button--${props.variant}`, `ui-button--${props.size}`]
  
  if (props.fullWidth) classes.push('ui-button--full-width')
  if (props.rounded) classes.push('ui-button--rounded')
  if (props.loading) classes.push('ui-button--loading')
  if (props.disabled) classes.push('ui-button--disabled')
  
  return classes
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
/* Base Neo-Systemic Button Styles */
.ui-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-spring);
  text-decoration: none;
  outline: none;
  user-select: none;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--color-text-primary);
  overflow: hidden;
}

.ui-button:focus {
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.ui-button:hover:not(.ui-button--disabled):not(.ui-button--loading) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-border-hover);
}

.ui-button:active:not(.ui-button--disabled):not(.ui-button--loading) {
  transform: translateY(0);
}

.ui-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.ui-button--loading {
  cursor: wait;
}

/* Button Content */
.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  position: relative;
  z-index: 1;
}

.button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-text {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.loading-icon {
  animation: spin 1s linear infinite;
}

/* Button Glow Effect */
.button-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-flow-blue);
  opacity: 0;
  transition: opacity var(--transition-normal);
  border-radius: inherit;
}

.ui-button--primary:hover .button-glow {
  opacity: 0.1;
}

/* Size Variants */
.ui-button--xs {
  font-size: var(--font-size-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  min-height: 28px;
  border-radius: var(--radius-sm);
}

.ui-button--sm {
  font-size: var(--font-size-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  min-height: 36px;
  border-radius: var(--radius-md);
}

.ui-button--md {
  font-size: var(--font-size-md);
  padding: var(--spacing-md) var(--spacing-lg);
  min-height: 44px;
  border-radius: var(--radius-lg);
}

.ui-button--lg {
  font-size: var(--font-size-lg);
  padding: var(--spacing-lg) var(--spacing-xl);
  min-height: 52px;
  border-radius: var(--radius-lg);
}

.ui-button--xl {
  font-size: var(--font-size-xl);
  padding: var(--spacing-xl) var(--spacing-2xl);
  min-height: 60px;
  border-radius: var(--radius-xl);
}

/* Variant Styles - Neo-Systemic */
.ui-button--primary {
  background: var(--gradient-flow-blue);
  color: white;
  border-color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
  box-shadow: 0 4px 15px rgba(0, 122, 255, 0.2);
}

.ui-button--primary:hover:not(.ui-button--disabled):not(.ui-button--loading) {
  box-shadow: 0 8px 25px rgba(0, 122, 255, 0.3);
  background: var(--color-primary-hover);
}

.ui-button--secondary {
  background: var(--glass-bg);
  color: var(--color-text-primary);
  border-color: var(--glass-border);
}

.ui-button--secondary:hover:not(.ui-button--disabled):not(.ui-button--loading) {
  background: rgba(255, 255, 255, 0.9);
}

.ui-button--success {
  background: var(--gradient-data-green);
  color: white;
  border-color: var(--color-success);
  box-shadow: 0 4px 15px rgba(48, 209, 88, 0.2);
}

.ui-button--success:hover:not(.ui-button--disabled):not(.ui-button--loading) {
  box-shadow: 0 8px 25px rgba(48, 209, 88, 0.3);
}

.ui-button--warning {
  background: var(--gradient-warning-amber);
  color: white;
  border-color: var(--color-warning);
  box-shadow: 0 4px 15px rgba(255, 149, 0, 0.2);
}

.ui-button--warning:hover:not(.ui-button--disabled):not(.ui-button--loading) {
  box-shadow: 0 8px 25px rgba(255, 149, 0, 0.3);
}

.ui-button--danger {
  background: var(--gradient-error-red);
  color: white;
  border-color: var(--color-danger);
  box-shadow: 0 4px 15px rgba(255, 69, 58, 0.2);
}

.ui-button--danger:hover:not(.ui-button--disabled):not(.ui-button--loading) {
  box-shadow: 0 8px 25px rgba(255, 69, 58, 0.3);
}

.ui-button--info {
  background: linear-gradient(135deg, var(--color-info) 0%, #81E6FF 100%);
  color: white;
  border-color: var(--color-info);
  box-shadow: 0 4px 15px rgba(100, 210, 255, 0.2);
}

.ui-button--info:hover:not(.ui-button--disabled):not(.ui-button--loading) {
  box-shadow: 0 8px 25px rgba(100, 210, 255, 0.3);
}

.ui-button--ghost {
  background: transparent;
  color: var(--color-text-primary);
  border-color: var(--color-border);
}

.ui-button--ghost:hover:not(.ui-button--disabled):not(.ui-button--loading) {
  background: var(--color-background-hover);
  border-color: var(--color-border-hover);
}

.ui-button--glass {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  color: var(--color-text-primary);
  border-color: var(--glass-border);
  box-shadow: var(--shadow-card);
}

.ui-button--glass:hover:not(.ui-button--disabled):not(.ui-button--loading) {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: var(--shadow-xl);
}

/* Modifiers */
.ui-button--full-width {
  width: 100%;
}

.ui-button--rounded {
  border-radius: var(--radius-full);
}

/* Icon-only buttons */
.ui-button:not(.ui-button--full-width) .button-content:has(.button-icon):not(:has(.button-text)) {
  width: 1em;
  height: 1em;
}

.ui-button--xs:not(.ui-button--full-width):has(.button-icon):not(:has(.button-text)) { width: 28px; }
.ui-button--sm:not(.ui-button--full-width):has(.button-icon):not(:has(.button-text)) { width: 36px; }
.ui-button--md:not(.ui-button--full-width):has(.button-icon):not(:has(.button-text)) { width: 44px; }
.ui-button--lg:not(.ui-button--full-width):has(.button-icon):not(:has(.button-text)) { width: 52px; }
.ui-button--xl:not(.ui-button--full-width):has(.button-icon):not(:has(.button-text)) { width: 60px; }

/* Animation */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Micro-interactions */
.ui-button--primary {
  position: relative;
  overflow: hidden;
}

.ui-button--primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.ui-button--primary:hover::before {
  left: 100%;
}
</style>
