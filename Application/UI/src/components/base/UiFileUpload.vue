<template>
  <div class="file-upload-component">
    <div v-if="!file" class="upload-area" :class="{ 'uploading': isUploading, 'error': hasError }">
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        @change="handleFileSelect"
        class="file-input"
        :disabled="isUploading"
      />
      <button
        type="button"
        class="upload-button"
        @click="triggerFileSelect"
        :disabled="isUploading"
      >
        <i v-if="isUploading" class="fas fa-spinner fa-spin"></i>
        <i v-else class="fas fa-upload"></i>
        {{ isUploading ? 'Uploading...' : uploadText }}
      </button>
      <p v-if="!isUploading" class="upload-hint">{{ hint }}</p>
    </div>

    <div v-else class="file-details">
      <div class="file-info">
        <div class="file-icon">
          <i :class="getFileIcon(file.mimetype || '')"></i>
        </div>
        <div class="file-meta">
          <div class="file-name">{{ file.originalName || file.name }}</div>
          <div class="file-size">{{ formatFileSize(file.size) }}</div>
          <div v-if="file.mimetype" class="file-type">{{ file.mimetype }}</div>
        </div>
      </div>
      <div class="file-actions">
        <button
          type="button"
          class="action-button download-button"
          @click="downloadFile"
          :title="'Download ' + (file.originalName || file.name)"
        >
          <i class="fas fa-download"></i>
        </button>
        <button
          type="button"
          class="action-button remove-button"
          @click="removeFile"
          :disabled="isDeleting"
          :title="'Remove ' + (file.originalName || file.name)"
        >
          <i v-if="isDeleting" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <div v-if="hasError" class="error-message">
      <i class="fas fa-exclamation-triangle"></i>
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { toast } from '@/utils'
import { fileService, type File } from '@/services/file'

// Use the File interface from the service
type FileData = File

interface Props {
  modelValue?: number | null
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  uploadText?: string
  hint?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  accept: '*/*',
  multiple: false,
  maxSize: 10 * 1024 * 1024, // 10MB
  uploadText: 'Choose File',
  hint: 'Click to upload or drag and drop',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  'upload': [file: FileData]
  'remove': []
  'error': [error: string]
}>()

// Component state
const fileInput = ref<HTMLInputElement>()
const isUploading = ref(false)
const isDeleting = ref(false)
const hasError = ref(false)
const errorMessage = ref('')
const file = ref<FileData | null>(null)

// Computed properties
const isDisabled = computed(() => props.disabled || isUploading.value || isDeleting.value)

// File type icons
const getFileIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'fas fa-image'
  if (mimeType.startsWith('video/')) return 'fas fa-video'
  if (mimeType.startsWith('audio/')) return 'fas fa-music'
  if (mimeType.includes('pdf')) return 'fas fa-file-pdf'
  if (mimeType.includes('word')) return 'fas fa-file-word'
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'fas fa-file-excel'
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'fas fa-file-powerpoint'
  if (mimeType.includes('zip') || mimeType.includes('rar')) return 'fas fa-file-archive'
  if (mimeType.includes('text')) return 'fas fa-file-alt'
  if (mimeType.includes('json')) return 'fas fa-file-code'
  if (mimeType.includes('yaml') || mimeType.includes('yml')) return 'fas fa-file-code'
  return 'fas fa-file'
}

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Trigger file input
const triggerFileSelect = () => {
  if (isDisabled.value) return
  fileInput.value?.click()
}

// Handle file selection
const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  
  if (!selectedFile) return

  // Validate file size
  if (selectedFile.size > props.maxSize) {
    showError(`File size must be less than ${formatFileSize(props.maxSize)}`)
    return
  }

  await uploadFile(selectedFile)
}

