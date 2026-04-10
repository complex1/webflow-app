<template>
  <FormField :id="id" :label="label" :hint="hint" :error="error" :required="required">
    <template #default="{ id: controlId, describedBy }">
      <div class="af-input-wrapper">
        <input
          :id="controlId"
          class="af-input"
          :type="visible ? 'text' : 'password'"
          :placeholder="placeholder"
          :value="modelValue"
          :disabled="disabled"
          :required="required"
          :autocomplete="autocomplete"
          :aria-invalid="!!error"
          :aria-describedby="describedBy"
          @input="onInput"
        />
        <button
          type="button"
          class="af-input__toggle"
          :aria-label="visible ? 'Hide password' : 'Show password'"
          @click="visible = !visible"
        >
          <Icon :name="visible ? 'eye-slash' : 'eye'" />
        </button>
      </div>
    </template>
  </FormField>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import FormField from './FormField.vue'
import Icon from '@/components/common/utils/Icon.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string | null | undefined
    id?: string
    label?: string
    hint?: string
    error?: string
    placeholder?: string
    disabled?: boolean
    required?: boolean
    autocomplete?: string
  }>(),
  {
    modelValue: '',
    placeholder: '',
    disabled: false,
    required: false,
    autocomplete: 'off'
  }
)

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const visible = ref(false)

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

const { modelValue, label, hint, error, placeholder, disabled, required, autocomplete, id } =
  toRefs(props)
</script>

<style scoped>
.af-input-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.af-input {
  width: 100%;
  padding: 10px 40px 10px 12px;
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

.af-input__toggle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
}

.af-input__toggle:focus-visible {
  outline: none;
  color: var(--accent-blue);
}
</style>
