<template>
  <button
    class="af-switch"
    :class="{ 'is-on': modelValue }"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    @click="toggle"
  >
    <span class="af-switch__track">
      <span class="af-switch__handle" />
    </span>
    <span class="af-switch__label">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

const props = withDefaults(
  defineProps<{ modelValue: boolean; disabled?: boolean }>(),
  { modelValue: false, disabled: false }
)

const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

const toggle = () => {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}

const { modelValue, disabled } = toRefs(props)
</script>

<style scoped>
.af-switch {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--text-secondary);
}

.af-switch:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.af-switch__track {
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 999px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  display: inline-flex;
  align-items: center;
  padding: 2px;
  transition: background var(--transition-default), border-color var(--transition-default);
}

.af-switch__handle {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: var(--border-default);
  transition: transform var(--transition-default), background var(--transition-default);
}

.af-switch__label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.is-on .af-switch__track {
  background: color-mix(in srgb, var(--accent-blue) 25%, transparent);
  border-color: var(--accent-blue);
}

.is-on .af-switch__label {
  color: var(--text-primary);
}

.is-on .af-switch__handle {
  transform: translateX(20px);
  background: var(--accent-blue);
}
</style>
