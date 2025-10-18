<template>
  <div class="widget-meta">
    <div class="form-content">
      <!-- Widget Name -->
      <div class="form-group">
        <UiInput
          v-model="localData.name"
          label="Widget Name"
          placeholder="Enter widget name..."
          required
          :error="errors.name"
          :error-message="errors.name"
          left-icon="tag"
          @blur="validateName"
        />
      </div>

      <!-- Widget Description -->
      <div class="form-group">
        <UiInput
          v-model="localData.description"
          label="Description"
          placeholder="Describe the widget purpose..."
          left-icon="info-circle"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { UiInput } from "@/components/base";

// Props and Emits
const props = defineProps<{
  name: string | null;
  description: string | null;
}>();

const emit = defineEmits<{
  (e: "onUpdate", value: { name: string | null; description: string | null; isValid: boolean }): void;
}>();

// Local state
const localData = ref({
  name: props.name || "",
  description: props.description || "",
});

// Form state
const errors = ref<Record<string, string>>({});

// Methods
const validateName = () => {
  if (!localData.value.name) {
    errors.value.name = "Widget name is required";
    return false;
  } else if (!/^[a-zA-Z_][a-zA-Z0-9_\s-]*$/.test(localData.value.name)) {
    errors.value.name = "Widget name must start with a letter or underscore and contain only letters, numbers, spaces, underscores, or hyphens";
    return false;
  } else {
    delete errors.value.name;
    return true;
  }
};

const isFormValid = () => {
  const nameValid = validateName();
  return nameValid && Object.keys(errors.value).length === 0;
};

// Watch for changes and emit updates
watch(
  localData,
  (newValue) => {
    const isValid = isFormValid();
    emit("onUpdate", {
      name: newValue.name,
      description: newValue.description,
      isValid,
    });
  },
  { deep: true }
);

// Validate on mount
watch(
  () => props.name,
  (newName) => {
    if (newName !== undefined) {
      localData.value.name = newName ?? "";
    }
  }
);

watch(
  () => props.description,
  (newDescription) => {
    if (newDescription !== undefined) {
      localData.value.description = newDescription ?? "";
    }
  }
);
</script>

<style scoped>
.widget-meta {
  padding: var(--spacing-md) 0;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.required {
  color: var(--color-error);
  margin-left: var(--spacing-xs);
}

.error-text {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  margin: var(--spacing-xs) 0 0 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .widget-meta {
    padding: var(--spacing-sm);
  }
}

/* Dark Theme Support */
[data-theme="dark"] .widget-meta {
  background: var(--color-gray-800);
}

[data-theme="dark"] .form-label {
  color: var(--color-text-inverse);
}
</style>
