<template>
  <div class="ui-dropdown" :class="{ disabled, error: !!error }">
    <!-- Label -->
    <label v-if="label" class="dropdown-label" :for="inputId">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>

    <!-- Dropdown Container -->
    <div class="dropdown-container">
      <!-- Left Icon -->
      <i v-if="leftIcon" :class="`fas fa-${leftIcon}`" class="dropdown-icon left-icon"></i>

      <!-- Select Element -->
      <select
        :id="inputId"
        :value="modelValue"
        @change="handleChange"
        :disabled="disabled"
        :required="required"
        class="dropdown-select"
        :class="{
          'has-left-icon': leftIcon,
          'has-right-icon': rightIcon,
          error: !!error
        }"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="getOptionValue(option)"
          :value="getOptionValue(option)"
          :disabled="getOptionDisabled(option)"
        >
          {{ getOptionLabel(option) }}
        </option>
      </select>

      <!-- Right Icon -->
      <i v-if="rightIcon" :class="`fas fa-${rightIcon}`" class="dropdown-icon right-icon"></i>

      <!-- Chevron Icon -->
      <i class="fas fa-chevron-down dropdown-chevron" v-if="!rightIcon"></i>
    </div>

    <!-- Helper Text -->
    <p v-if="helperText && !error" class="helper-text">{{ helperText }}</p>

    <!-- Error Message -->
    <p v-if="error" class="error-text">{{ errorMessage || error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

// Types
interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
}

// Props
const props = defineProps<{
  modelValue: string | number | null;
  options: Option[] | string[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string | boolean;
  errorMessage?: string;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
  id?: string;
}>();

// Emits
const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | null): void;
  (e: "change", value: string | number | null): void;
}>();

// Computed
const inputId = computed(() => props.id || `dropdown-${Math.random().toString(36).substr(2, 9)}`);

// Methods
const getOptionValue = (option: Option | string): string | number => {
  return typeof option === "string" ? option : option.value;
};

const getOptionLabel = (option: Option | string): string => {
  return typeof option === "string" ? option : option.label;
};

const getOptionDisabled = (option: Option | string): boolean => {
  return typeof option === "string" ? false : option.disabled || false;
};

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const value = target.value === "" ? null : target.value;
  
  // Convert to number if the original value was a number
  const convertedValue = typeof props.modelValue === "number" && value !== null 
    ? Number(value) 
    : value;
  
  emit("update:modelValue", convertedValue);
  emit("change", convertedValue);
};
</script>

<style scoped>
.ui-dropdown {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  width: 100%;
}

.dropdown-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  cursor: pointer;
}

.required {
  color: var(--color-error);
  margin-left: var(--spacing-xs);
}

.dropdown-container {
  position: relative;
  display: flex;
  align-items: center;
}

.dropdown-select {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: var(--font-size-xs);
  font-family: inherit;
  line-height: var(--line-height-normal);
  transition: all var(--transition-fast);
  appearance: none;
  cursor: pointer;
}

.dropdown-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.dropdown-select:disabled {
  background: var(--color-gray-100);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.dropdown-select.error {
  border-color: var(--color-error);
}

.dropdown-select.error:focus {
  box-shadow: 0 0 0 3px var(--color-error-light);
}

.dropdown-select.has-left-icon {
  padding-left: 2.5rem;
}

.dropdown-select.has-right-icon {
  padding-right: 2.5rem;
}

.dropdown-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  pointer-events: none;
  z-index: 1;
}

.left-icon {
  left: var(--spacing-md);
}

.right-icon {
  right: var(--spacing-md);
}

.dropdown-chevron {
  position: absolute;
  right: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  pointer-events: none;
  transition: transform var(--transition-fast);
}

.dropdown-select:focus + .dropdown-chevron {
  transform: translateY(-50%) rotate(180deg);
}

.helper-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: var(--line-height-normal);
}

.error-text {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  margin: 0;
  line-height: var(--line-height-normal);
}

/* Disabled State */
.ui-dropdown.disabled .dropdown-label {
  color: var(--color-text-disabled);
}

.ui-dropdown.disabled .dropdown-icon {
  color: var(--color-text-disabled);
}

.ui-dropdown.disabled .dropdown-chevron {
  color: var(--color-text-disabled);
}

/* Error State */
.ui-dropdown.error .dropdown-label {
  color: var(--color-error);
}

/* Responsive Design */
@media (max-width: 768px) {
  .dropdown-select {
    padding: var(--spacing-sm);
    font-size: var(--font-size-sm);
  }
  
  .dropdown-select.has-left-icon {
    padding-left: 2.25rem;
  }
  
  .dropdown-select.has-right-icon {
    padding-right: 2.25rem;
  }
}

/* Dark Theme Support */
[data-theme="dark"] .dropdown-select {
  background: var(--color-gray-700);
  border-color: var(--color-gray-600);
  color: var(--color-text-inverse);
}

[data-theme="dark"] .dropdown-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-dark);
}

[data-theme="dark"] .dropdown-select:disabled {
  background: var(--color-gray-800);
  color: var(--color-gray-500);
}

[data-theme="dark"] .dropdown-label {
  color: var(--color-text-inverse);
}

[data-theme="dark"] .dropdown-icon,
[data-theme="dark"] .dropdown-chevron {
  color: var(--color-gray-400);
}

[data-theme="dark"] .helper-text {
  color: var(--color-gray-400);
}

[data-theme="dark"] .ui-dropdown.disabled .dropdown-label,
[data-theme="dark"] .ui-dropdown.disabled .dropdown-icon,
[data-theme="dark"] .ui-dropdown.disabled .dropdown-chevron {
  color: var(--color-gray-600);
}
</style>
