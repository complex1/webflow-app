<template>
  <div class="variable-form">
    <div class="form-content">
      <!-- Variable Name -->
      <div class="form-group">
        <UiInput
          v-model="localVariable.name"
          label="Variable Name"
          placeholder="Enter variable name..."
          required
          :error="errors.name"
          :error-message="errors.name"
          left-icon="tag"
          @blur="validateName"
        />
        <div class="form-group" style="width: 200px">
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="localVariable.fromEnv"
                class="checkbox-input"
                @change="onEnvToggle"
              />
              <span class="checkbox-custom"></span>
              <span class="checkbox-text">
                <i class="fas fa-server"></i>
                From Env
              </span>
            </label>
            <i
              class="fa fa-trash remove-variable"
              v-if="canRemove"
              @click="removeVariable"
            ></i>
          </div>
        </div>
      </div>

      <!-- Variable Description -->
      <div class="form-group" v-if="showDescription && showType">
        <UiInput
          v-model="localVariable.description"
          label="Description"
          placeholder="Describe the variable purpose..."
          left-icon="info-circle"
        />
        <div>
          <span class="form-label">Type</span>
          <select
            v-model="localVariable.type"
            class="env-select"
            style="width: 140px"
            :class="{ error: errors.type }"
            :disabled="localVariable.fromEnv || !!props.defaultType"
          >
            <option
              v-for="type in variableTypes"
              :key="type.value"
              :value="type.value"
            >
              {{ type.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Environment Variable Toggle -->

      <!-- Environment Variable Name (shown when fromEnv is true) -->
      <div v-if="localVariable.fromEnv">
        <label class="form-label">Environment Variable Name</label>
        <div class="env-var-input">
          <select
            v-model="localVariable.envVarName"
            class="env-select"
            :class="{ error: errors.envVarName }"
          >
            <option value="">Select an environment variable</option>
            <option
              v-for="envVar in props.envVariablesNames"
              :key="envVar"
              :value="envVar"
            >
              {{ envVar }}
            </option>
          </select>
        </div>
        <p v-if="errors.envVarName" class="error-text">
          {{ errors.envVarName }}
        </p>
      </div>

      <!-- Default Value (shown when fromEnv is false or as fallback) -->
      <div class="form-group" v-else>
        <!-- String/Number Input -->
        <UiInput
          v-if="
            localVariable.type === 'string' || localVariable.type === 'number'
          "
          v-model="localVariable.defaultValue"
          :type="localVariable.type === 'number' ? 'number' : 'text'"
          :placeholder="getPlaceholderForType(localVariable.type)"
          :error="errors.defaultValue"
          :error-message="errors.defaultValue"
          left-icon="edit"
          :label="'Default Value'"
        />

        <!-- Boolean Toggle -->
        <div
          v-else-if="localVariable.type === 'boolean'"
          class="boolean-toggle"
        >
          <label class="toggle-label">
            <input
              type="checkbox"
              v-model="booleanValue"
              class="toggle-input"
              @change="onBooleanChange"
            />
            <span class="toggle-slider"></span>
            <span class="toggle-text">Default Value</span>
          </label>
        </div>

        <!-- JSON Editor for Object/Array -->
        <UiJsonEditor
          v-else-if="
            localVariable.type === 'object' || localVariable.type === 'array'
          "
          v-model="localVariable.defaultValue"
          :label="'Default Value'"
          :placeholder="getPlaceholderForType(localVariable.type)"
          :height="200"
          :error="errors.defaultValue"
          show-format-button
          show-copy-button
          @validation="onJsonValidation"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Variable from "@/apifluxCore/nodes/variable";
import { ref, watch, onMounted } from "vue";
import { UiInput, UiJsonEditor } from "@/components/base";

// Props and Emits
const props = defineProps<{
  variable: Variable;
  envVariablesNames?: string[];
  defaultType?: "string" | "number" | "boolean" | "object" | "array";
  canRemove?: boolean;
  showDescription?: boolean;
  showType?: boolean;
}>();

const emit = defineEmits<{
  (e: "onUpdate", value: Variable): void;
  (e: "onRemove"): void;
}>();

// Local state
const localVariable = ref({
  name: props.variable?.name || "",
  description: props.variable?.description || "",
  defaultValue: props.variable?.defaultValue || "",
  type: props.variable?.type || props.defaultType || "string",
  fromEnv: props.variable?.fromEnv || false,
  envVarName: props.variable?.envVarName || "",
});

// Form state
const isSubmitting = ref(false);
const errors = ref<Record<string, string>>({});

// Variable type options
const variableTypes = [
  { value: "string", label: "String", icon: "fas fa-quote-right" },
  { value: "number", label: "Number", icon: "fas fa-hashtag" },
  { value: "boolean", label: "Boolean", icon: "fas fa-toggle-on" },
  { value: "object", label: "Object", icon: "fas fa-code" },
  { value: "array", label: "Array", icon: "fas fa-list" },
];

// Type-specific reactive values
const booleanValue = ref<boolean>(
  typeof localVariable.value.defaultValue === "boolean"
    ? localVariable.value.defaultValue
    : false
);

// Methods

const removeVariable = () => {
  emit("onRemove");
};

const validateName = () => {
  if (!localVariable.value.name) {
    errors.value.name = "Variable name is required";
  } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(localVariable.value.name)) {
    errors.value.name = "Variable name must be a valid identifier";
  } else {
    delete errors.value.name;
  }
};

const getPlaceholderForType = (type: string): string => {
  switch (type) {
    case "string":
      return "Enter string value...";
    case "number":
      return "Enter number value...";
    case "boolean":
      return "true or false";
    case "object":
      return '{"key": "value"}';
    case "array":
      return '["item1", "item2"]';
    default:
      return "Enter value...";
  }
};

const onEnvToggle = () => {
  if (!localVariable.value.fromEnv) {
    localVariable.value.envVarName = "";
    delete errors.value.envVarName;
  } else {
    localVariable.value.type = "string";
  }
};

const onBooleanChange = () => {
  localVariable.value.defaultValue = booleanValue.value;
};

const onJsonValidation = (isValid: boolean, error?: string) => {
  if (isValid) {
    delete errors.value.defaultValue;
  } else if (error) {
    errors.value.defaultValue = `Invalid JSON: ${error}`;
  }
};

// Watch for type changes to update default values
watch(
  () => localVariable.value.type,
  (newType) => {
    switch (newType) {
      case "string":
        localVariable.value.defaultValue = "";
        break;
      case "number":
        localVariable.value.defaultValue = 0;
        break;
      case "boolean":
        localVariable.value.defaultValue = false;
        booleanValue.value = false;
        break;
      case "object":
        localVariable.value.defaultValue = {};
        break;
      case "array":
        localVariable.value.defaultValue = [];
        break;
    }
  }
);

// Watch for boolean value changes
watch(booleanValue, (newValue) => {
  if (localVariable.value.type === "boolean") {
    localVariable.value.defaultValue = newValue;
  }
});

// Watch for changes and emit updates
watch(
  localVariable,
  (newValue) => {
    props.variable.name = newValue.name;
    props.variable.description = newValue.description;
    props.variable.defaultValue = newValue.defaultValue;
    props.variable.type = newValue.type;
    props.variable.fromEnv = newValue.fromEnv;
    props.variable.envVarName = newValue.envVarName || "";
    emit("onUpdate", props.variable);
  },
  { deep: true }
);

watch(
  () => props.variable,
  (newVar) => {
    if (newVar) {
      localVariable.value.name = newVar.name;
      localVariable.value.description = newVar.description;
      localVariable.value.defaultValue = newVar.defaultValue;
      localVariable.value.type = newVar.type;
      localVariable.value.fromEnv = newVar.fromEnv;
      localVariable.value.envVarName = newVar.envVarName || "";
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.variable) {
    localVariable.value.name = props.variable.name;
    localVariable.value.description = props.variable.description;
    localVariable.value.defaultValue = props.variable.defaultValue;
    localVariable.value.type = props.variable.type;
    localVariable.value.fromEnv = props.variable.fromEnv;
    localVariable.value.envVarName = props.variable.envVarName || "";
  }
});
</script>

<style scoped>
.form-group {
  display: flex;
  gap: var(--spacing-sm);
  align-items: end;
  margin-bottom: var(--spacing-sm);
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

.helper-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin: var(--spacing-xs) 0 0 0;
  line-height: var(--line-height-normal);
}

.error-text {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  margin: var(--spacing-xs) 0 0 0;
}

/* Checkbox Group */
.checkbox-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  position: relative;
}

