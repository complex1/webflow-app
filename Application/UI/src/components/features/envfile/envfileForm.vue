<template>
  <UiDrawer
    :visible="visible"
    :title="formTitle"
    size="lg"
    position="right"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="envfile-form">
      <!-- EnvFile Basic Information -->
      <div class="form-section">
        <h3 class="section-title">Environment File Details</h3>
        
        <div class="form-row">
          <UiInput
            v-model="formData.name"
            label="File Name"
            placeholder="Enter environment file name"
            required
            :error="errors.name"
            @input="validateField('name')"
          />
        </div>

        <div class="form-row">
          <UiInput
            v-model="formData.description"
            label="Description"
            placeholder="Enter description (optional)"
            type="textarea"
            :error="errors.description"
            @input="validateField('description')"
          />
        </div>
      </div>

      <!-- Environment Variables Section -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">Environment Variables</h3>
          <UiButton
            type="button"
            variant="secondary"
            size="sm"
            icon="plus"
            @click="addConfig"
          >
            Add Variable
          </UiButton>
        </div>

        <div v-if="formData.configs.length === 0" class="empty-state">
          <i class="fas fa-key"></i>
          <p>No environment variables added yet</p>
          <UiButton
            type="button"
            variant="ghost"
            size="sm"
            @click="addConfig"
          >
            Add your first variable
          </UiButton>
        </div>

        <div v-else class="configs-list">
          <div
            v-for="(config, index) in formData.configs"
            :key="config.id"
            class="config-item"
          >
            <div class="config-header">
              <span class="config-number">#{{ index + 1 }}</span>
              <button
                type="button"
                class="remove-config"
                @click="removeConfig(index)"
                :disabled="formData.configs.length === 1"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>

            <div class="config-fields">
              <div class="config-field">
                <UiInput
                  v-model="config.key"
                  label="Variable Name"
                  placeholder="e.g., API_URL"
                  required
                  :error="getConfigError(index, 'key')"
                  @input="validateConfigField(index, 'key')"
                />
              </div>

              <div class="config-field">
                <UiInput
                  v-model="config.value"
                  label="Value"
                  placeholder="e.g., https://api.example.com"
                  required
                  :error="getConfigError(index, 'value')"
                  @input="validateConfigField(index, 'value')"
                />
              </div>

              <div class="config-field">
                <UiInput
                  v-model="config.description"
                  label="Description (Optional)"
                  placeholder="Describe this variable"
                  :error="getConfigError(index, 'description')"
                  @input="validateConfigField(index, 'description')"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <UiButton
          type="button"
          variant="secondary"
          @click="handleClose"
          :disabled="isSubmitting"
        >
          Cancel
        </UiButton>
        
        <UiButton
          type="submit"
          variant="primary"
          :loading="isSubmitting"
          :disabled="!isFormValid"
        >
          {{ isEdit ? 'Update' : 'Create' }} Environment File
        </UiButton>
      </div>
    </form>
  </UiDrawer>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { UiDrawer, UiInput, UiButton } from '@/components/base'
import { envFileService, type CreateEnvFileRequest } from '@/services'
import { toast } from '@/utils'

interface EnvConfig {
  id: number
  key: string
  value: string
  description: string
}

export interface EnvFileFormData {
  id: string
  name: string
  description: string
  configs: EnvConfig[]
}

interface FormErrors {
  name?: string
  description?: string
  configs?: Array<{
    key?: string
    value?: string
    description?: string
  }>
}

interface Props {
  visible: boolean
  editData?: EnvFileFormData | null
}

const props = withDefaults(defineProps<Props>(), {
  editData: null
})

const emit = defineEmits<{
  close: []
  submit: [data: EnvFileFormData]
}>()

const isSubmitting = ref(false)
const errors = reactive<FormErrors>({})

const formData = reactive<EnvFileFormData>({
  id: '',
  name: '',
  description: '',
  configs: []
})

const isEdit = computed(() => !!props.editData)
const formTitle = computed(() => isEdit.value ? 'Edit Environment File' : 'Create Environment File')

const isFormValid = computed(() => {
  return formData.name.trim() !== '' && 
         formData.configs.length > 0 &&
         formData.configs.every(config => 
           config.key.trim() !== '' && config.value.trim() !== ''
         )
})

const resetForm = () => {
  formData.name = ''
  formData.description = ''
  formData.configs = []
  clearErrors()
}

const clearErrors = () => {
  Object.keys(errors).forEach(key => {
    delete errors[key as keyof FormErrors]
  })
}