// Upload file to backend
const uploadFile = async (fileToUpload: globalThis.File) => {
  isUploading.value = true
  hasError.value = false
  errorMessage.value = ''

  try {
    const response = await fileService.upload(fileToUpload)
    
    // Update component state
    file.value = response.file

    // Emit events
    emit('update:modelValue', response.file.id)
    emit('upload', file.value)
    
    toast.success(response.message || 'File uploaded successfully')
    
  } catch (error: any) {
    console.error('Upload error:', error)
    const errorMessage = error?.response?.data?.error || error.message || 'Failed to upload file'
    showError(errorMessage)
    emit('error', errorMessage)
  } finally {
    isUploading.value = false
  }
}

// Remove file
const removeFile = async () => {
  if (!file.value || isDeleting.value) return

  isDeleting.value = true

  try {
    const response = await fileService.delete(file.value.id)

    // Clear component state
    file.value = null
    
    // Emit events
    emit('update:modelValue', null)
    emit('remove')
    
    toast.success(response.message || 'File removed successfully')
    
  } catch (error: any) {
    console.error('Delete error:', error)
    const errorMessage = error?.response?.data?.error || error.message || 'Failed to remove file'
    showError(errorMessage)
    emit('error', errorMessage)
  } finally {
    isDeleting.value = false
  }
}

// Download file
const downloadFile = async () => {
  if (!file.value) return
  
  try {
    const blob = await fileService.download(file.value.id)
    
    // Create blob URL and download
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = file.value.originalName || file.value.name
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up blob URL
    window.URL.revokeObjectURL(url)
    
  } catch (error: any) {
    console.error('Download error:', error)
    const errorMessage = error?.response?.data?.error || error.message || 'Failed to download file'
    showError(errorMessage)
    emit('error', errorMessage)
  }
}

// Show error
const showError = (message: string) => {
  hasError.value = true
  errorMessage.value = message
  toast.error(message)
}

// Load file data when modelValue changes
const loadFileData = async (fileId: number) => {
  try {
    const response = await fileService.getById(fileId)
    file.value = response.file
    
  } catch (error: any) {
    console.error('Load file error:', error)
    const errorMessage = error?.response?.data?.error || error.message || 'Failed to load file data'
    showError(errorMessage)
  }
}

// Watch for modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue !== file.value?.id) {
    loadFileData(newValue)
  } else if (!newValue) {
    file.value = null
  }
}, { immediate: true })

// Reset file input after upload
watch(() => file.value, () => {
  if (fileInput.value) {
    fileInput.value.value = ''
  }
})
</script>

<style scoped>
.file-upload-component {
  width: 100%;
}

.upload-area {
  border: 2px dashed var(--color-gray-300);
  border-radius: var(--radius-md);
  padding: var(--spacing-xl);
  text-align: center;
  background: var(--color-background-secondary);
  cursor: pointer;
}

.upload-area:hover {
  border-color: var(--color-primary-dark);
  background: var(--color-primary-light);
}

.upload-area.uploading {
  border-color: var(--color-primary-dark);
  background: var(--color-primary-light);
  cursor: not-allowed;
}

.upload-area.error {
  border-color: var(--color-error);
  background: var(--color-error-light);
}

.file-input {
  display: none;
}

.upload-button {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-primary-dark);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
}

.upload-button:hover:not(:disabled) {
  background: var(--color-primary);
}

.upload-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.upload-hint {
  margin-top: var(--spacing-sm);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.file-details {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  background: var(--color-background);
  gap: var(--spacing-md);
}

.file-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
  min-width: 0;
}

.file-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-gray-100);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-xl);
  flex-shrink: 0;
}

.file-meta {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: var(--spacing-xs);
}

.file-size {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: 2px;
}

.file-type {
  font-size: var(--font-size-xs);
  color: var(--color-gray-400);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.file-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.action-button {
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.action-button:hover:not(:disabled) {
  border-color: var(--color-gray-400);
  color: var(--color-text-primary);
}

.download-button:hover:not(:disabled) {
  border-color: var(--color-primary-dark);
  color: var(--color-primary-dark);
}

.remove-button:hover:not(:disabled) {
  border-color: var(--color-error);
  color: var(--color-error);
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-error-light);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-md);
  color: var(--color-error);
  font-size: var(--font-size-sm);
}

/* Theme support removed for monochromatic design */

/* Responsive design removed for minimal design */
</style>
