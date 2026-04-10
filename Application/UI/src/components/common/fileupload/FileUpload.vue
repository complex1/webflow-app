<template>
  <div class="af-file-upload">
    <div v-if="!file" class="af-file-upload__dropzone" :class="{ 'is-disabled': isDisabled }">
      <input
        ref="input"
        class="af-file-upload__input"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="isDisabled"
        @change="handleFileSelect"
      />
      <Button type="button" :disabled="isDisabled" icon="upload" @click="triggerSelect">
        {{ isDisabled ? 'Uploading…' : uploadText }}
      </Button>
      <Text variant="sm" tone="muted">{{ hint }}</Text>
    </div>

    <div v-else class="af-file-upload__details">
      <div class="af-file-upload__meta">
        <div class="af-file-upload__name">{{ file.originalName || file.name }}</div>
        <Text variant="xs" tone="muted">{{ formatSize(file.size) }}</Text>
      </div>
      <Inline gap="xs">
        <IconButton icon="download" label="Download" @click="downloadFile" />
        <IconButton icon="trash" label="Remove" variant="danger" @click="removeFile" />
      </Inline>
    </div>

    <InlineMessage v-if="error" tone="error" icon="exclamation-triangle">{{ error }}</InlineMessage>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Button, IconButton } from '@/components/common/buttons'
import { Inline } from '@/components/common/foundation'
import { Text } from '@/components/common/typography'
import { InlineMessage } from '@/components/common/feedback'
import { fileService, type FileRecord } from '@/services/file'

const props = withDefaults(
  defineProps<{
    modelValue?: number | null
    accept?: string
    uploadText?: string
    hint?: string
    multiple?: boolean
    maxSize?: number
  }>(),
  {
    accept: '*/*',
    uploadText: 'Upload',
    hint: 'Select a file to upload',
    maxSize: 10 * 1024 * 1024
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
  (e: 'upload', file: FileRecord): void
  (e: 'remove'): void
  (e: 'error', message: string): void
}>()

const input = ref<HTMLInputElement>()
const file = ref<FileRecord | null>(null)
const uploading = ref(false)
const error = ref('')

const isDisabled = computed(() => uploading.value)

const triggerSelect = () => {
  if (!isDisabled.value) input.value?.click()
}

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  if (!selectedFile) return
  if (selectedFile.size > props.maxSize) {
    showError('File too large')
    return
  }
  await uploadFile(selectedFile)
}

const uploadFile = async (selected: globalThis.File) => {
  uploading.value = true
  error.value = ''
  try {
    const response = await fileService.upload(selected)
    file.value = response.file
    emit('update:modelValue', response.file.id)
    emit('upload', response.file)
  } catch (err: any) {
    showError(err?.response?.data?.error || 'Upload failed')
  } finally {
    uploading.value = false
    if (input.value) input.value.value = ''
  }
}

const removeFile = async () => {
  if (!file.value) return
  try {
    await fileService.delete(file.value.id)
    file.value = null
    emit('update:modelValue', null)
    emit('remove')
  } catch (err: any) {
    showError(err?.response?.data?.error || 'Remove failed')
  }
}

const downloadFile = async () => {
  if (!file.value) return
  try {
    const blob = await fileService.download(file.value.id)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = file.value.originalName || file.value.name
    link.click()
    URL.revokeObjectURL(url)
  } catch (err: any) {
    showError(err?.response?.data?.error || 'Download failed')
  }
}

const loadFile = async (id: number) => {
  try {
    const data = await fileService.getById(id)
    file.value = data.file
  } catch {
    file.value = null
  }
}

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      if (file.value?.id !== value) loadFile(value)
    } else {
      file.value = null
    }
  },
  { immediate: true }
)

const showError = (message: string) => {
  error.value = message
  emit('error', message)
}

const formatSize = (bytes?: number) => {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let index = 0
  let size = bytes
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024
    index++
  }
  return `${size.toFixed(1)} ${units[index]}`
}
</script>

<style scoped>
.af-file-upload {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.af-file-upload__dropzone {
  border: 1px dashed var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  text-align: center;
}

.af-file-upload__dropzone.is-disabled {
  opacity: 0.6;
}

.af-file-upload__input {
  display: none;
}

.af-file-upload__details {
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.af-file-upload__meta {
  display: flex;
  flex-direction: column;
}

.af-file-upload__name {
  font-weight: 600;
}
</style>
