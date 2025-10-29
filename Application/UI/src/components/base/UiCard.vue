<template>
  <div :class="cardClasses" v-bind="$attrs" @click="handleClick">
    <div v-if="$slots.header || title" class="ui-card-header">
      <slot name="header">
        <div class="header-content">
          <h3 v-if="title" class="ui-card-title">{{ title }}</h3>
          <p v-if="subtitle" class="ui-card-subtitle">{{ subtitle }}</p>
        </div>
        <div v-if="$slots.actions" class="header-actions">
          <slot name="actions"></slot>
        </div>
      </slot>
    </div>
    
    <div v-if="$slots.default" class="ui-card-body" :class="{ 'no-padding': noPadding }">
      <slot></slot>
    </div>
    
    <div v-if="$slots.footer" class="ui-card-footer">
      <slot name="footer"></slot>
    </div>
    
    <!-- Glass shine effect for interactive cards -->
    <div v-if="hoverable || clickable" class="card-shine"></div>
    
    <!-- Loading overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  variant?: 'glass' | 'elevated' | 'outlined' | 'node' | 'minimal'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  hoverable?: boolean
  clickable?: boolean
  loading?: boolean
  noPadding?: boolean
  glow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'glass',
  size: 'md',
  hoverable: false,
  clickable: false,
  loading: false,
  noPadding: false,
  glow: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const cardClasses = computed(() => {
  const classes = [
    'ui-card',
    `ui-card--${props.variant}`,
    `ui-card--${props.size}`
  ]

  if (props.hoverable) classes.push('ui-card--hoverable')
  if (props.clickable) classes.push('ui-card--clickable')
  if (props.loading) classes.push('ui-card--loading')
  if (props.glow) classes.push('ui-card--glow')

  return classes
})

const handleClick = (event: MouseEvent) => {
  if (props.clickable && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
/* Base Neo-Systemic Card Styles */
.ui-card {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all var(--transition-spring);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-card);
}

/* Card Variants */
.ui-card--glass {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-card);
}

.ui-card--elevated {
  background: var(--color-background-elevated);
  border: 1px solid var(--color-border-subtle);
  box-shadow: var(--shadow-xl);
}

.ui-card--outlined {
  background: var(--color-background);
  border: 2px solid var(--color-primary);
  box-shadow: 0 0 0 4px var(--color-primary-light);
}

.ui-card--node {
  background: var(--glass-bg);
  border: 2px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.ui-card--minimal {
  background: transparent;
  border: 1px solid var(--color-border-subtle);
  box-shadow: none;
}

/* Card Sizes */
.ui-card--sm {
  border-radius: var(--radius-md);
}

.ui-card--sm .ui-card-header,
.ui-card--sm .ui-card-body,
.ui-card--sm .ui-card-footer {
  padding: var(--spacing-md);
}

.ui-card--md .ui-card-header,
.ui-card--md .ui-card-body,
.ui-card--md .ui-card-footer {
  padding: var(--spacing-lg);
}

.ui-card--lg .ui-card-header,
.ui-card--lg .ui-card-body,
.ui-card--lg .ui-card-footer {
  padding: var(--spacing-xl);
}

.ui-card--xl {
  border-radius: var(--radius-2xl);
}

.ui-card--xl .ui-card-header,
.ui-card--xl .ui-card-body,
.ui-card--xl .ui-card-footer {
  padding: var(--spacing-2xl);
}

/* Interactive States */
.ui-card--hoverable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-2xl);
  border-color: var(--color-border-hover);
}

.ui-card--clickable {
  cursor: pointer;
}

.ui-card--clickable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-2xl);
  border-color: var(--color-border-hover);
}

.ui-card--clickable:active {
  transform: translateY(-1px);
}

.ui-card--glow {
  box-shadow: var(--shadow-xl), 0 0 40px var(--color-primary-light);
}

/* Card Sections */
.ui-card-header {
  background: var(--color-background-subtle);
  border-bottom: 1px solid var(--color-border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}

.header-content {
  flex: 1;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.ui-card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
  background: var(--gradient-flow-blue);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ui-card-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: var(--spacing-xs) 0 0 0;
  line-height: var(--line-height-normal);
}

.ui-card-body {
  color: var(--color-text-primary);
  line-height: var(--line-height-normal);
}

.ui-card-body.no-padding {
  padding: 0 !important;
}

.ui-card-footer {
  background: var(--color-background-subtle);
  border-top: 1px solid var(--color-border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
}

/* Glass Shine Effect */
.card-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left var(--transition-slow);
  pointer-events: none;
}

.ui-card--hoverable:hover .card-shine,
.ui-card--clickable:hover .card-shine {
  left: 100%;
}

/* Loading States */
.ui-card--loading {
  pointer-events: none;
  overflow: hidden;
}

.loading-overlay {
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
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border-subtle);
  border-top-color: var(--color-primary);
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
}

/* Node Card Specific Styles */
.ui-card--node {
  min-width: 200px;
  max-width: 300px;
}

.ui-card--node .ui-card-header {
  background: var(--gradient-flow-blue);
  color: white;
  border-bottom: none;
}

.ui-card--node .ui-card-title {
  color: white;
  background: none;
  -webkit-text-fill-color: white;
}

.ui-card--node .ui-card-subtitle {
  color: rgba(255, 255, 255, 0.8);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .ui-card--xl .ui-card-header,
  .ui-card--xl .ui-card-body,
  .ui-card--xl .ui-card-footer {
    padding: var(--spacing-lg);
  }
  
  .ui-card--lg .ui-card-header,
  .ui-card--lg .ui-card-body,
  .ui-card--lg .ui-card-footer {
    padding: var(--spacing-md);
  }
}

/* Animation keyframes */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
