<template>
  <label class="af-checkbox">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="onChange"
    />
    <span class="af-checkbox__control">
      <Icon v-if="modelValue" name="check" size="sm" />
    </span>
    <span class="af-checkbox__label">
      <slot />
    </span>
  </label>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import Icon from '@/components/common/utils/Icon.vue'

const props = withDefaults(
  defineProps<{ modelValue: boolean; disabled?: boolean }>(),
  { modelValue: false, disabled: false }
)

const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

const onChange = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
}

const { modelValue, disabled } = toRefs(props)
</script>

<style scoped>
.af-checkbox {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  color: var(--text-primary);
  font-size: var(--text-sm);
}

.af-checkbox input {
  display: none;
}

.af-checkbox__control {
  width: 18px;
  height: 18px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color var(--transition-default), background var(--transition-default);
}

.af-checkbox input:checked + .af-checkbox__control {
  border-color: var(--accent-blue);
  background: color-mix(in srgb, var(--accent-blue) 30%, transparent);
}
</style>
