<template>
  <div :class="cardClasses" v-bind="$attrs">
    <div v-if="$slots.header || title" class="ui-card-header">
      <slot name="header">
        <h3 v-if="title" class="ui-card-title">{{ title }}</h3>
        <p v-if="subtitle" class="ui-card-subtitle">{{ subtitle }}</p>
      </slot>
    </div>
    
    <div v-if="$slots.default" class="ui-card-body">
      <slot></slot>
    </div>
    
    <div v-if="$slots.footer" class="ui-card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  variant?: 'default' | 'elevated' | 'outlined' | 'filled'
  size?: 'sm' | 'md' | 'lg'
  hoverable?: boolean
  clickable?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  hoverable: false,
  clickable: false,
  loading: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const cardClasses = computed(() => {
  const baseClasses = [
    'ui-card',
    `ui-card--${props.variant}`,
    `ui-card--${props.size}`
  ]

  if (props.hoverable) {
    baseClasses.push('ui-card--hoverable')
  }

  if (props.clickable) {
    baseClasses.push('ui-card--clickable')
  }

  if (props.loading) {
    baseClasses.push('ui-card--loading')
  }

  return baseClasses
})

const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>

<style scoped>
/* Base card styles */
.ui-card {
  background: var(--color-background-elevated);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-fast);
  position: relative;
}

/* Card variants */
.ui-card--default {
  border: 1px solid var(--color-border);
}

.ui-card--elevated {
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
}

.ui-card--outlined {
  border: 2px solid var(--color-border-hover);
  background: var(--color-background);
}

.ui-card--filled {
  background: var(--color-background-subtle);
  border: 1px solid var(--color-border);
}

/* Card sizes */
.ui-card--sm {
  padding: var(--spacing-md);
}

.ui-card--md {
  padding: var(--spacing-md);
}

.ui-card--lg {
  padding: var(--spacing-lg);
}

/* Interactive states */
.ui-card--hoverable:hover {
  border-color: var(--color-border-hover);
}

.ui-card--clickable {
  cursor: pointer;
}

.ui-card--loading {
  opacity: 0.6;
  pointer-events: none;
}

/* Card sections */
.ui-card-header {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  margin: 0 calc(-1 * var(--spacing-md));
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.ui-card-title {
  font-size: var(--font-size-base); /* Smaller */
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.ui-card-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
  margin: 0;
}

.ui-card-body {
  color: var(--color-text-primary);
}

.ui-card-footer {
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-md);
  margin-top: var(--spacing-md);
  margin-left: calc(-1 * var(--spacing-md));
  margin-right: calc(-1 * var(--spacing-md));
  margin-bottom: calc(-1 * var(--spacing-md));
  padding: var(--spacing-md);
}

/* Loading animation */
.ui-card--loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 0, 0, 0.1),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
</style>
