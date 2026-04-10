<template>
  <Modal :open="open" title="Environment variables" @close="$emit('close')">
    <Stack gap="sm">
      <Text variant="sm" tone="secondary">{{ environment?.name }}</Text>
      <div class="env-detail">
        <div class="env-detail__row env-detail__header">
          <span>Key</span>
          <span>Value</span>
          <span>Description</span>
        </div>
        <div v-for="config in environment?.configs || []" :key="config.key" class="env-detail__row">
          <span>{{ config.key }}</span>
          <span>{{ config.value }}</span>
          <span>{{ config.description }}</span>
        </div>
        <Text v-if="!(environment?.configs?.length)" variant="sm" tone="muted">No variables configured.</Text>
      </div>
    </Stack>
  </Modal>
</template>

<script setup lang="ts">
import { Stack } from '@/components/common/foundation'
import { Text } from '@/components/common/typography'
import { Modal } from '@/components/common/overlay'

defineProps<{ open: boolean; environment: any | null }>()

defineEmits<{ (e: 'close'): void }>()
</script>

<style scoped>
.env-detail {
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.env-detail__row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-2);
  padding: var(--space-2);
  border-bottom: 1px solid var(--border-subtle);
}

.env-detail__row:last-child {
  border-bottom: none;
}

.env-detail__header {
  background: var(--bg-secondary);
  font-weight: 600;
}
</style>
