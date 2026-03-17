<template>
  <div class="curl-node-form" v-if="!showApiNodeForm">
    <!-- cURL Input Section -->
    <div class="curl-input-section">
      <!-- Form Header -->
      <div class="form-header">
        <div class="header-icon">
          <i class="fas fa-terminal"></i>
        </div>
        <div class="header-content">
          <h3 class="form-title">Import from cURL</h3>
          <p class="form-description">
            Paste your cURL command below and we'll automatically parse it into an API node configuration.
          </p>
        </div>
      </div>

      <!-- Form Content -->
      <div class="form-content">
        <!-- cURL Input Group -->
        <div class="input-section">
          <label for="curlCommand" class="input-label">
            <i class="fas fa-code input-label-icon"></i>
            cURL Command
          </label>
          <div class="textarea-wrapper">
            <textarea
              id="curlCommand"
              v-model="curlCommand"
              class="curl-textarea"
              placeholder='curl -X POST https://api.example.com/users -H "Content-Type: application/json" -H "Authorization: Bearer your-token" -d "{\"name\": \"John Doe\", \"email\": \"john@example.com\"}"'
              :rows="8"
            ></textarea>
            <div class="textarea-footer">
              <span class="character-count">
                {{ curlCommand.length }} characters
              </span>
            </div>
          </div>
        </div>

        <!-- Error Display -->
        <div v-if="curlHasError" class="error-section">
          <div class="error-content">
            <i class="fas fa-exclamation-triangle error-icon"></i>
            <div class="error-text">
              <h5 class="error-title">Parsing Error</h5>
              <p class="error-message">{{ errorMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="form-actions">
          <button
            @click="emit('onCancel')"
            class="btn btn-secondary"
            type="button"
          >
            <i class="fas fa-times"></i>
            <span>Cancel</span>
          </button>
          <button
            @click="submitCurlCommand"
            class="btn btn-primary"
            type="button"
            :disabled="!curlCommand.trim()"
          >
            <i class="fas fa-magic"></i>
            <span>Parse cURL</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- API Node Form Section -->
  <ApiNodeForm
    v-if="showApiNodeForm && currentAApiNode"
    :apiNode="currentAApiNode"
    :envVariablesNames="props.envVariablesNames"
    @on-cancel="handleFormCancel"
    @on-save="onSave"
  />
</template>

<script setup lang="ts">
import { parseCurlToApiNode } from "@/utils";
import { computed, ref } from "vue";
import { ApiNode } from "@/apifluxCore/nodes/apiNode";
import ApiNodeForm from "./apiNodeForm.vue";
const props = defineProps<{
  envVariablesNames?: string[];
}>();
const emit = defineEmits<{
  (e: "onSave", updatedNode: ApiNode): void;
  (e: "onCancel"): void;
}>();
const showApiNodeForm = ref(false);
const curlCommand = ref("");
const curlHasError = ref(false);
const errorMessage = ref("");
const apiNode = ref<ApiNode>(new ApiNode(""));

const submitCurlCommand = () => {
  const {
    apiNode: parsedApiNode,
    error,
    success,
  } = parseCurlToApiNode(curlCommand.value);
  if (success) {
    curlHasError.value = false;
    errorMessage.value = "";
    apiNode.value = parsedApiNode || new ApiNode("");
    showApiNodeForm.value = true;
  } else {
    curlHasError.value = true;
    errorMessage.value = error || "Unknown error parsing cURL command";
    apiNode.value = new ApiNode("");
    console.error("Error parsing cURL command:", errorMessage.value);
  }
};

const handleFormCancel = () => {
  showApiNodeForm.value = false;
  curlCommand.value = "";
  curlHasError.value = false;
  errorMessage.value = "";
};

const currentAApiNode = computed(() => apiNode.value as ApiNode);

const onSave = (node: ApiNode) => {
  emit("onSave", node);
};
</script>

<style scoped>
/* cURL Node Form Container */
.curl-node-form {
  margin-bottom: var(--spacing-lg);
  transition: all var(--transition-spring);
  position: relative;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.curl-input-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

/* Form Header */
.form-header {
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-subtle);
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--color-primary-light);
  flex-shrink: 0;
}

.header-icon i {
  color: var(--color-primary);
  font-size: var(--font-size-xl);
}

.header-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-title {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  letter-spacing: var(--letter-spacing-tight);
}

.form-description {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
}

/* Form Content */
.form-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* Input Section */
.input-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.input-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  letter-spacing: var(--letter-spacing-normal);
  margin: 0;
}

