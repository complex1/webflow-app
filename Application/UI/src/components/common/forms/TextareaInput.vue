<template>
  <FormField :id="id" :label="label" :hint="hint" :error="error" :required="required">
    <template #default="{ id: controlId, describedBy }">
      <textarea
        :id="controlId"
        class="af-textarea"
        :rows="rows"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :aria-invalid="!!error"
        :aria-describedby="describedBy"
        @input="onInput"
      />
    </template>
  </FormField>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import FormField from './FormField.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string | null | undefined
    id?: string
    label?: string
    hint?: string
    error?: string
    placeholder?: string
    rows?: number
    disabled?: boolean
    required?: boolean
  }>(),
  {
    modelValue: '',
    placeholder: '',
    rows: 4,
    disabled: false,
    required: false
  }
)

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}

const { modelValue, label, hint, error, placeholder, rows, disabled, required, id } = toRefs(props)
</script>

<style scoped>
.af-textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
  color: var(--text-primary);
  font-size: var(--text-md);
  resize: vertical;
  transition: border-color var(--transition-default), background var(--transition-default);
}

.af-textarea:focus {
  outline: none;
  border-color: var(--accent-blue);
  box-shadow: var(--focus-ring);
}
</style>
