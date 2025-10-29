<template>
  <div class="variable-form">
    <!-- Variable Form Content -->
    <div class="variable-content">
      <!-- Delete Button Row -->
      <div v-if="canRemove" class="delete-row">
        <button 
          @click="removeVariable"
          class="remove-button"
          v-tooltip="'Remove this variable'"
        >
          <i class="fas fa-trash"></i>
          <span>Remove Variable</span>
        </button>
      </div>
      <!-- Name and Environment Toggle Row -->
      <div class="name-env-row">
        <div class="name-input-container">
          <UiInput
            v-model="localVariable.name"
            label="Variable Name"
            placeholder="Enter variable name..."
            required
            :error="errors.name"
            :error-message="errors.name"
            left-icon="tag"
            @blur="validateName"
            class="name-input"
          />
        </div>
        
        <div class="env-toggle-container">
          <label class="env-toggle">
            <input
              type="checkbox"
              v-model="localVariable.fromEnv"
              class="toggle-input"
              @change="onEnvToggle"
            />
            <span class="toggle-slider"></span>
            <span class="toggle-label">
              <i class="fas fa-server toggle-icon"></i>
              <span class="toggle-text">From Environment</span>
            </span>
          </label>
        </div>
      </div>

      <!-- Description and Type Row -->
      <div v-if="showDescription && showType" class="description-type-row">
        <div class="description-container">
          <UiInput
            v-model="localVariable.description"
            label="Description"
            placeholder="Describe the variable purpose..."
            left-icon="info-circle"
            class="description-input"
          />
        </div>
        
        <div class="type-selector-container">
          <label class="type-label">Variable Type</label>
          <div class="type-select-wrapper">
            <select
              v-model="localVariable.type"
              class="type-select"
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
            <i class="fas fa-chevron-down select-arrow"></i>
          </div>
        </div>
      </div>

      <!-- Environment Variable Selection -->
      <div v-if="localVariable.fromEnv" class="env-var-section">
        <label class="env-var-label">Environment Variable</label>
        <div class="env-select-wrapper">
          <select
            v-model="localVariable.envVarName"
            class="env-select"
            :class="{ error: errors.envVarName }"
          >
            <option value="">Select environment variable</option>
            <option
              v-for="envVar in props.envVariablesNames"
              :key="envVar"
              :value="envVar"
            >
              {{ envVar }}
            </option>
          </select>
          <i class="fas fa-chevron-down select-arrow"></i>
        </div>
        <p v-if="errors.envVarName" class="error-message">
          {{ errors.envVarName }}
        </p>
      </div>

      <!-- Default Value Section -->
      <div v-else class="default-value-section">
        <!-- String/Number Input -->
        <UiInput
          v-if="localVariable.type === 'string' || localVariable.type === 'number'"
          v-model="localVariable.defaultValue"
          :type="localVariable.type === 'number' ? 'number' : 'text'"
          :placeholder="getPlaceholderForType(localVariable.type)"
          :error="errors.defaultValue"
          :error-message="errors.defaultValue"
          left-icon="edit"
          label="Default Value"
          class="default-input"
        />

        <!-- Boolean Toggle -->
        <div v-else-if="localVariable.type === 'boolean'" class="boolean-section">
          <label class="boolean-label">Default Value</label>
          <div class="boolean-toggle-wrapper">
            <label class="boolean-toggle">
              <input
                type="checkbox"
                v-model="booleanValue"
                class="boolean-input"
                @change="onBooleanChange"
              />
              <span class="boolean-slider"></span>
              <span class="boolean-text">
                {{ booleanValue ? 'True' : 'False' }}
              </span>
            </label>
          </div>
        </div>

        <!-- JSON Editor for Object/Array -->
        <div v-else-if="localVariable.type === 'object' || localVariable.type === 'array'" class="json-section">
          <UiJsonEditor
            v-model="localVariable.defaultValue"
            label="Default Value"
            :placeholder="getPlaceholderForType(localVariable.type)"
            :height="200"
            :error="errors.defaultValue"
            show-format-button
            show-copy-button
            @validation="onJsonValidation"
            class="json-editor"
          />
        </div>
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
/* Variable Form Container */
.variable-form {
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  border: 1px solid var(--glass-border);
  transition: all var(--transition-spring);
  position: relative;
  border-radius: var(--radius-md);
}

/* Delete Row */
.delete-row {
  position: absolute;
  top: 4px;
  right: 4px;
}

.remove-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border: none;
  border-radius: var(--radius-sm);
  background: var(--color-danger-light);
  color: var(--color-danger);
  cursor: pointer;
  transition: all var(--transition-spring);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.remove-button:hover {
  background: var(--color-danger);
  color: white;
  transform: scale(1.02);
}

/* Variable Content */
.variable-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* Name and Environment Row */
.name-env-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--spacing-lg);
  align-items: end;
}

