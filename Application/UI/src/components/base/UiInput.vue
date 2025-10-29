<template>
  <div class="ui-input-wrapper" :class="wrapperClasses">
    <label v-if="label" :for="inputId" class="ui-input-label">
      {{ label }}
      <span v-if="required" class="required-asterisk">*</span>
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
        tabindex="-1"
      >
        <i :class="passwordIconClass"></i>
      </button>
      
      <!-- Glass shine effect on focus -->
      <div v-if="isFocused" class="input-shine"></div>
    </div>
    
    <div v-if="hint && !error" class="ui-input-hint">
      <i class="fas fa-info-circle"></i>
      {{ hint }}
    </div>
    
    <div v-if="error" class="ui-input-error">
      <i class="fas fa-exclamation-triangle"></i>
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
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'glass' | 'outlined' | 'filled' | 'minimal'
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
  variant: 'glass',
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
  `ui-input-wrapper--${props.size}`,
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
    'ui-input-container--readonly': props.readonly,
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
/* Neo-Systemic Input Wrapper */
.ui-input-wrapper {
  width: 100%;
  position: relative;
}

.ui-input-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
  transition: all var(--transition-normal);
}

.required-asterisk {
  color: var(--color-danger);
  margin-left: var(--spacing-xs);
}

/* Glass Input Container */
.ui-input-container {
  position: relative;
  display: flex;
  align-items: center;
  transition: all var(--transition-spring);
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* Container Variants */
.ui-input-container--glass {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-sm);
}

.ui-input-container--outlined {
  background: var(--color-background);
  border: 2px solid var(--color-border);
  box-shadow: none;
}

.ui-input-container--filled {
  background: var(--color-background-subtle);
  border: 1px solid var(--color-border-subtle);
  box-shadow: var(--shadow-inner);
}

.ui-input-container--minimal {
  background: transparent;
  border: 1px solid var(--color-border-subtle);
  box-shadow: none;
}

/* Container Sizes */
.ui-input-container--sm {
  min-height: 36px;
  border-radius: var(--radius-md);
}

.ui-input-container--md {
  min-height: 44px;
  border-radius: var(--radius-lg);
}

.ui-input-container--lg {
  min-height: 52px;
  border-radius: var(--radius-lg);
}

.ui-input-container--xl {
  min-height: 60px;
  border-radius: var(--radius-xl);
}

/* Container States */
.ui-input-container--focused {
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px var(--color-primary-light);
  transform: translateY(-1px);
}

.ui-input-container--error {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px var(--color-danger-subtle);
}

.ui-input-container--disabled {
  background: var(--color-background-disabled);
  border-color: var(--color-border-subtle);
  cursor: not-allowed;
  opacity: 0.6;
}

.ui-input-container--readonly {
  background: var(--color-background-subtle);
  border-color: var(--color-border-subtle);
}

/* Icon Spacing */
.ui-input-container--with-left-icon .ui-input {
  padding-left: 3rem;
}

.ui-input-container--with-right-icon .ui-input {
  padding-right: 3rem;
}

/* Input Field */
.ui-input {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  color: var(--color-text-primary);
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-normal);
  transition: all var(--transition-normal);
}

.ui-input::placeholder {
  color: var(--color-text-tertiary);
  opacity: 0.7;
}

.ui-input:disabled {
  cursor: not-allowed;
  color: var(--color-text-disabled);
}

/* Input Sizes */
.ui-input--sm {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
}

.ui-input--md {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-md);
}

.ui-input--lg {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-lg);
}

.ui-input--xl {
  padding: var(--spacing-lg) var(--spacing-xl);
  font-size: var(--font-size-lg);
}

/* Icons */
.ui-input-icon {
  position: absolute;
  color: var(--color-text-tertiary);
  pointer-events: none;
  transition: all var(--transition-normal);
  z-index: 2;
}

.ui-input-icon-left {
  left: var(--spacing-lg);
}

.ui-input-icon-right {
  right: var(--spacing-lg);
}

.ui-input-container--focused .ui-input-icon {
  color: var(--color-primary);
}

.ui-input-container--error .ui-input-icon {
  color: var(--color-danger);
}

/* Password Toggle Button */
.ui-input-password-toggle {
  position: absolute;
  right: var(--spacing-lg);
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all var(--transition-normal);
  border: none;
  background: transparent;
  outline: none;
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.ui-input-password-toggle:hover {
  color: var(--color-primary);
  background: var(--color-background-hover);
}

.ui-input-password-toggle:focus {
  color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-light);
}

/* Glass Shine Effect */
.input-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  animation: shine 0.6s ease-out;
  pointer-events: none;
  z-index: 1;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* Helper Text */
.ui-input-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  opacity: 0.8;
}

.ui-input-error {
  font-size: var(--font-size-xs);
  color: var(--color-danger);
  margin-top: var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-weight: var(--font-weight-medium);
}

/* Label Focus Animation */
.ui-input-wrapper--focused .ui-input-label {
  color: var(--color-primary);
  transform: translateY(-1px);
}

.ui-input-wrapper--error .ui-input-label {
  color: var(--color-danger);
}

/* Responsive Design */
@media (max-width: 768px) {
  .ui-input-container--xl {
    min-height: 52px;
  }
  
  .ui-input--xl {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: var(--font-size-md);
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .ui-input-container {
    border-width: 2px;
  }
  
  .ui-input-container--focused {
    box-shadow: 0 0 0 4px var(--color-primary-light);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .ui-input-container,
  .ui-input-icon,
  .ui-input-password-toggle,
  .ui-input-label {
    transition: none;
  }
  
  .input-shine {
    display: none;
  }
}
</style>
