<template>
  <div class="error-list" v-if="errors && errors.length">
    <div class="error-list__header">
      <Icon name="exclamation-triangle" class="error-list__icon" />
      <span>{{ errors.length }} Errors</span>
    </div>
    <ul class="error-list__items">
      <li v-for="(err, idx) in errors" :key="idx">
        {{ err.message }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/common/utils/Icon.vue'
import type { ValidationError } from '@/apifluxCore/types'

defineProps<{
  errors: ValidationError[]
}>()
</script>

<style scoped>
.error-list {
  background: color-mix(in srgb, var(--error-red) 8%, var(--bg-elevated));
  border: 1px solid color-mix(in srgb, var(--error-red) 35%, transparent);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  color: var(--error-red);
}

.error-list__header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
  font-weight: 600;
}

.error-list__icon {
  color: var(--error-red);
}

.error-list__items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 6px;
  color: var(--error-red);
  font-size: var(--text-sm);
  max-height: 200px;
  overflow-y: auto;
}
</style>
