<template>
  <div class="file-upload">
    <div class="file-upload-area" :class="{ 'drag-over': isDragOver, 'has-file': hasFile }" 
         @dragenter.prevent="onDragEnter"
         @dragover.prevent="onDragOver"
         @dragleave.prevent="onDragLeave"
         @drop.prevent="onDrop">
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        @change="onFileSelect"
        class="file-input"
        :id="inputId"
      />
      <label :for="inputId" class="file-upload-label">
        <div v-if="!hasFile" class="upload-placeholder">
          <i class="pi pi-cloud-upload"></i>
          <p>Drag and drop your OpenAPI file here or <span class="upload-link">click to browse</span></p>
          <small>Supports JSON and YAML formats</small>
        </div>
        <div v-else class="file-info">
          <i class="pi pi-file"></i>
          <div class="file-details">
            <p class="file-name">{{ fileName }}</p>
            <small class="file-size">{{ fileSize }}</small>
          </div>
          <button type="button" class="btn btn-sm btn-danger" @click.stop="removeFile">
            <i class="pi pi-times"></i>
          </button>
        </div>
      </label>
    </div>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import * as YAML from 'js-yaml';

export default defineComponent({
  name: 'FileUpload',
  props: {
    accept: {
      type: String,
      default: '.json,.yaml,.yml'
    },
    modelValue: {
      type: Object,
      default: null
    }
  },
  emits: ['update:modelValue', 'error'],
  setup(_, { emit }) {
    const fileInput = ref<HTMLInputElement>();
    const isDragOver = ref(false);
    const error = ref('');
    const file = ref<File | null>(null);
    
    const inputId = `file-upload-${Math.random().toString(36).substr(2, 9)}`;
    
    const hasFile = computed(() => !!file.value);
    const fileName = computed(() => file.value?.name || '');
    const fileSize = computed(() => {
      if (!file.value) return '';
      const size = file.value.size;
      if (size < 1024) return `${size} B`;
      if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    });

    const validateFile = (selectedFile: File): boolean => {
      const validTypes = ['.json', '.yaml', '.yml'];
      const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
      
      if (!validTypes.includes(fileExtension)) {
        error.value = 'Please upload a valid JSON or YAML file';
        return false;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        error.value = 'File size must be less than 5MB';
        return false;
      }
      
      return true;
    };

    const parseFile = async (selectedFile: File): Promise<any> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
            
            let parsedContent;
            if (fileExtension === '.json') {
              parsedContent = JSON.parse(content);
            } else if (['.yaml', '.yml'].includes(fileExtension)) {
              parsedContent = YAML.load(content);
            } else {
              reject(new Error('Unsupported file format'));
              return;
            }
            
            resolve(parsedContent);
          } catch (err) {
            reject(new Error('Invalid file format or corrupted file'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(selectedFile);
      });
    };

    const processFile = async (selectedFile: File) => {
      error.value = '';
      
      if (!validateFile(selectedFile)) {
        return;
      }
      
      try {
        const fileData = await parseFile(selectedFile);
        file.value = selectedFile;
        emit('update:modelValue', fileData);
      } catch (err) {
        error.value = (err as Error).message;
        emit('error', error.value);
      }
    };

    const onFileSelect = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const selectedFile = input.files?.[0];
      if (selectedFile) {
        processFile(selectedFile);
      }
    };

    const onDragEnter = () => {
      isDragOver.value = true;
    };

    const onDragOver = () => {
      isDragOver.value = true;
    };

    const onDragLeave = (event: DragEvent) => {
      if (!event.relatedTarget || !(event.currentTarget as Element).contains(event.relatedTarget as Node)) {
        isDragOver.value = false;
      }
    };

    const onDrop = (event: DragEvent) => {
      isDragOver.value = false;
      const droppedFile = event.dataTransfer?.files[0];
      if (droppedFile) {
        processFile(droppedFile);
      }
    };

    const removeFile = () => {
      file.value = null;
      error.value = '';
      emit('update:modelValue', null);
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    };

    return {
      fileInput,
      isDragOver,
      error,
      hasFile,
      fileName,
      fileSize,
      inputId,
      onFileSelect,
      onDragEnter,
      onDragOver,
      onDragLeave,
      onDrop,
      removeFile
    };
  }
});
</script>

<style scoped>
.file-upload {
  width: 100%;
}

.file-upload-area {
  border: 2px dashed var(--color-border);
  border-radius: 8pt;
  padding: var(--spacing-large);
  transition: all 0.3s ease;
  cursor: pointer;
}

.file-upload-area:hover,
.file-upload-area.drag-over {
  border-color: var(--color-primary);
  background-color: rgba(var(--color-primary-rgb), 0.05);
}

.file-upload-area.has-file {
  border-color: var(--color-success);
  background-color: rgba(var(--color-success-rgb), 0.05);
}

.file-input {
  display: none;
}

.file-upload-label {
  display: block;
  cursor: pointer;
}

.upload-placeholder {
  text-align: center;
  color: var(--color-text-secondary);
}

.upload-placeholder i {
  font-size: 48px;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-medium);
}

.upload-placeholder p {
  margin-bottom: var(--spacing-small);
}

.upload-link {
  color: var(--color-primary);
  font-weight: 600;
}

.file-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-medium);
}

.file-info i {
  font-size: 24px;
  color: var(--color-success);
}

.file-details {
  flex: 1;
}

.file-name {
  font-weight: 600;
  margin-bottom: calc(var(--spacing-small) / 2);
}

.file-size {
  color: var(--color-text-secondary);
}

.error-message {
  color: var(--color-danger);
  font-size: var(--font-size-small);
  margin-top: var(--spacing-small);
}

.btn-sm {
  padding: calc(var(--spacing-small) / 2) var(--spacing-small);
  font-size: var(--font-size-small);
}
</style>
