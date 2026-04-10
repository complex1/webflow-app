<template>
  <button class="af-nav-item" :class="{ 'is-active': active }" type="button" @click="$emit('select')">
    <Icon v-if="icon" :name="icon" class="af-nav-item__icon" />
    <span class="af-nav-item__label">
      <slot />
    </span>
    <Badge v-if="badge" variant="info">{{ badge }}</Badge>
  </button>
</template>

<script setup lang="ts">
import Icon from '@/components/common/utils/Icon.vue'
import { Badge } from '@/components/common/feedback'

withDefaults(defineProps<{ active?: boolean; icon?: string; badge?: string | number }>(), {
  active: false,
  icon: undefined,
  badge: undefined
})

defineEmits<{ (e: 'select'): void }>()
</script>

<style scoped>
.af-nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 10px;
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: background var(--transition-default), color var(--transition-default);
}

.af-nav-item:hover {
  background: color-mix(in srgb, var(--accent-blue) 8%, transparent);
  color: var(--text-primary);
}

.af-nav-item.is-active {
  background: color-mix(in srgb, var(--accent-blue) 18%, transparent);
  color: var(--text-primary);
}
</style>
