<template>
  <Modal :open="open" title="Test run" @close="emit('close')">
    <Stack gap="sm">
      <Text variant="sm" tone="muted" as="p">
        Test runs execute your current graph in the browser only (no saved server run). Choose
        environment variables for this test, run without them, or cancel.
      </Text>
      <template v-if="linkedEnvFiles.length > 0">
        <SelectInput
          id="test-run-env"
          label="Environment file"
          hint="Pick a linked env file to inject keys for this test."
          :options="envOptions"
          v-model="selectedFileId"
          placeholder="Select env file"
        />
      </template>
      <Alert v-else variant="info">
        No environment files are linked to this webflow. You can still run the test without env
        variables.
      </Alert>
    </Stack>
    <template #footer>
      <Inline gap="sm" justify="flex-end" wrap>
        <Button variant="secondary" type="button" @click="emit('close')">Cancel</Button>
        <Button variant="secondary" type="button" @click="emit('run-without-env')">
          Run without env
        </Button>
        <Button
          variant="primary"
          type="button"
          :disabled="
            linkedEnvFiles.length === 0 ||
            selectedFileId === '' ||
            selectedFileId === null
          "
          @click="emitRunWithEnv"
        >
          Run test
        </Button>
      </Inline>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Modal from '@/components/common/overlay/Modal.vue'
import Text from '@/components/common/typography/Text.vue'
import Stack from '@/components/common/foundation/Stack.vue'
import Inline from '@/components/common/foundation/Inline.vue'
import Button from '@/components/common/buttons/Button.vue'
import SelectInput from '@/components/common/forms/SelectInput.vue'
import Alert from '@/components/common/feedback/Alert.vue'
import type { WebflowLinkedEnvFiles } from '@/services/webflow'

const props = defineProps<{
  open: boolean
  linkedEnvFiles: WebflowLinkedEnvFiles[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'run-without-env'): void
  (e: 'run-with-env', envFileId: number): void
}>()

const selectedFileId = ref<string | number | boolean | null>('')

const envOptions = computed(() =>
  props.linkedEnvFiles.map((f) => ({ label: f.name, value: f.id }))
)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      selectedFileId.value = props.linkedEnvFiles[0]?.id ?? ''
    }
  }
)

function emitRunWithEnv() {
  const id = Number(selectedFileId.value)
  if (!Number.isFinite(id) || id <= 0) return
  emit('run-with-env', id)
}
</script>
