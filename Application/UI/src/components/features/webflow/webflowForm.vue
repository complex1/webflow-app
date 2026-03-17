<template>
  <div class="webflow-form">
    <form @submit.prevent="handleSubmit" class="form-content">
      <!-- Basic Information Section -->
      <div class="form-section glass-panel">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-info-circle section-icon"></i>
            Basic Information
          </h3>
        </div>
        <div class="form-field">
          <label class="field-label">Project Type</label>
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
        <div class="form-row" style="grid-template-columns: 80px 1fr">
          <div class="form-field">
            <label class="field-label">Icon</label>
            <button
              ref="iconTrigger"
              type="button"
              class="icon-trigger glass-button"
              @click="toggleIconSelector"
              :class="{ error: errors.icon, active: showIconSelector }"
            >
              <i :class="formData.icon" class="icon-preview"></i>
              <i class="fas fa-chevron-down dropdown-arrow"></i>
            </button>

            <UiFixedPopover
              v-model:visible="showIconSelector"
              :target-element="iconTrigger"
              placement="bottom-start"
              size="sm"
              :show-arrow="true"
              :closable="false"
            >
              <div class="icon-selector">
                <div class="selector-header">
                  <span class="selector-title">Choose Icon</span>
                </div>
                <div class="icon-grid">
                  <button
                    v-for="icon in availableIcons"
                    :key="icon"
                    type="button"
                    class="icon-option glass-button"
                    :class="{ selected: formData.icon === icon }"
                    @click="selectIcon(icon)"
                  >
                    <i :class="icon"></i>
                  </button>
                </div>
              </div>
            </UiFixedPopover>
          </div>
          <UiInput
            v-model="formData.name"
            label="Name"
            placeholder="Enter web flow name"
            required
            :error="errors.name"
            class="form-field"
          />
        </div>

        <UiInput
          v-model="formData.description"
          label="Description"
          placeholder="Enter web flow description"
          type="textarea"
          :error="errors.description"
          class="form-field"
        />

        <div class="form-field">
          <label class="field-label">Tags</label>
          <div class="tags-input glass-button">
            <div class="tags-list">
              <span
                v-for="(tag, index) in formData.tags"
                :key="index"
                class="tag"
              >
                {{ tag }}
                <button
                  type="button"
                  class="tag-remove"
                  @click="removeTag(index)"
                >
                  <i class="fas fa-times"></i>
                </button>
              </span>
            </div>
            <UiInput
              v-model="newTag"
              placeholder="Add a tag and press Enter"
              @keydown.enter.prevent="addTag"
              class="tag-input"
            />
          </div>
        </div>

        <UiInput
          v-if="!formData.isFolder"
          v-model="formData.basePath"
          label="Base Path"
          placeholder="/api/v1"
          :error="errors.basePath"
          class="form-field"
        />
      </div>

      <!-- OpenAPI Configuration Section -->
      <div class="form-section glass-panel" v-if="!formData.isFolder">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-code section-icon"></i>
            OpenAPI Configuration
          </h3>
        </div>

        <div class="form-field">
          <div class="checkbox-wrapper">
            <label class="checkbox-label">
              <input v-model="formData.hasOpenApiConfig" type="checkbox" />
              <span class="checkmark"></span>
              <span class="checkbox-text">Enable OpenAPI Configuration</span>
            </label>
          </div>
        </div>

        <div
          v-if="formData.hasOpenApiConfig"
          class="openapi-config glass-panel"
        >
          <div class="form-field">
            <label class="field-label">Configuration Type</label>
            <div class="radio-group">
              <label class="radio-option">
                <input
                  v-model="formData.openApiConfigType"
                  type="radio"
                  value="SERVER"
                />
                <span class="radio-label">
                  <i class="fas fa-server"></i>
                  Server URL
                </span>
              </label>
              <label class="radio-option">
                <input
                  v-model="formData.openApiConfigType"
                  type="radio"
                  value="FILE"
                />
                <span class="radio-label">
                  <i class="fas fa-file"></i>
                  File Upload
                </span>
              </label>
            </div>
          </div>

          <UiInput
            v-if="formData.openApiConfigType === 'SERVER'"
            v-model="formData.openApiServerUrl"
            label="OpenAPI Server URL"
            placeholder="https://api.example.com/openapi.json"
            type="url"
            :error="errors.openApiServerUrl"
            class="form-field"
          />

          <div v-if="formData.openApiConfigType === 'FILE'" class="form-field">
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
      <div class="form-section glass-panel" v-if="!formData.isFolder">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-rocket section-icon"></i>
            Postman Collection
          </h3>
        </div>

        <div class="form-field">
          <div class="checkbox-wrapper">
            <label class="checkbox-label">
              <input v-model="formData.hasPostmanCollection" type="checkbox" />
              <span class="checkmark"></span>
              <span class="checkbox-text">Enable Postman Collection</span>
            </label>
          </div>
        </div>

        <div v-if="formData.hasPostmanCollection" class="form-field">
          <label class="field-label">Postman Collection File</label>
          <UiFileUpload
            v-model="formData.postmanFileId"
            accept=".json"
            upload-text="Choose Postman Collection"
            hint="Upload your Postman collection file"
          />
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions glass-panel">
        <UiButton
          type="button"
          variant="secondary"
          @click="handleCancel"
          class="cancel-button"
        >
          <i class="fas fa-times action-icon"></i>
          Cancel
        </UiButton>
        <UiButton
          type="submit"
          variant="primary"
          :loading="isSubmitting"
          class="submit-button"
        >
          <i class="fas fa-save action-icon"></i>
          {{ isEdit ? "Update" : "Create" }} Web Flow
        </UiButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import {
  UiInput,
  UiButton,
  UiFileUpload,
  UiFixedPopover,
} from "@/components/base";
import { toast } from "@/utils";
import {
  webFlowService,
  type CreateWebFlowRequest,
  type UpdateWebFlowRequest,
} from "@/services/webflow";
import router from "@/router";

