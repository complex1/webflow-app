<template>
    <div class="webflow-form">
        <form @submit.prevent="handleSubmit" class="form-content">
            <!-- Basic Information Section -->
            <div class="form-section">
                <h3 class="section-title">Basic Information</h3>
                <div class="form-field">
                    <div class="radio-group">
                        <label class="radio-option">
                            <input v-model="formData.isFolder" type="radio" :value="false" />
                            <span class="radio-label">
                                <i class="fas fa-project-diagram"></i>
                                Web Flow
                            </span>
                        </label>
                        <label class="radio-option">
                            <input v-model="formData.isFolder" type="radio" :value="true" />
                            <span class="radio-label">
                                <i class="fas fa-folder"></i>
                                Folder
                            </span>
                        </label>
                    </div>
                </div>
                <div class="form-row top-gap" style="grid-template-columns: 80px 1fr;">
                    <div class="form-field">
                        <label class="field-label">Icon</label>
                        <div class="custom-dropdown" :class="{ 'dropdown-open': showIconDropdown }">
                            <button type="button" class="dropdown-trigger" @click="toggleIconDropdown"
                                :class="{ 'error': errors.icon }" style="width: 80px; height: 40px;">
                                <i :class="formData.icon"></i>
                                <i class="fas fa-chevron-down dropdown-arrow"></i>
                            </button>
                            <div v-if="showIconDropdown" class="dropdown-menu" style="width: 260px;">
                                <div class="dropdown-options" style="width: 80px;">
                                    <button v-for="icon in availableIcons" :key="icon" type="button"
                                        class="dropdown-option" :class="{ 'selected': formData.icon === icon }"
                                        @click="selectIcon(icon)">
                                        <i :class="icon"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <UiInput v-model="formData.name" label="Name" placeholder="Enter web flow name" required
                        :error="errors.name" class="form-field" />
                </div>

                <UiInput v-model="formData.description" label="Description" placeholder="Enter web flow description"
                    type="textarea" :error="errors.description" class="form-field top-gap" />

                <div class="form-field top-gap">
                    <label class="field-label">Tags</label>
                    <div class="tags-input">
                        <div class="tags-list">
                            <span v-for="(tag, index) in formData.tags" :key="index" class="tag">
                                {{ tag }}
                                <button type="button" class="tag-remove" @click="removeTag(index)">
                                    <i class="fas fa-times"></i>
                                </button>
                            </span>
                        </div>
                        <UiInput v-model="newTag" placeholder="Add a tag and press Enter"
                            @keydown.enter.prevent="addTag" class="tag-input" />
                    </div>
                </div>

                <UiInput v-model="formData.basePath" label="Base Path" placeholder="/api/v1" :error="errors.basePath"
                    class="form-field top-gap" />
            </div>

            <div v-if="!formData.isFolder">
                <!-- OpenAPI Configuration Section -->
                <div class="form-section">
                    <h3 class="section-title">OpenAPI Configuration</h3>

                    <div class="form-field">
                        <label class="checkbox-label">
                            <input v-model="formData.hasOpenApiConfig" type="checkbox" />
                            <span class="checkmark"></span>
                            Enable OpenAPI Configuration
                        </label>
                    </div>

                    <div v-if="formData.hasOpenApiConfig" class="openapi-config">
                        <div class="form-field">
                            <label class="field-label">Configuration Type</label>
                            <div class="radio-group">
                                <label class="radio-option">
                                    <input v-model="formData.openApiConfigType" type="radio" value="SERVER" />
                                    <span class="radio-label">
                                        <i class="fas fa-server"></i>
                                        Server URL
                                    </span>
                                </label>
                                <label class="radio-option">
                                    <input v-model="formData.openApiConfigType" type="radio" value="FILE" />
                                    <span class="radio-label">
                                        <i class="fas fa-file"></i>
                                        File Upload
                                    </span>
                                </label>
                            </div>
                        </div>

                        <UiInput v-if="formData.openApiConfigType === 'SERVER'" v-model="formData.openApiServerUrl"
                            label="OpenAPI Server URL" placeholder="https://api.example.com/openapi.json" type="url"
                            :error="errors.openApiServerUrl" class="form-field top-gap" />

                         <div v-if="formData.openApiConfigType === 'FILE'" class="form-field top-gap">
                             <label class="field-label">OpenAPI File</label>
                             <UiFileUpload
                                 v-model="formData.openApiFileId"
                                 accept=".json,.yaml,.yml"
                                 upload-text="Choose OpenAPI File"
                                 hint="Upload your OpenAPI specification file"
                             />
                         </div>
                    </div>
                </div>

                <!-- Postman Collection Section -->
                <div class="form-section top-gap">
                    <h3 class="section-title">Postman Collection</h3>

                    <div class="form-field">
                        <label class="checkbox-label">
                            <input v-model="formData.hasPostmanCollection" type="checkbox" />
                            <span class="checkmark"></span>
                            Enable Postman Collection
                        </label>
                    </div>

                     <div v-if="formData.hasPostmanCollection" class="form-field top-gap">
                         <label class="field-label">Postman Collection File</label>
                         <UiFileUpload
                             v-model="formData.postmanFileId"
                             accept=".json"
                             upload-text="Choose Postman Collection"
                             hint="Upload your Postman collection file"
                         />
                     </div>
                </div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
                <UiButton type="button" variant="secondary" @click="handleCancel" class="cancel-button">
                    Cancel
                </UiButton>
                <UiButton type="submit" variant="primary" :loading="isSubmitting" class="submit-button">
                    {{ isEdit ? 'Update' : 'Create' }} Web Flow
                </UiButton>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { UiInput, UiButton, UiFileUpload } from '@/components/base'
