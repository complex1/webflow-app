<template>
  <div class="af-form-field" :class="{ 'has-error': !!error }">
    <Label v-if="label" class="af-form-field__label" :for-id="fieldId">
      {{ label }}
      <span v-if="required" aria-hidden="true">*</span>
    </Label>

    <div class="af-form-field__control">
      <slot :id="fieldId" :described-by="describedBy" />
    </div>

    <ErrorText v-if="error" :id="`${fieldId}-error`">{{ error }}</ErrorText>
    <HelperText v-else-if="hint" :id="`${fieldId}-hint`">{{ hint }}</HelperText>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Label } from '@/components/common/typography'
import HelperText from './HelperText.vue'
import ErrorText from './ErrorText.vue'

const props = defineProps<{
  id?: string
  label?: string
  hint?: string
  error?: string
  required?: boolean
}>()

const localId = `af-field-${Math.random().toString(36).substr(2, 9)}`

const fieldId = computed(() => props.id ?? localId)

const label = computed(() => props.label)
const error = computed(() => props.error)
const hint = computed(() => props.hint)
const required = computed(() => props.required)

const describedBy = computed(() => {
  const ids: string[] = []
  if (props.hint) ids.push(`${fieldId.value}-hint`)
  if (props.error) ids.push(`${fieldId.value}-error`)
  return ids.join(' ') || undefined
})
</script>

<style scoped>
.af-form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.af-form-field__label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}

.af-form-field__label span {
  color: var(--error-red);
}

.af-form-field__control {
  display: flex;
  flex-direction: column;
}

.has-error .af-form-field__control input,
.has-error .af-form-field__control textarea,
.has-error .af-form-field__control select {
  border-color: var(--error-red);
}
</style>