interface WebFlowFormData {
  name: string;
  description: string;
  icon: string;
  tags: string[];
  isFolder: boolean;
  hasOpenApiConfig: boolean;
  openApiConfigType?: "SERVER" | "FILE";
  openApiServerUrl?: string;
  openApiFileId?: number;
  hasPostmanCollection: boolean;
  postmanFileId?: number;
  basePath?: string;
  parentId?: number;
}

interface WebFlowFormErrors {
  name?: string;
  description?: string;
  icon?: string;
  basePath?: string;
  openApiServerUrl?: string;
}

interface Props {
  visible?: boolean;
  editData?: WebFlowFormData & { id?: number };
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  editData: undefined,
});

const emit = defineEmits<{
  submit: [data: any]; // WebFlow from service
  close: [];
}>();

// Form data
const formData = reactive<WebFlowFormData>({
  name: "",
  description: "",
  icon: "fas fa-project-diagram",
  tags: [],
  isFolder: false,
  hasOpenApiConfig: false,
  openApiConfigType: undefined,
  openApiServerUrl: "",
  openApiFileId: undefined,
  hasPostmanCollection: false,
  postmanFileId: undefined,
  basePath: "",
  parentId: router.currentRoute.value.params.id
    ? parseInt(router.currentRoute.value.params.id as string)
    : undefined,
});

const errors = reactive<WebFlowFormErrors>({});
const isSubmitting = ref(false);
const isEdit = computed(() => !!props.editData);

// Icon selector
const iconTrigger = ref<HTMLElement>();
const showIconSelector = ref(false);
const availableIcons = [
  "fas fa-project-diagram",
  "fas fa-folder",
  "fas fa-folder-open",
  "fas fa-code",
  "fas fa-server",
  "fas fa-database",
  "fas fa-cloud",
  "fas fa-globe",
  "fas fa-cog",
  "fas fa-tools",
  "fas fa-rocket",
  "fas fa-lightning-bolt",
  "fas fa-fire",
  "fas fa-star",
  "fas fa-heart",
  "fas fa-shield-alt",
  "fas fa-lock",
  "fas fa-unlock",
  "fas fa-key",
  "fas fa-link",
];