import { toast } from '@/utils'
import { webFlowService, type CreateWebFlowRequest, type UpdateWebFlowRequest } from '@/services/webflow'
import router from '@/router'

interface WebFlowFormData {
    name: string
    description: string
    icon: string
    tags: string[]
    isFolder: boolean
    hasOpenApiConfig: boolean
    openApiConfigType?: 'SERVER' | 'FILE'
    openApiServerUrl?: string
    openApiFileId?: number
    hasPostmanCollection: boolean
    postmanFileId?: number
    basePath?: string
    parentId?: number
}

interface WebFlowFormErrors {
    name?: string
    description?: string
    icon?: string
    basePath?: string
    openApiServerUrl?: string
}

interface Props {
    visible?: boolean
    editData?: WebFlowFormData & { id?: number }
}

const props = withDefaults(defineProps<Props>(), {
    visible: false,
    editData: undefined
})

const emit = defineEmits<{
    submit: [data: any] // WebFlow from service
    close: []
}>()

// Form data
const formData = reactive<WebFlowFormData>({
    name: '',
    description: '',
    icon: 'fas fa-project-diagram',
    tags: [],
    isFolder: false,
    hasOpenApiConfig: false,
    openApiConfigType: undefined,
    openApiServerUrl: '',
    openApiFileId: undefined,
    hasPostmanCollection: false,
    postmanFileId: undefined,
    basePath: '',
    parentId: router.currentRoute.value.params.id ? parseInt(router.currentRoute.value.params.id as string) : undefined
})

const errors = reactive<WebFlowFormErrors>({})
const isSubmitting = ref(false)
const isEdit = computed(() => !!props.editData)

// Custom icon dropdown
const showIconDropdown = ref(false)
const availableIcons = [
    'fas fa-project-diagram',
    'fas fa-folder',
    'fas fa-folder-open',
    'fas fa-code',
    'fas fa-server',
    'fas fa-database',
    'fas fa-cloud',
    'fas fa-globe',
    'fas fa-cog',
    'fas fa-tools',
    'fas fa-rocket',
    'fas fa-lightning-bolt',
    'fas fa-fire',
    'fas fa-star',
    'fas fa-heart',
    'fas fa-shield-alt',
    'fas fa-lock',
    'fas fa-unlock',
    'fas fa-key',
    'fas fa-link'
]

// Tag management
const newTag = ref('')

// Form validation
const validateForm = (): boolean => {
    // Clear previous errors
    Object.keys(errors).forEach(key => {
        delete errors[key as keyof WebFlowFormErrors]
    })

    let isValid = true

    // Name validation
    if (!formData.name.trim()) {
        errors.name = 'Name is required'
        isValid = false
    } else if (formData.name.length > 100) {
        errors.name = 'Name must be less than 100 characters'
        isValid = false
    }

    // Description validation
    if (formData.description && formData.description.length > 500) {
        errors.description = 'Description must be less than 500 characters'
        isValid = false
    }

    // Icon validation
    if (!formData.icon.trim()) {
        errors.icon = 'Icon is required'
        isValid = false
    }

    // Base path validation
    if (formData.basePath && !formData.basePath.startsWith('/')) {
        errors.basePath = 'Base path must start with /'
        isValid = false
    }

    // OpenAPI server URL validation
    if (formData.hasOpenApiConfig && formData.openApiConfigType === 'SERVER') {
        if (!formData.openApiServerUrl?.trim()) {
            errors.openApiServerUrl = 'OpenAPI server URL is required'
            isValid = false
        } else {
            try {
                new URL(formData.openApiServerUrl)
            } catch {
                errors.openApiServerUrl = 'Please enter a valid URL'
                isValid = false
            }
        }
    }

    return isValid
}