.name-input-container {
  min-width: 0;
}

.name-input {
  width: 100%;
}

.env-toggle-container {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

/* Environment Toggle */
.env-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  user-select: none;
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-normal);
}

.env-toggle:hover {
  background: var(--color-background-hover);
}

.toggle-input {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 44px;
  height: 24px;
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  transition: all var(--transition-spring);
  display: flex;
  align-items: center;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  left: 2px;
  width: 18px;
  height: 18px;
  background: var(--color-background);
  border-radius: var(--radius-full);
  transition: all var(--transition-spring);
  box-shadow: var(--shadow-sm);
}

.toggle-input:checked + .toggle-slider {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.toggle-input:checked + .toggle-slider::before {
  transform: translateX(20px);
  background: white;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  transition: color var(--transition-normal);
}

.env-toggle:hover .toggle-label {
  color: var(--color-text-primary);
}

.toggle-icon {
  color: var(--color-primary);
  font-size: var(--font-size-xs);
}

.toggle-text {
  letter-spacing: var(--letter-spacing-normal);
}

.toggle-input:checked ~ .toggle-label {
  color: var(--color-primary);
}

/* Description and Type Row */
.description-type-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-lg);
  align-items: end;
}

.description-container {
  min-width: 0;
}

.description-input {
  width: 100%;
}

.type-selector-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.type-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  letter-spacing: var(--letter-spacing-normal);
}

.type-select-wrapper {
  position: relative;
}

.type-select {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-xl) var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-normal);
  transition: all var(--transition-normal);
  appearance: none;
  cursor: pointer;
}

.type-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.type-select:hover {
  border-color: var(--color-border-hover);
}

.type-select:disabled {
  background: var(--color-background-disabled);
  cursor: not-allowed;
  opacity: 0.6;
}

.type-select.error {
  border-color: var(--color-danger);
}

.select-arrow {
  position: absolute;
  right: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
  pointer-events: none;
  transition: color var(--transition-normal);
}

.type-select:focus + .select-arrow {
  color: var(--color-primary);
}

/* Environment Variable Section */
.env-var-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-background-subtle);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
}

.env-var-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  letter-spacing: var(--letter-spacing-normal);
}

.env-select-wrapper {
  position: relative;
}

.env-select {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-xl) var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-family: var(--font-family-base);
  transition: all var(--transition-normal);
  appearance: none;
  cursor: pointer;
}

.env-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.env-select:hover {
  border-color: var(--color-border-hover);
}

.env-select.error {
  border-color: var(--color-danger);
}

.error-message {
  font-size: var(--font-size-xs);
  color: var(--color-danger);
  margin: 0;
  line-height: var(--line-height-normal);
}

/* Default Value Section */
.default-value-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.default-input {
  width: 100%;
}

/* Boolean Section */
.boolean-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.boolean-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  letter-spacing: var(--letter-spacing-normal);
}

.boolean-toggle-wrapper {
  display: flex;
  align-items: center;
}

.boolean-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  cursor: pointer;
  user-select: none;
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  transition: all var(--transition-spring);
}

.boolean-toggle:hover {
  border-color: var(--color-border-hover);
  background: var(--color-background-hover);
}

.boolean-input {
  display: none;
}

.boolean-slider {
  position: relative;
  width: 52px;
  height: 28px;
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  transition: all var(--transition-spring);
  display: flex;
  align-items: center;
}

.boolean-slider::before {
  content: '';
  position: absolute;
  left: 3px;
  width: 20px;
  height: 20px;
  background: var(--color-background);
  border-radius: var(--radius-full);
  transition: all var(--transition-spring);
  box-shadow: var(--shadow-sm);
}

.boolean-input:checked + .boolean-slider {
  background: var(--color-success);
  border-color: var(--color-success);
}

.boolean-input:checked + .boolean-slider::before {
  transform: translateX(24px);
  background: white;
}

.boolean-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  min-width: 40px;
  letter-spacing: var(--letter-spacing-normal);
}

/* JSON Section */
.json-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.json-editor {
  width: 100%;
}

/* Responsive Design */
@media (max-width: 768px) {
  .variable-form {
    padding: var(--spacing-md);
  }
  
  .name-env-row {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .description-type-row {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .env-toggle-container {
    justify-self: start;
  }
}

@media (max-width: 480px) {
  .variable-form {
    padding: var(--spacing-sm);
  }
}

/* Focus States */
.variable-form:focus-within {
  border-color: var(--color-primary-light);
  box-shadow: 0 0 0 1px var(--color-primary-light);
}

/* Animation States */
.boolean-toggle:active .boolean-slider {
  transform: scale(0.98);
}

.env-toggle:active .toggle-slider {
  transform: scale(0.98);
}

/* Loading State */
.variable-form.loading {
  opacity: 0.7;
  pointer-events: none;
}

.variable-form.loading::after {
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