<template>
  <div>
    <span class="ui-input-label">{{ props.label || 'Variable' }}</span>
    <div class="form-row">
      <UiInput
        v-if="!localVariable.fromEnv"
        v-model="localVariable.defaultValue"
        :placeholder="`Enter ${props.label || 'variable'}`"
      />
      <select
        v-model="localVariable.envVarName"
        class="env-select"
        v-if="localVariable.fromEnv"
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
      <div class="form-group" style="width: 200px; margin-bottom: 0;">
        <div class="checkbox-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="localVariable.fromEnv"
              class="checkbox-input"
            />
            <span class="checkbox-custom"></span>
            <span
              class="checkbox-text"
              v-tooltip="
                'When enabled, the variable value will be read from environment variables'
              "
            >
              <i class="fas fa-server"></i>
              From Env
            </span>
          </label>
          <i class="fa fa-trash remove-variable" v-if="canRemove" @click="removeVariable"></i>
        </div>
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
.ui-input-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
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

.env-select {
  flex-grow: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  transition: border-color var(--transition-fast);
}
.remove-variable {
  color: rgb(183, 0, 0);
  cursor: pointer;
  transition: color var(--transition-fast);
}
</style>