// Form submission
const handleSubmit = async () => {
    if (!validateForm()) {
        return
    }

    isSubmitting.value = true

    try {
        let response
        if (isEdit.value && props.editData?.id) {
            // Update existing web flow
            const updateData: UpdateWebFlowRequest = {
                name: formData.name,
                description: formData.description,
                icon: formData.icon,
                tags: formData.tags,
                isFolder: formData.isFolder,
                hasOpenApiConfig: formData.hasOpenApiConfig,
                openApiConfigType: formData.openApiConfigType,
                openApiServerUrl: formData.openApiServerUrl,
                openApiFileId: formData.openApiFileId,
                hasPostmanCollection: formData.hasPostmanCollection,
                postmanFileId: formData.postmanFileId,
                basePath: formData.basePath,
                parentId: formData.parentId
            }
            response = await webFlowService.update(props.editData.id, updateData)
            toast.success(response.message || 'Web flow updated successfully')
        } else {
            // Create new web flow
            const createData: CreateWebFlowRequest = {
                name: formData.name,
                description: formData.description,
                icon: formData.icon,
                tags: formData.tags,
                isFolder: formData.isFolder,
                hasOpenApiConfig: formData.hasOpenApiConfig,
                openApiConfigType: formData.openApiConfigType,
                openApiServerUrl: formData.openApiServerUrl,
                openApiFileId: formData.openApiFileId,
                hasPostmanCollection: formData.hasPostmanCollection,
                postmanFileId: formData.postmanFileId,
                basePath: formData.basePath,
                parentId: formData.parentId
            }
            response = await webFlowService.create(createData)
            toast.success(response.message || 'Web flow created successfully')
        }

        // Emit the created/updated web flow data
        emit('submit', response.webFlow)
        
    } catch (error: any) {
        console.error('Form submission error:', error)
        const errorMessage = error?.response?.data?.error || error.message || 'Failed to submit form. Please try again.'
        toast.error(errorMessage)
    } finally {
        isSubmitting.value = false
    }
}

const handleCancel = () => {
    emit('close')
}

// Icon dropdown functions
const toggleIconDropdown = () => {
    showIconDropdown.value = !showIconDropdown.value
}

const selectIcon = (icon: string) => {
    formData.icon = icon
    showIconDropdown.value = false
}

// Tag management
const addTag = () => {
    const tag = newTag.value.trim()
    if (tag && !formData.tags.includes(tag)) {
        formData.tags.push(tag)
        newTag.value = ''
    }
}

const removeTag = (index: number) => {
    formData.tags.splice(index, 1)
}


// Reset form
const resetForm = () => {
    Object.assign(formData, {
        name: '',
        description: '',
        icon: 'fas fa-project-diagram',
        tags: [],
        isFolder: false,
        hasOpenApiConfig: false,
        openApiConfigType: undefined,
        openApiServerUrl: '',
        openApiFileId: undefined,
        hasPostmanCollection: false,
        postmanFileId: undefined,
        basePath: ''
    })
     newTag.value = ''
}

// Clear errors
const clearErrors = () => {
    Object.keys(errors).forEach(key => {
        delete errors[key as keyof WebFlowFormErrors]
    })
}

// Watch for edit data changes
watch(() => props.editData, (newData) => {
    if (newData) {
        Object.assign(formData, newData)
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

// Close dropdown when clicking outside
onMounted(() => {
    const handleClickOutside = (event: Event) => {
        const target = event.target as HTMLElement
        if (!target.closest('.custom-dropdown')) {
            showIconDropdown.value = false
        }
    }
    document.addEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.top-gap {
    margin-top: var(--spacing-md);
}

.webflow-form {
    max-width: 800px;
    margin: 0 auto;
}

.form-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
}

.form-section {
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
}

.section-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-primary-dark);
    margin: 0 0 var(--spacing-lg) 0;
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid var(--color-border);
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

.field-label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-xs);
}

/* Custom Icon Dropdown */
.custom-dropdown {
    position: relative;
    width: 100%;
}

.dropdown-trigger {
    width: 100%;
    padding: var(--spacing-sm);
    border: 1px solid var(--color-gray-300);
    border-radius: var(--radius-md);
    background: var(--color-background);
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: all var(--transition-fast);
    font-size: var(--font-size-base);
}

.dropdown-trigger:hover {
    border-color: var(--color-gray-400);
}

.dropdown-trigger:focus {
    outline: none;
    border-color: var(--color-primary-dark);
    box-shadow: 0 0 0 3px var(--color-primary-light);
}

.dropdown-trigger.error {
    border-color: #dc2626;
}

.dropdown-arrow {
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    transition: transform var(--transition-fast);
}

.dropdown-open .dropdown-arrow {
    transform: rotate(180deg);
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--color-background);
    border: 1px solid var(--color-gray-300);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    z-index: var(--z-dropdown);
    margin-top: var(--spacing-xs);
    max-height: 200px;
    overflow-y: auto;
}

