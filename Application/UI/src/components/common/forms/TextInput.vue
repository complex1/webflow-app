<template>
  <FormField :id="id" :label="label" :hint="hint" :error="error" :required="required">
    <template #default="{ id: controlId, describedBy }">
      <div class="af-input-wrapper">
        <input
          :id="controlId"
          class="af-input"
          :type="type"
          :placeholder="placeholder"
          :value="modelValue"
          :disabled="disabled"
          :required="required"
          :autocomplete="autocomplete"
          :aria-invalid="!!error"
          :aria-describedby="describedBy"
          @input="onInput"
        />
      </div>
    </template>
  </FormField>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import FormField from './FormField.vue'

type InputType =
  | 'text'
  | 'email'
  | 'number'
  | 'url'
  | 'tel'
  | 'search'
  | 'password'

const props = withDefaults(
  defineProps<{
    modelValue: string | null | undefined
    id?: string
    label?: string
    hint?: string
    error?: string
    placeholder?: string
    type?: InputType
    disabled?: boolean
    required?: boolean
    autocomplete?: string
  }>(),
  {
    modelValue: '',
    type: 'text',
    placeholder: '',
    disabled: false,
    required: false,
    autocomplete: 'off'
  }
)

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

const { modelValue, label, hint, error, placeholder, type, disabled, required, autocomplete, id } =
  toRefs(props)
</script>

<style scoped>
.af-input-wrapper {
  position: relative;
  display: flex;
}

.af-input {
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
  color: var(--text-primary);
  font-size: var(--text-md);
  transition: border-color var(--transition-default), background var(--transition-default);
}

.af-input:focus {
  outline: none;
  border-color: var(--accent-blue);
  box-shadow: var(--focus-ring);
}

.af-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
