<template>
  <FormField :id="id" :label="label" :hint="hint" :error="error" :required="required">
    <template #default="{ id: controlId, describedBy }">
      <div class="af-search">
        <Icon name="search" class="af-search__icon" />
        <input
          :id="controlId"
          class="af-input"
          type="search"
          :placeholder="placeholder"
          :value="modelValue"
          :disabled="disabled"
          :required="required"
          :aria-describedby="describedBy"
          @input="onInput"
        />
        <button
          v-if="modelValue"
          type="button"
          class="af-search__clear"
          aria-label="Clear search"
          @click="clear"
        >
          <Icon name="times" />
        </button>
      </div>
    </template>
  </FormField>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
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
  }>(),
  {
    modelValue: '',
    placeholder: 'Search…',
    disabled: false,
    required: false
  }
)

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

const clear = () => emit('update:modelValue', '')

const { modelValue, label, hint, error, placeholder, disabled, required, id } = toRefs(props)
</script>

<style scoped>
.af-search {
  position: relative;
  display: flex;
  align-items: center;
}

.af-input {
  width: 100%;
  padding: 10px 36px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
  color: var(--text-primary);
  font-size: var(--text-md);
}

.af-search__icon {
  position: absolute;
  left: 12px;
  color: var(--text-muted);
}

.af-search__clear {
  position: absolute;
  right: 8px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
}
</style>
