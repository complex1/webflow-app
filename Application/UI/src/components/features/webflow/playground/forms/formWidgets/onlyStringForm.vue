<template>
  <div class="variable-form">
    <!-- Variable Label -->
    <div class="variable-header">
      <label class="variable-label">
        {{ props.label || 'Variable' }}
      </label>
      
      <!-- Remove Button -->
      <button 
        v-if="canRemove"
        @click="removeVariable"
        class="remove-button"
        v-tooltip="'Remove this variable'"
      >
        <i class="fas fa-trash"></i>
      </button>
    </div>

    <!-- Variable Input Section -->
    <div class="variable-content">
      <!-- Input Field -->
      <div class="input-container">
        <UiInput
          v-if="!localVariable.fromEnv"
          v-model="localVariable.defaultValue"
          :placeholder="`Enter ${props.label || 'variable'}`"
          class="variable-input"
        />
        
        <!-- Environment Variable Selector -->
        <div v-if="localVariable.fromEnv" class="env-select-container">
          <select
            v-model="localVariable.envVarName"
            class="env-select"
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
          <i class="fas fa-chevron-down select-icon"></i>
        </div>
      </div>

      <!-- Environment Variable Toggle -->
      <div class="toggle-container">
        <label class="env-toggle">
          <input
            type="checkbox"
            v-model="localVariable.fromEnv"
            class="toggle-input"
          />
          <span class="toggle-slider"></span>
          <span 
            class="toggle-label"
            v-tooltip="'When enabled, the variable value will be read from environment variables'"
          >
            <i class="fas fa-server toggle-icon"></i>
            <span class="toggle-text">From Env</span>
          </span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Variable from "@/apifluxCore/nodes/variable";
import { UiInput } from "@/components/base";
import { onMounted, ref, watch } from "vue";

// Props and Emits
const props = defineProps<{
  label?: string;
  variable: Variable;
  envVariablesNames?: string[];
  canRemove?: boolean;
}>();

const emit = defineEmits<{
  (e: "onUpdate", value: Variable): void;
  (e: "onRemove"): void;
}>();

const removeVariable = () => {
  emit("onRemove");
};

// Local state
const localVariable = ref({
    defaultValue: "",
    fromEnv: false,
    envVarName: "",
  });

// Watch for changes and emit updates
watch(
  localVariable,
  (newValue) => {
    props.variable.defaultValue = newValue.defaultValue;
    props.variable.fromEnv = newValue.fromEnv;
    props.variable.envVarName = newValue.envVarName || '';
    emit("onUpdate", props.variable);
  },
  { deep: true }
);

watch(
  () => props.variable,
  (newVar) => {
    if (newVar) {
      localVariable.value = {
        defaultValue: newVar.defaultValue,
        fromEnv: newVar.fromEnv,
        envVarName: newVar.envVarName || '',
      };
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.variable) {
    localVariable.value.defaultValue = props.variable.defaultValue;
    localVariable.value.fromEnv = props.variable.fromEnv;
    localVariable.value.envVarName = props.variable.envVarName || '';
  }
});

</script>

<style scoped>
/* Variable Form Container */
.variable-form {
  margin-bottom: var(--spacing-md);
}

/* Header Section */
.variable-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.variable-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  letter-spacing: var(--letter-spacing-normal);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.remove-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--color-danger-light);
  color: var(--color-danger);
  cursor: pointer;
  transition: all var(--transition-spring);
  font-size: var(--font-size-xs);
}

.remove-button:hover {
  background: var(--color-danger);
  color: white;
  transform: scale(1.05);
}

/* Content Section */
.variable-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* Input Container */
.input-container {
  flex: 1;
  min-width: 0;
}

.variable-input {
  width: 100%;
}

/* Environment Variable Selector */
.env-select-container {
  position: relative;
  width: 100%;
}

.env-select {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  padding-right: var(--spacing-xl);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-normal);
  line-height: 1.5;
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

.select-icon {
  position: absolute;
  right: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
  pointer-events: none;
  transition: color var(--transition-normal);
}

.env-select:focus + .select-icon {
  color: var(--color-primary);
}

/* Toggle Container */
.toggle-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

/* Environment Toggle */
.env-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  user-select: none;
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

.toggle-input:checked ~ .toggle-label .toggle-icon {
  color: var(--color-primary);
}

/* Responsive Design */
@media (min-width: 640px) {
  .variable-content {
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-lg);
  }
  
  .input-container {
    flex: 1;
  }
  
  .toggle-container {
    flex-shrink: 0;
    width: auto;
  }
}

/* Animation for state changes */
.input-container {
  transition: all var(--transition-spring);
}

.toggle-slider:hover {
  border-color: var(--color-border-hover);
}

.toggle-input:checked + .toggle-slider:hover {
  background: var(--color-primary-hover);
}
</style>