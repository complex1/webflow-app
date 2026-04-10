<template>
  <span class="af-status-dot" :class="`af-status-dot--${status}`" :aria-label="status" />
</template>

<script setup lang="ts">
type Status = 'default' | 'success' | 'warning' | 'error' | 'info'

withDefaults(defineProps<{ status?: Status }>(), { status: 'default' })
</script>

<style scoped>
.af-status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-flex;
  background: var(--border-subtle);
}

.af-status-dot--success {
  background: var(--success-green);
}

.af-status-dot--warning {
  background: var(--warning-yellow);
}

.af-status-dot--error {
  background: var(--error-red);
}

.af-status-dot--info {
  background: var(--accent-blue);
}
</style>
