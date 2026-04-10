<template>
  <span class="af-inline-message" :class="`af-inline-message--${tone}`">
    <Icon v-if="icon" :name="icon" />
    <slot />
  </span>
</template>

<script setup lang="ts">
import Icon from '@/components/common/utils/Icon.vue'

type Tone = 'muted' | 'success' | 'warning' | 'error'

withDefaults(defineProps<{ tone?: Tone; icon?: string }>(), {
  tone: 'muted',
  icon: undefined
})
</script>

<style scoped>
.af-inline-message {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
}

.af-inline-message--muted {
  color: var(--text-muted);
}

.af-inline-message--success {
  color: var(--success-green);
}

.af-inline-message--warning {
  color: var(--warning-yellow);
}

.af-inline-message--error {
  color: var(--error-red);
}
</style>
