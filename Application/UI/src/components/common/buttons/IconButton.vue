<template>
  <button
    class="af-icon-button"
    :class="[`af-icon-button--${variant}`, `af-icon-button--${size}`]"
    :type="type"
    :disabled="disabled"
    :aria-label="label"
  >
    <Icon :name="icon" :tone="iconTone" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type ButtonSize } from '@/components/common/tokens'
import Icon from '@/components/common/utils/Icon.vue'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

type NativeType = 'button' | 'submit' | 'reset'

const props = withDefaults(
  defineProps<{
    icon: string
    label?: string
    variant?: ButtonVariant
    size?: ButtonSize
    disabled?: boolean
    type?: NativeType
  }>(),
  {
    variant: 'secondary',
    size: 'sm',
    disabled: false,
    type: 'button'
  }
)

const iconTone = computed(() => (props.variant === 'primary' ? 'primary' : 'secondary'))
</script>

<style scoped>
.af-icon-button {
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
  transition: border-color var(--transition-default), background var(--transition-default);
}

.af-icon-button:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.af-icon-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.af-icon-button--primary {
  background: var(--accent-blue);
  color: #fff;
}

.af-icon-button--secondary {
  background: var(--bg-elevated);
  border-color: var(--border-default);
}

.af-icon-button--ghost {
  border-color: var(--border-subtle);
  color: var(--text-secondary);
}

.af-icon-button--danger {
  border-color: color-mix(in srgb, var(--error-red) 40%, transparent);
  color: var(--error-red);
}

.af-icon-button--sm {
  width: 32px;
  height: 32px;
}

.af-icon-button--md {
  width: 40px;
  height: 40px;
}
</style>
