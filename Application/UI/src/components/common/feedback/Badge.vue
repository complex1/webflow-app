<template>
  <span class="af-badge" :class="`af-badge--${variant}`">
    <slot />
  </span>
</template>

<script setup lang="ts">
type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

withDefaults(defineProps<{ variant?: BadgeVariant }>(), { variant: 'default' })
</script>

<style scoped>
.af-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 500;
  border: 1px solid transparent;
}

.af-badge--default {
  color: var(--text-secondary);
  border-color: var(--border-subtle);
}

.af-badge--success {
  color: var(--success-green);
  /* rgba — html2canvas cannot parse color-mix() */
  border-color: rgba(34, 197, 94, 0.45);
}

.af-badge--warning {
  color: var(--warning-yellow);
  border-color: rgba(245, 158, 11, 0.45);
}

.af-badge--error {
  color: var(--error-red);
  border-color: rgba(239, 68, 68, 0.45);
}

.af-badge--info {
  color: var(--accent-blue);
  border-color: rgba(59, 130, 246, 0.45);
}
</style>
