<template>
  <FormField :id="id" :label="label" :hint="hint" :error="error" :required="required">
    <template #default="{ id: controlId, describedBy }">
      <div class="af-select">
        <select
          :id="controlId"
          class="af-select__control"
          :value="modelValue"
          :disabled="disabled"
          :required="required"
          :aria-describedby="describedBy"
          @change="onChange"
        >
          <option v-if="placeholder" disabled value="">
            {{ placeholder }}
          </option>
          <option v-for="option in options" :key="String(option.value)" :value="option.value as any">
            {{ option.label }}
          </option>
        </select>
        <Icon name="chevron-down" class="af-select__icon" />
      </div>
    </template>
  </FormField>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import FormField from './FormField.vue'
import Icon from '@/components/common/utils/Icon.vue'

interface Option {
  label: string
  value: string | number | boolean
}

const props = withDefaults(
  defineProps<{
    modelValue: string | number | boolean | null
    options: Option[]
    id?: string
    label?: string
    hint?: string
    error?: string
    placeholder?: string
    disabled?: boolean
    required?: boolean
  }>(),
  {
    modelValue: '',
    placeholder: 'Select option',
    disabled: false,
    required: false
  }
)

const emit = defineEmits<{ (e: 'update:modelValue', value: string | number | boolean | null): void }>()

const onChange = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLSelectElement).value)
}

const { modelValue, options, label, hint, error, placeholder, disabled, required, id } = toRefs(props)
</script>

<style scoped>
.af-select {
  position: relative;
}

.af-select__control {
  width: 100%;
  padding: 10px 36px 10px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
  color: var(--text-primary);
  font-size: var(--text-md);
  appearance: none;
}

.af-select__icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--text-muted);
}
</style>