.checkbox-input:checked + .checkbox-custom {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.checkbox-input:checked + .checkbox-custom::after {
  content: "✓";
  color: white;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
}

.checkbox-text {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.checkbox-text i {
  color: var(--color-primary);
}

/* Environment Variable Input */
.env-var-input {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.env-select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  transition: border-color var(--transition-fast);
}

.env-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.env-select.error {
  border-color: var(--color-error);
}

.env-select:disabled {
  background: var(--color-gray-100);
  cursor: not-allowed;
}

/* Boolean Toggle */
.boolean-toggle {
  display: flex;
  align-items: center;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
}

.toggle-input {
  display: none;
}

.toggle-slider {
  width: 50px;
  height: 26px;
  background: var(--color-gray-300);
  border-radius: var(--radius-full);
  position: relative;
  transition: background var(--transition-fast);
}

.toggle-slider::before {
  content: "";
  position: absolute;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  top: 3px;
  left: 3px;
  transition: transform var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.toggle-input:checked + .toggle-slider {
  background: var(--color-primary);
}

.toggle-input:checked + .toggle-slider::before {
  transform: translateX(24px);
}

.toggle-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-group {
    flex-direction: column;
    align-items: stretch;
  }
}

/* Dark Theme Support */
[data-theme="dark"] .form-container {
  background: var(--color-gray-800);
  border-color: var(--color-gray-700);
}

[data-theme="dark"] .form-title {
  color: var(--color-text-inverse);
}

[data-theme="dark"] .type-option {
  background: var(--color-gray-700);
  border-color: var(--color-gray-600);
  color: var(--color-gray-300);
}

[data-theme="dark"] .type-option:hover {
  background: var(--color-gray-600);
}

[data-theme="dark"] .env-select,
[data-theme="dark"] .json-textarea {
  background: var(--color-gray-700);
  border-color: var(--color-gray-600);
  color: var(--color-text-inverse);
}

[data-theme="dark"] .variable-preview {
  background: var(--color-gray-700);
  border-color: var(--color-gray-600);
}

[data-theme="dark"] .add-item-btn {
  background: var(--color-gray-700);
  border-color: var(--color-gray-600);
}

.remove-variable {
  color: rgb(183, 0, 0);
  cursor: pointer;
  transition: color var(--transition-fast);
}
</style>