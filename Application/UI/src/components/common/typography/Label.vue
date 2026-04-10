<template>
  <label class="af-label" :for="forId">
    <slot />
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ forId?: string }>()
const forId = computed(() => props.forId)
</script>

<style scoped>
.af-label {
  display: inline-flex;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: none;
  gap: var(--space-1);
}
</style>
