<template>
  <div class="ui-input-wrapper" :class="wrapperClasses">
    <label v-if="label" :for="inputId" class="ui-input-label">
      {{ label }}
      <span v-if="required" class="text-error ml-1">*</span>
    </label>
    
    <div class="ui-input-container" :class="containerClasses">
      <i v-if="leftIcon" :class="leftIconClass" class="ui-input-icon ui-input-icon-left"></i>
      
      <input
        :id="inputId"
        ref="inputRef"
        v-model="inputValue"
        :type="inputType"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :min="min"
        :max="max"
        :step="step"
        :minlength="minlength"
        :maxlength="maxlength"
        :pattern="pattern"
        :autocomplete="autocomplete"
        :autofocus="autofocus"
        class="ui-input"
        :class="inputClasses"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
        @change="handleChange"
        v-bind="$attrs"
      />
      
      <i v-if="rightIcon" :class="rightIconClass" class="ui-input-icon ui-input-icon-right"></i>
      
      <button
        v-if="type === 'password'"
        type="button"
        class="ui-input-password-toggle"
        @click="togglePasswordVisibility"
      >
        <i :class="passwordIconClass"></i>
      </button>
    </div>
    
    <div v-if="hint" class="ui-input-hint">{{ hint }}</div>
    
    <div v-if="error" class="ui-input-error">
      <i class="fas fa-exclamation-circle mr-1"></i>
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'textarea'
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outlined'
  leftIcon?: string
  rightIcon?: string
  min?: number
  max?: number
  step?: number
  minlength?: number
  maxlength?: number
  pattern?: string
  autocomplete?: string
  autofocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  variant: 'default',
  disabled: false,
  readonly: false,
  required: false,
  autofocus: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  input: [event: Event]
  change: [event: Event]
}>()

const inputRef = ref<HTMLInputElement>()
const showPassword = ref(false)
const isFocused = ref(false)

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const inputValue = computed({
  get: () => props.modelValue || '',
  set: (value) => emit('update:modelValue', value)
})

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const wrapperClasses = computed(() => [
  'ui-input-wrapper',
  {
    'ui-input-wrapper--error': props.error,
    'ui-input-wrapper--disabled': props.disabled,
    'ui-input-wrapper--focused': isFocused.value
  }
])

const containerClasses = computed(() => [
  'ui-input-container',
  `ui-input-container--${props.variant}`,
  `ui-input-container--${props.size}`,
  {
    'ui-input-container--error': props.error,
    'ui-input-container--disabled': props.disabled,
    'ui-input-container--focused': isFocused.value,
    'ui-input-container--with-left-icon': props.leftIcon,
    'ui-input-container--with-right-icon': props.rightIcon || props.type === 'password'
  }
])

const inputClasses = computed(() => [
  'ui-input',
  `ui-input--${props.size}`,
  {
    'ui-input--error': props.error,
    'ui-input--disabled': props.disabled,
    'ui-input--with-left-icon': props.leftIcon,
    'ui-input--with-right-icon': props.rightIcon || props.type === 'password'
  }
])

const leftIconClass = computed(() => props.leftIcon ? `fas fa-${props.leftIcon}` : '')
const rightIconClass = computed(() => props.rightIcon ? `fas fa-${props.rightIcon}` : '')
const passwordIconClass = computed(() => showPassword.value ? 'fas fa-eye-slash' : 'fas fa-eye')

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const handleInput = (event: Event) => {
  emit('input', event)
}

const handleChange = (event: Event) => {
  emit('change', event)
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
  nextTick(() => {
    inputRef.value?.focus()
  })
}

// Expose methods for parent components
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  select: () => inputRef.value?.select()
})
</script>

<style scoped>
/* Input wrapper */
.ui-input-wrapper {
  width: 100%;
}

.ui-input-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Input container */
.ui-input-container {
  position: relative;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.ui-input-container--default {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-background-elevated);
  backdrop-filter: var(--blur-sm);
}

.ui-input-container--filled {
  background: var(--color-background-subtle);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  backdrop-filter: var(--blur-md);
}

.ui-input-container--outlined {
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: transparent;
  backdrop-filter: var(--blur-sm);
}

/* Size variants */
.ui-input-container--sm {
  font-size: var(--font-size-sm);
}

.ui-input-container--md {
  font-size: var(--font-size-base);
}

.ui-input-container--lg {
  font-size: var(--font-size-lg);
}

/* State variants */
.ui-input-container--error {
  border-color: var(--color-error);
}

.ui-input-container--focused {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.ui-input-container--disabled {
  background: var(--color-background-secondary);
  color: var(--color-text-secondary);
  cursor: not-allowed;
}

/* Icon spacing */
.ui-input-container--with-left-icon .ui-input {
  padding-left: var(--spacing-2xl);
}

.ui-input-container--with-right-icon .ui-input {
  padding-right: var(--spacing-2xl);
}

/* Input field */
.ui-input {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  color: var(--color-text-primary);
}

.ui-input::placeholder {
  color: var(--color-text-secondary);
}

/* Input sizes */
.ui-input--sm {
  padding: var(--spacing-sm) var(--spacing-md);
}

.ui-input--md {
  padding: var(--spacing-sm) var(--spacing-md);
}

.ui-input--lg {
  padding: var(--spacing-md) var(--spacing-md);
}

.ui-input--error {
  color: var(--color-error);
}

.ui-input--disabled {
  cursor: not-allowed;
}

/* Icons */
.ui-input-icon {
  position: absolute;
  color: var(--color-gray-400);
  pointer-events: none;
}

.ui-input-icon-left {
  left: var(--spacing-md);
}

.ui-input-icon-right {
  right: var(--spacing-md);
}

.ui-input-password-toggle {
  position: absolute;
  right: var(--spacing-md);
  color: var(--color-gray-400);
  cursor: pointer;
  transition: color var(--transition-fast);
  border: none;
  background: transparent;
  outline: none;
  box-shadow: none;
  padding: 0;
  margin: 0;
  height: 100%;
}

.ui-input-password-toggle:hover {
  color: var(--color-gray-600);
}

/* Helper text */
.ui-input-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
}

.ui-input-error {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  margin-top: var(--spacing-xs);
  display: flex;
  align-items: center;
}

.ui-input-error i {
  margin-right: var(--spacing-xs);
}

/* Focused state for icons */
.ui-input-container--focused .ui-input-icon {
  color: var(--color-primary);
}

/* Required asterisk */
.text-error {
  color: var(--color-error);
  margin-left: var(--spacing-xs);
}
</style>