.input-label-icon {
  color: var(--color-primary);
  font-size: var(--font-size-xs);
}

/* Textarea Wrapper */
.textarea-wrapper {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  transition: all var(--transition-normal);
  overflow: hidden;
}

.textarea-wrapper:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.textarea-wrapper:hover {
  border-color: var(--color-border-hover);
}

/* cURL Textarea */
.curl-textarea {
  width: 100%;
  min-height: 200px;
  padding: var(--spacing-md);
  border: none;
  background: transparent;
  color: var(--color-text-primary);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  resize: vertical;
  outline: none;
  transition: all var(--transition-normal);
}

.curl-textarea::placeholder {
  color: var(--color-text-tertiary);
  font-style: italic;
}

.textarea-footer {
  display: flex;
  justify-content: flex-end;
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-background-subtle);
  border-top: 1px solid var(--color-border-subtle);
}

.character-count {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  font-family: var(--font-family-mono);
}

/* Error Section */
.error-section {
  padding: var(--spacing-md);
  background: var(--color-danger-light);
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-md);
  animation: shake 0.5s ease-in-out;
}

.error-content {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.error-icon {
  color: var(--color-danger);
  font-size: var(--font-size-lg);
  flex-shrink: 0;
  margin-top: var(--spacing-xs);
}

.error-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.error-title {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-danger);
}

.error-message {
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--color-danger-dark);
  line-height: var(--line-height-normal);
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border-subtle);
}

/* Button Base Styles */
.btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  font-family: var(--font-family-base);
  cursor: pointer;
  transition: all var(--transition-spring);
  outline: none;
  text-decoration: none;
  min-width: 120px;
  justify-content: center;
  letter-spacing: var(--letter-spacing-normal);
}

.btn:focus {
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}


/* Button Variants */
.btn-primary {
  background: var(--color-primary);
  color: white;
  border: 1px solid var(--color-primary);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--color-background);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-background-hover);
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-sm);
}

/* Button Icons */
.btn i {
  font-size: var(--font-size-xs);
}

/* Animations */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Scrollbar Styling */
.curl-textarea::-webkit-scrollbar {
  width: 8px;
}

.curl-textarea::-webkit-scrollbar-track {
  background: var(--color-background-secondary);
  border-radius: var(--radius-xs);
}

.curl-textarea::-webkit-scrollbar-thumb {
  background: var(--color-border-hover);
  border-radius: var(--radius-xs);
}

.curl-textarea::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}

/* Responsive Design */
@media (max-width: 768px) {
  .curl-node-form {
    padding: var(--spacing-lg);
    margin: 0 var(--spacing-md);
  }

  .form-header {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-md);
  }

  .header-icon {
    align-self: center;
  }

  .form-actions {
    flex-direction: column-reverse;
    gap: var(--spacing-sm);
  }

  .btn {
    width: 100%;
  }

  .curl-textarea {
    min-height: 150px;
    font-size: var(--font-size-xs);
  }
}

@media (max-width: 480px) {
  .curl-node-form {
    padding: var(--spacing-md);
  }

  .form-title {
    font-size: var(--font-size-lg);
  }

  .form-description {
    font-size: var(--font-size-xs);
  }

  .curl-textarea {
    min-height: 120px;
  }

  .header-icon {
    width: 40px;
    height: 40px;
  }

  .header-icon i {
    font-size: var(--font-size-lg);
  }
}

/* Focus and Hover States */
.curl-node-form:focus-within {
  border-color: var(--color-primary-light);
}

/* Loading State */
.curl-node-form.loading {
  opacity: 0.7;
  pointer-events: none;
}

.curl-node-form.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
  border-radius: var(--radius-lg);
}
</style>