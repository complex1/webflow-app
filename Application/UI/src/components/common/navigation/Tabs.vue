<template>
  <div class="af-tabs">
    <button
      v-for="tab in items"
      :key="tab.value"
      class="af-tab"
      :class="{ 'is-active': tab.value === modelValue }"
      type="button"
      @click="select(tab.value)"
    >
      <Icon v-if="tab.icon" :name="tab.icon" class="af-tab__icon" />
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/common/utils/Icon.vue'

export interface TabItem {
  label: string
  value: string
  icon?: string
}

const props = defineProps<{
  modelValue: string
  items: TabItem[]
}>()

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const select = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.af-tabs {
  display: inline-flex;
  background: var(--bg-elevated);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  padding: 4px;
  gap: 4px;
}

.af-tab {
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  padding: 6px 12px;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  cursor: pointer;
}

.af-tab.is-active {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
}
</style>
