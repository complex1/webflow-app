<template>
  <Drawer :open="open" :title="form.id ? 'Edit environment' : 'Create environment'" @close="$emit('close')">
    <form class="env-form" @submit.prevent="submit">
      <Stack gap="md">
        <TextInput v-model="form.name" label="Environment name" placeholder="staging" required />
        <TextareaInput v-model="form.description" label="Description" :rows="3" />
        <EnvironmentConfigList v-model="form.configs" />
        <Inline gap="sm" justify="flex-end">
          <Button variant="ghost" type="button" @click="$emit('close')">Cancel</Button>
          <Button type="submit">Save</Button>
        </Inline>
      </Stack>
    </form>
  </Drawer>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Drawer } from '@/components/common/overlay'
import { Stack, Inline } from '@/components/common/foundation'
import { TextInput, TextareaInput } from '@/components/common/forms'
import { Button } from '@/components/common/buttons'
import { EnvironmentConfigList } from '@/components/environmentFile'
import type { EnvConfig } from '@/services/environment'

const props = defineProps<{
  open: boolean
  environment: any | null
}>()

const emit = defineEmits<{ (e: 'save', payload: any): void; (e: 'close'): void }>()

const form = reactive({
  id: null as number | null,
  name: '',
  description: '',
  configs: [] as EnvConfig[]
})

watch(
  () => props.environment,
  (value) => {
    if (value) {
      form.id = value.id
      form.name = value.name
      form.description = value.description
      form.configs = value.configs ? value.configs.map((item: EnvConfig) => ({ ...item })) : []
    } else {
      form.id = null
      form.name = ''
      form.description = ''
      form.configs = []
    }
  },
  { immediate: true }
)

const submit = () => {
  emit('save', { ...form })
}
</script>