// Watch for edit data changes
watch(() => props.editData, (newData) => {
  if (newData) {
    formData.name = newData.name
    formData.description = newData.description
    formData.id = newData.id
    
    // Handle both formats - if configs is an array or if config is a JSON string
    if ('configs' in newData && Array.isArray((newData as any).configs)) {
      formData.configs = [...(newData as any).configs]
    } else if ('config' in newData && typeof (newData as any).config === 'string') {
      try {
        const parsedConfig = JSON.parse((newData as any).config)
        formData.configs = parsedConfig.map((item: any, index: number) => ({
          id: item.id || '',
          key: item.key || '',
          value: item.value || '',
          description: item.description || ''
        }))
      } catch (error) {
        console.error('Error parsing config JSON:', error)
        formData.configs = []
      }
    } else {
      formData.configs = []
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// Watch for visibility changes
watch(() => props.visible, (newVisible) => {
  if (newVisible && !props.editData) {
    resetForm()
  }
})

const addConfig = () => {
  formData.configs.push({
    id: Date.now(),
    key: '',
    value: '',
    description: ''
  })
}

const removeConfig = (index: number) => {
  if (formData.configs.length > 1) {
    formData.configs.splice(index, 1)
  }
}

const validateField = (field: keyof EnvFileFormData) => {
  switch (field) {
    case 'name':
      if (!formData.name.trim()) {
        errors.name = 'File name is required'
      } else if (formData.name.trim().length > 100) {
        errors.name = 'File name must be less than 100 characters'
      } else {
        delete errors.name
      }
      break
    case 'description':
      if (formData.description.length > 500) {
        errors.description = 'Description must be less than 500 characters'
      } else {
        delete errors.description
      }
      break
  }
}

const validateConfigField = (index: number, field: keyof EnvConfig) => {
  const config = formData.configs[index]
  if (!errors.configs) {
    errors.configs = []
  }
  
  if (!errors.configs[index]) {
    errors.configs[index] = {}
  }

  switch (field) {
    case 'key':
      if (!config || !config.key || typeof config.key !== 'string' || !config.key.trim()) {
        errors.configs[index].key = 'Variable name is required'
      } else if (config.key.trim().length > 100) {
        errors.configs[index].key = 'Variable name must be less than 100 characters'
      } else if (!/^[A-Z_][A-Z0-9_]*$/.test(config.key.trim())) {
        errors.configs[index].key = 'Variable name must be uppercase with underscores only'
      } else {
        delete errors.configs[index].key
      }
      break
    case 'value':
      if (!config || !config.value || typeof config.value !== 'string' || !config.value.trim()) {
        errors.configs[index].value = 'Value is required'
      } else if (config.value.length > 1000) {
        errors.configs[index].value = 'Value must be less than 1000 characters'
      } else {
        delete errors.configs[index].value
      }
      break
    case 'description':
      if (config && config.description && typeof config.description === 'string' && config.description.length > 500) {
        errors.configs[index].description = 'Description must be less than 500 characters'
      } else {
        delete errors.configs[index].description
      }
      break
  }
}

const getConfigError = (index: number, field: keyof EnvConfig): string | undefined => {
  // Only allow valid fields to be accessed
  if (!errors.configs?.[index]) return undefined;
  if (field === 'key' || field === 'value' || field === 'description') {
    return errors.configs[index][field as 'key' | 'value' | 'description'];
  }
  return undefined;
}

const validateForm = (): boolean => {
  clearErrors()
  let isValid = true

  // Validate name
  validateField('name')
  if (errors.name) isValid = false

  // Validate description
  validateField('description')
  if (errors.description) isValid = false

  // Validate configs
  errors.configs = []
  if (Array.isArray(formData.configs)) {
    formData.configs.forEach((config, index) => {
      if (!errors.configs) errors.configs = [];
      if (!errors.configs[index]) errors.configs[index] = {};

      validateConfigField(index, 'key');
      validateConfigField(index, 'value');
      validateConfigField(index, 'description');
    })
  }

  // After validating all configs, check for any config errors
  if (Array.isArray(errors.configs)) {
    for (let i = 0; i < errors.configs.length; i++) {
      const configError = errors.configs[i];
      if (
        configError &&
        (configError.key || configError.value || configError.description)
      ) {
        isValid = false;
        break;
      }
    }
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const formattedData = {
      name: formData.name,
      description: formData.description,
      configs: formData.configs.map(config => ({
        key: config.key,
        value: config.value,
        description: config.description
      }))
    } as CreateEnvFileRequest
    handleClose()
    if (isEdit.value) {
      const response = await envFileService.update(Number(formData.id), formattedData)
      toast.success(response.message)
      emit('submit', { ...formData })
      handleClose()
    } else {
      const response = await envFileService.create(formattedData)
      toast.success(response.message)
      emit('submit', { ...formData })
      handleClose()
    }
  } catch (error) { 
    toast.error('Failed to create environment file')
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
.envfile-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  height: 100%;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-dark);
  margin: 0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl) var(--spacing-xl);
  text-align: center;
  background: var(--color-background-secondary);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text-secondary);
}

.empty-state i {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-md);
  color: var(--color-gray-400);
}

.empty-state p {
  margin: 0 0 var(--spacing-md) 0;
  font-weight: var(--font-weight-medium);
}

.configs-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.config-item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  background: var(--color-background-secondary);
}

.config-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.config-number {
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-dark);
  font-size: var(--font-size-sm);
}

.remove-config {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: var(--color-error-light);
  color: var(--color-error);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.remove-config:hover:not(:disabled) {
  background: var(--color-error-light);
  opacity: 0.8;
}

.remove-config:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.config-fields {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.config-field {
  display: flex;
  flex-direction: column;
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  margin-top: auto;
}

/* Dark theme support */
[data-theme="dark"] .section-title {
  color: var(--color-text-inverse);
}

[data-theme="dark"] .empty-state {
  background: var(--color-gray-800);
  border-color: var(--color-gray-700);
  color: var(--color-gray-400);
}

[data-theme="dark"] .empty-state i {
  color: var(--color-gray-600);
}

[data-theme="dark"] .config-item {
  background: var(--color-gray-800);
  border-color: var(--color-gray-700);
}

[data-theme="dark"] .config-number {
  color: var(--color-primary);
}

[data-theme="dark"] .remove-config {
  background: var(--color-error-dark);
  color: var(--color-error-light);
}

[data-theme="dark"] .remove-config:hover:not(:disabled) {
  background: var(--color-error);
  opacity: 0.8;
}

[data-theme="dark"] .form-actions {
  border-color: var(--color-gray-700);
}

/* Responsive Design */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .ui-button {
    width: 100%;
  }
}
</style>