// Tag management
const newTag = ref("");

// Form validation
const validateForm = (): boolean => {
  // Clear previous errors
  Object.keys(errors).forEach((key) => {
    delete errors[key as keyof WebFlowFormErrors];
  });
  const isFolder = formData.isFolder;

  let isValid = true;

  // Name validation
  if (!formData.name.trim()) {
    errors.name = "Name is required";
    isValid = false;
  } else if (formData.name.length > 100) {
    errors.name = "Name must be less than 100 characters";
    isValid = false;
  }

  // Description validation
  if (formData.description && formData.description.length > 500) {
    errors.description = "Description must be less than 500 characters";
    isValid = false;
  }

  // Icon validation
  if (!isFolder && !formData.icon.trim()) {
    errors.icon = "Icon is required";
    isValid = false;
  }

  // Base path validation
  if (!isFolder && formData.basePath && !formData.basePath.startsWith("/")) {
    errors.basePath = "Base path must start with /";
    isValid = false;
  }

  // OpenAPI server URL validation
  if (!isFolder && formData.hasOpenApiConfig && formData.openApiConfigType === "SERVER") {
    if (!formData.openApiServerUrl?.trim()) {
      errors.openApiServerUrl = "OpenAPI server URL is required";
      isValid = false;
    } else {
      try {
        new URL(formData.openApiServerUrl);
      } catch {
        errors.openApiServerUrl = "Please enter a valid URL";
        isValid = false;
      }
    }
  }

  return isValid;
};

// Form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    let response;
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
        parentId: formData.parentId,
      };
      response = await webFlowService.update(props.editData.id, updateData);
      toast.success(response.message || "Web flow updated successfully");
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
        parentId: formData.parentId,
      };
      response = await webFlowService.create(createData);
      toast.success(response.message || "Web flow created successfully");
    }

    // Emit the created/updated web flow data
    emit("submit", response.webFlow);
  } catch (error: any) {
    console.error("Form submission error:", error);
    const errorMessage =
      error?.response?.data?.error ||
      error.message ||
      "Failed to submit form. Please try again.";
    toast.error(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  emit("close");
};

// Icon selection
const toggleIconSelector = () => {
  showIconSelector.value = !showIconSelector.value;
};

const selectIcon = (icon: string) => {
  formData.icon = icon;
  showIconSelector.value = false;
};

// Tag management
const addTag = () => {
  const tag = newTag.value.trim();
  if (tag && !formData.tags.includes(tag)) {
    formData.tags.push(tag);
    newTag.value = "";
  }
};

const removeTag = (index: number) => {
  formData.tags.splice(index, 1);
};

// Reset form
const resetForm = () => {
  Object.assign(formData, {
    name: "",
    description: "",
    icon: "fas fa-project-diagram",
    tags: [],
    isFolder: false,
    hasOpenApiConfig: false,
    openApiConfigType: undefined,
    openApiServerUrl: "",
    openApiFileId: undefined,
    hasPostmanCollection: false,
    postmanFileId: undefined,
    basePath: "",
  });
  newTag.value = "";
};

// Clear errors
const clearErrors = () => {
  Object.keys(errors).forEach((key) => {
    delete errors[key as keyof WebFlowFormErrors];
  });
};

// Watch for edit data changes
watch(
  () => props.editData,
  (newData) => {
    if (newData) {
      Object.assign(formData, newData);
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

// Watch for visibility changes
watch(
  () => props.visible,
  (newVisible) => {
    if (newVisible && !props.editData) {
      resetForm();
    }
  }
);
</script>

<style scoped>
/* ===== Webflow Form - Neo-Systemic Design ===== */

.webflow-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

/* ===== Form Sections ===== */
.form-section {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.section-header {
  margin-bottom: var(--spacing-sm);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  letter-spacing: var(--letter-spacing-tight);
}

.section-icon {
  font-size: var(--font-size-lg);
  color: var(--color-primary);
  background: var(--color-primary-light);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ===== Form Layout ===== */
.form-row {
  display: grid;
  gap: var(--spacing-lg);
  align-items: start;
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
  letter-spacing: var(--letter-spacing-normal);
}

/* ===== Icon Selector with UiFixedPopover ===== */
.icon-trigger {
  width: 80px;
  height: 44px;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-spring);
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
  position: relative;
}

.icon-trigger:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-md);
}

.icon-trigger:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.icon-trigger.error {
  border-color: var(--color-danger);
}

.icon-trigger.active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.icon-preview {
  font-size: var(--font-size-lg);
  color: var(--color-primary);
}

.dropdown-arrow {
  position: absolute;
  top: 15px;
  right: 6px;
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  transition: transform var(--transition-spring);
  pointer-events: none;
}

.icon-trigger.active .dropdown-arrow {
  transform: rotate(180deg);
  color: var(--color-primary);
}

.icon-selector {
  min-width: 280px;
  max-height: 320px;
  overflow-y: auto;
}

.selector-header {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border-subtle);
}

.selector-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
}

.icon-option {
  width: 40px;
  height: 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-spring);
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
  position: relative;
}

