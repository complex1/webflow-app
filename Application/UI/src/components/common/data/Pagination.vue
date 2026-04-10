<template>
  <nav class="af-pagination" aria-label="Pagination">
    <button type="button" :disabled="isFirst" @click="goTo(page - 1)">
      <Icon name="chevron-left" />
    </button>
    <span>Page {{ page }} of {{ totalPages }}</span>
    <button type="button" :disabled="isLast" @click="goTo(page + 1)">
      <Icon name="chevron-right" />
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/common/utils/Icon.vue'

const props = withDefaults(
  defineProps<{
    page: number
    totalPages: number
  }>(),
  {
    page: 1,
    totalPages: 1
  }
)

const emit = defineEmits<{ (e: 'update:page', value: number): void }>()

const isFirst = computed(() => props.page <= 1)
const isLast = computed(() => props.page >= props.totalPages)

const goTo = (nextPage: number) => {
  if (nextPage < 1 || nextPage > props.totalPages) return
  emit('update:page', nextPage)
}
</script>

<style scoped>
.af-pagination {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-secondary);
}

button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-default);
  background: var(--bg-elevated);
  color: var(--text-primary);
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