.dropdown-options {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
}

.dropdown-option {
    width: 40px;
    height: 40px;
    border: 2px solid var(--color-gray-300);
    border-radius: var(--radius-md);
    background: var(--color-background-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-fast);
    font-size: var(--font-size-base);
}

.dropdown-option:hover {
    border-color: var(--color-primary-dark);
    background: var(--color-primary-light);
}

.dropdown-option.selected {
    border-color: #1e3a8a;
    background: #1e3a8a;
    color: white;
}

/* Tags Input */
.tags-input {
    border: 1px solid var(--color-gray-300);
    border-radius: var(--radius-md);
    padding: var(--spacing-sm);
    min-height: 40px;
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    align-items: center;
}

.tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
}

.tag {
    background: var(--color-primary-light);
    color: var(--color-primary-dark);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-sm);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
}

.tag-remove {
    background: none;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    padding: 0;
    margin-left: var(--spacing-xs);
}

.tag-remove:hover {
    color: var(--color-error);
}

.tag-input {
    flex: 1;
    min-width: 120px;
}

/* Radio Group */
.radio-group {
    display: flex;
    gap: var(--spacing-md);
}

.radio-option {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.radio-option input[type="radio"] {
    display: none;
}

.radio-label {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    border: 2px solid var(--color-gray-300);
    border-radius: var(--radius-lg);
    background: var(--color-background-secondary);
    transition: all var(--transition-fast);
    font-weight: var(--font-weight-medium);
}

.radio-option input[type="radio"]:checked+.radio-label {
    border-color: #1e3a8a;
    background: #eff6ff;
    color: #1e3a8a;
}

.radio-label i {
    font-size: var(--font-size-base);
}

/* Checkbox */
.checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-weight: var(--font-weight-medium);
}

.checkbox-label input[type="checkbox"] {
    display: none;
}

.checkmark {
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-gray-300);
    border-radius: var(--radius-sm);
    margin-right: var(--spacing-sm);
    position: relative;
    transition: all var(--transition-fast);
}

.checkbox-label input[type="checkbox"]:checked+.checkmark {
    background: #1e3a8a;
    border-color: #1e3a8a;
}

.checkbox-label input[type="checkbox"]:checked+.checkmark::after {
    content: '';
    position: absolute;
    left: 6px;
    top: 2px;
    width: 6px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}


/* OpenAPI Config */
.openapi-config {
    margin-top: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--color-background-secondary);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-gray-200);
}

/* Form Actions */
.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-border);
}

.cancel-button {
    min-width: 100px;
}

.submit-button {
    min-width: 150px;
}

/* Dark theme support */
[data-theme="dark"] .form-section {
    background: #1f2937;
    border-color: #374151;
}

[data-theme="dark"] .section-title {
    color: #f9fafb;
    border-color: #374151;
}

[data-theme="dark"] .field-label {
    color: #d1d5db;
}

[data-theme="dark"] .dropdown-trigger {
    background: #374151;
    border-color: #4b5563;
    color: #d1d5db;
}

[data-theme="dark"] .dropdown-trigger:focus {
    border-color: #1e3a8a;
    box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.2);
}

[data-theme="dark"] .dropdown-trigger:hover {
    border-color: #6b7280;
}

[data-theme="dark"] .dropdown-trigger.error {
    border-color: #dc2626;
}

[data-theme="dark"] .dropdown-menu {
    background: #1f2937;
    border-color: #374151;
}

[data-theme="dark"] .dropdown-option {
    background: #374151;
    border-color: #4b5563;
}

[data-theme="dark"] .dropdown-option:hover {
    border-color: #1e3a8a;
    background: #1e3a8a;
}

[data-theme="dark"] .dropdown-option.selected {
    border-color: #1e3a8a;
    background: #1e3a8a;
    color: white;
}

[data-theme="dark"] .tags-input {
    background: #374151;
    border-color: #4b5563;
}

[data-theme="dark"] .radio-label {
    background: #374151;
    border-color: #4b5563;
    color: #d1d5db;
}

[data-theme="dark"] .openapi-config {
    background: #111827;
    border-color: #374151;
}


[data-theme="dark"] .form-actions {
    border-color: #374151;
}

/* Responsive Design */
@media (max-width: 768px) {
    .form-row {
        grid-template-columns: 1fr;
    }

    .radio-group {
        flex-direction: column;
    }

    .dropdown-options {
        grid-template-columns: repeat(4, 1fr);
    }

    .form-actions {
        flex-direction: column;
    }

    .cancel-button,
    .submit-button {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .webflow-form {
        padding: 1rem;
    }

    .form-section {
        padding: 1rem;
    }

    .dropdown-options {
        grid-template-columns: repeat(3, 1fr);
    }
}
</style>
