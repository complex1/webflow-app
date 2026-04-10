<template>
  <button
    class="af-button"
    :class="[
      `af-button--${variant}`,
      `af-button--${size}`,
      { 'is-loading': loading }
    ]"
    :type="type"
    :disabled="isDisabled"
  >
    <Icon v-if="icon && iconPosition === 'left'" :name="icon" class="af-button__icon" />
    <span class="af-button__label">
      <slot />
    </span>
    <Icon v-if="icon && iconPosition === 'right'" :name="icon" class="af-button__icon" />
    <Icon
      v-if="loading"
      name="spinner"
      class="af-button__spinner pi-spin"
      :tone="variant === 'primary' ? 'primary' : 'secondary'"
    />
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
    variant?: ButtonVariant
    size?: ButtonSize
    disabled?: boolean
    loading?: boolean
    icon?: string
    iconPosition?: 'left' | 'right'
    type?: NativeType
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    iconPosition: 'left',
    type: 'button'
  }
)

const isDisabled = computed(() => props.disabled || props.loading)
const variant = computed(() => props.variant)
const size = computed(() => props.size)
const type = computed(() => props.type)
</script>

<style scoped>
.af-button {
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: var(--text-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  cursor: pointer;
  transition: background var(--transition-default), border-color var(--transition-default),
    color var(--transition-default);
  padding: 0 var(--space-4);
  position: relative;
}

.af-button:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.af-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.af-button--primary {
  background: var(--accent-blue);
  color: #fff;
}

.af-button--primary:hover:not(:disabled) {
  opacity: 0.92;
}

.af-button--secondary {
  background: var(--bg-elevated);
  border-color: var(--border-default);
  color: var(--text-primary);
}

.af-button--ghost {
  background: transparent;
  border-color: var(--border-subtle);
  color: var(--text-secondary);
}

.af-button--danger {
  background: color-mix(in srgb, var(--error-red) 18%, transparent);
  border-color: color-mix(in srgb, var(--error-red) 30%, transparent);
  color: var(--error-red);
}

.af-button--sm {
  min-height: 32px;
  padding-inline: var(--space-3);
}

.af-button--md {
  min-height: 40px;
}

.af-button__icon {
  pointer-events: none;
}

.af-button__spinner {
  position: absolute;
  right: var(--space-3);
}

.is-loading .af-button__label {
  opacity: 0.8;
}
</style>
