<template>
  <Stack gap="sm">
    <Inline justify="space-between" align="center">
      <Text variant="sm" tone="secondary">Environment variables</Text>
      <Button variant="ghost" size="sm" type="button" icon="plus" @click="addEntry">Add row</Button>
    </Inline>
    <div v-if="!localConfigs.length" class="env-config-empty">
      <Text variant="sm" tone="muted">No variables added yet.</Text>
    </div>
    <div v-else class="env-config-list">
      <div v-for="(config, index) in localConfigs" :key="index" class="env-config-row">
        <TextInput v-model="config.key" label="Key" placeholder="API_URL" required />
        <TextInput v-model="config.value" label="Value" placeholder="https://api.example.com" required />
        <TextInput v-model="config.description" label="Description" placeholder="Base API URL" />
        <IconButton icon="trash" label="Remove" variant="danger" size="sm" type="button" @click="removeEntry(index)" />
      </div>
    </div>
  </Stack>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { Stack, Inline } from '@/components/common/foundation'
import { Text } from '@/components/common/typography'
import { TextInput } from '@/components/common/forms'
import { Button, IconButton } from '@/components/common/buttons'
import type { EnvConfig } from '@/services/environment'

interface EnvConfigRow {
  key: string
  value: string
  description: string
}

const props = defineProps<{ modelValue: EnvConfig[] }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: EnvConfig[]): void }>()

const localConfigs = ref<EnvConfigRow[]>([])
let suppressPropWatch = false

watch(
  () => props.modelValue,
  (value) => {
    if (suppressPropWatch) return
    localConfigs.value = value?.length
      ? value.map((item) => ({ key: item.key, value: item.value, description: item.description ?? '' }))
      : []
  },
  { immediate: true }
)

const addEntry = () => {
  localConfigs.value.push({ key: '', value: '', description: '' })
}

const removeEntry = (index: number) => {
  localConfigs.value.splice(index, 1)
}

watch(
  localConfigs,
  () => {
    suppressPropWatch = true
    emit(
      'update:modelValue',
      localConfigs.value.map((item) => ({
        key: item.key,
        value: item.value,
        description: item.description || undefined
      }))
    )
    nextTick(() => {
      suppressPropWatch = false
    })
  },
  { deep: true }
)
</script>

<style scoped>
.env-config-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.env-config-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr) auto;
  gap: var(--space-2);
  align-items: end;
}

.env-config-empty {
  padding: var(--space-3);
  border: 1px dashed var(--border-subtle);
  border-radius: var(--radius-md);
}
</style>
