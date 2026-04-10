<template>
  <Modal :open="open" title="Delete environment" @close="$emit('close')">
    <Stack gap="sm">
      <Text tone="secondary" variant="sm">
        Are you sure you want to delete <strong>{{ environment?.name }}</strong>? This action cannot be undone.
      </Text>
      <Inline gap="sm" justify="flex-end">
        <Button variant="ghost" type="button" @click="$emit('close')">Cancel</Button>
        <Button variant="danger" type="button" @click="$emit('confirm')">Delete</Button>
      </Inline>
    </Stack>
  </Modal>
</template>

<script setup lang="ts">
import { Stack, Inline } from '@/components/common/foundation'
import { Text } from '@/components/common/typography'
import { Button } from '@/components/common/buttons'
import { Modal } from '@/components/common/overlay'

defineProps<{ open: boolean; environment: any | null }>()

defineEmits<{ (e: 'close'): void; (e: 'confirm'): void }>()
</script>