.icon-option:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.icon-option.selected {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-md);
}

/* ===== Tags Input ===== */
.tags-input {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  min-height: 56px;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  align-items: flex-start;
  transition: all var(--transition-normal);
}

.tags-input:hover {
  border-color: var(--color-border-hover);
}

.tags-input:focus-within {
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.tag {
  background: var(--gradient-flow-blue);
  color: white;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  transition: all var(--transition-normal);
  letter-spacing: var(--letter-spacing-normal);
}

.tag:hover {
  box-shadow: var(--shadow-md);
}

.tag-remove {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  padding: 2px;
  border-radius: var(--radius-full);
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.tag-remove:hover {
  background: rgba(255, 255, 255, 0.3);
}

.tag-input {
  flex: 1;
  min-width: 140px;
}

/* ===== Radio Group ===== */
.radio-group {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
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
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  transition: all var(--transition-spring);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  min-width: 120px;
  justify-content: center;
}

.radio-label:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-md);
}

.radio-option input[type="radio"]:checked + .radio-label {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  color: var(--color-primary);
  box-shadow: var(--shadow-lg);
}

.radio-label i {
  font-size: var(--font-size-md);
}

/* ===== Checkbox ===== */
.checkbox-wrapper {
  margin: var(--spacing-sm) 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  gap: var(--spacing-md);
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  position: relative;
  transition: all var(--transition-spring);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
}

.checkbox-label:hover .checkmark {
  border-color: var(--color-border-hover);
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: "";
  position: absolute;
  left: 5px;
  top: 0px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-text {
  letter-spacing: var(--letter-spacing-normal);
}

/* ===== OpenAPI Config ===== */
.openapi-config {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* ===== Form Actions ===== */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
}

.cancel-button,
.submit-button {
  min-width: 140px;
  gap: var(--spacing-sm);
}

.action-icon {
  font-size: var(--font-size-sm);
}

/* ===== Responsive Design ===== */
@media (max-width: 768px) {
  .webflow-form {
    padding: var(--spacing-md);
  }

  .form-section {
    padding: var(--spacing-lg);
  }

  .form-row {
    grid-template-columns: 1fr !important;
  }

  .radio-group {
    flex-direction: column;
  }

  .radio-label {
    min-width: auto;
    justify-content: flex-start;
  }

  .icon-grid {
    grid-template-columns: repeat(5, 1fr);
  }

  .form-actions {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .cancel-button,
  .submit-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: var(--font-size-lg);
  }

  .icon-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .icon-selector {
    min-width: 240px;
  }

  .tag {
    font-size: var(--font-size-xs);
  }
}

/* ===== Animation Effects ===== */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-menu {
  animation: slideIn 0.2s ease-out;
}

.form-section {
  animation: slideIn 0.3s ease-out;
}

.tag {
  animation: slideIn 0.2s ease-out;
}
</style>
