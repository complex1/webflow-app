<template>
  <div class="curl-node-form" v-if="!showApiNodeForm">
    <!-- cURL Input Section -->
    <div class="curl-input-section">
      <div class="form-header">
        <h3 class="form-title">
          <i class="fas fa-terminal form-icon"></i>
          Import from cURL
        </h3>
        <p class="form-description">
          Paste your cURL command below and we'll automatically parse it into an
          API node configuration.
        </p>
      </div>

      <div class="form-content">
        <div class="input-group">
          <label for="curlCommand" class="input-label"> cURL Command </label>
          <textarea
            id="curlCommand"
            v-model="curlCommand"
            class="curl-textarea"
            placeholder='curl -X POST https://api.example.com/users -H &apos;Content-Type: application/json&apos; -H &apos;Authorization: Bearer your-token&apos; -d &apos;{"name": "John Doe", "email": "john@example.com"}&apos;'
            :rows="8"
          ></textarea>
        </div>

        <!-- Error Display -->
        <div v-if="curlHasError" class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Action Buttons -->
        <div class="form-actions">
          <button
            @click="emit('onCancel')"
            class="btn btn-secondary"
            type="button"
          >
            <i class="fas fa-times"></i>
            Cancel
          </button>
          <button
            @click="submitCurlCommand"
            class="btn btn-primary"
            type="button"
            :disabled="!curlCommand.trim()"
          >
            <i class="fas fa-magic"></i>
            Parse cURL
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
/* cURL Node Form Styles using Design System */

.curl-node-form {
  background: var(--color-background-elevated);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg);
  backdrop-filter: var(--blur-md);
  overflow: hidden;
}

.curl-input-section {
  padding: var(--spacing-xl);
}

/* Form Header */
.form-header {
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.form-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.form-icon {
  color: var(--color-primary);
  font-size: var(--font-size-lg);
}

.form-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

/* Form Content */
.form-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* Input Group */
.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.input-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin: 0;
}

/* cURL Textarea */
.curl-textarea {
  width: 100%;
  min-height: 180px;
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-background-primary);
  color: var(--color-text-primary);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  resize: vertical;
  transition: all var(--transition-fast);
}

.curl-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
  background-color: var(--color-background-secondary);
}

.curl-textarea::placeholder {
  color: var(--color-text-tertiary);
  font-style: italic;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background-color: var(--color-error-light);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-md);
  color: var(--color-error);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.error-message i {
  color: var(--color-error);
  font-size: var(--font-size-sm);
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

/* Button Styles */
.btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
  text-decoration: none;
  min-width: 120px;
  justify-content: center;
}

.btn:focus {
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Button Variants */
.btn-primary {
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-primary-hover)
  );
  color: var(--color-text-inverse);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(
    135deg,
    var(--color-primary-hover),
    var(--color-primary)
  );
  /* transform: translateY(-1px); */
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background-color: var(--color-background-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--color-background-hover);
  border-color: var(--color-border-hover);
  /* transform: translateY(-1px); */
  box-shadow: var(--shadow-sm);
}

/* Icon styles in buttons */
.btn i {
  font-size: var(--font-size-xs);
}

/* Responsive Design */
@media (max-width: 768px) {
  .curl-input-section {
    padding: var(--spacing-lg);
  }

  .form-actions {
    flex-direction: column-reverse;
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
  .form-title {
    font-size: var(--font-size-lg);
  }

  .form-description {
    font-size: var(--font-size-xs);
  }

  .curl-textarea {
    min-height: 120px;
  }
}

/* Dark theme enhancements */
.curl-textarea {
  /* Add subtle inner shadow for depth */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
}

.curl-textarea:focus {
  /* Enhanced glow effect for focus state */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2),
    0 0 0 3px var(--color-primary-light);
}

/* Scrollbar styling for webkit browsers */
.curl-textarea::-webkit-scrollbar {
  width: 8px;
}

.curl-textarea::-webkit-scrollbar-track {
  background: var(--color-background-tertiary);
  border-radius: var(--radius-sm);
}

.curl-textarea::-webkit-scrollbar-thumb {
  background: var(--color-border-hover);
  border-radius: var(--radius-sm);
}

.curl-textarea::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}
</style>