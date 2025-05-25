<template>
  <div class="wfa-input-container" :class="{ 'has-error': error }">
    <label v-if="label" :for="id" class="wfa-label">{{ label }}</label>

    <!-- Input field -->
    <input
      v-if="type !== 'textarea' && type !== 'select'"
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :min="min"
      :max="max"
      :maxlength="maxlength"
      class="wfa-input"
      @input="updateValue($event)"
      @blur="onBlur"
      @focus="onFocus"
    />

    <!-- Textarea field -->
    <textarea
      v-else-if="type === 'textarea'"
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows || 3"
      :maxlength="maxlength"
      class="wfa-input wfa-textarea"
      @input="updateValue($event)"
      @blur="onBlur"
      @focus="onFocus"
    ></textarea>

    <!-- Select field -->
    <select
      v-else-if="type === 'select'"
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      class="wfa-input wfa-select"
      @input="updateValue($event)"
      @blur="onBlur"
      @focus="onFocus"
    >
      <option v-if="placeholder" value="" disabled selected>
        {{ placeholder }}
      </option>
      <slot></slot>
    </select>

    <!-- Error message -->
    <div v-if="error" class="wfa-error-message">{{ error }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

type InputType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'date' | 'tel' | 'url';

export default defineComponent({
  name: 'WfaInput',
  props: {
    id: {
      type: String,
      default: () => `input-${Math.random().toString(36).substring(2, 9)}`
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String as PropType<InputType>,
      default: 'text',
      validator: (value: string): boolean => {
        return [
          'text',
          'email',
          'password',
          'number',
          'textarea',
          'select',
          'date',
          'tel',
          'url',
        ].includes(value);
      }
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    min: {
      type: [String, Number],
      default: null
    },
    max: {
      type: [String, Number],
      default: null
    },
    maxlength: {
      type: [String, Number],
      default: null
    },
    rows: {
      type: [String, Number],
      default: 3
    },
    error: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'blur', 'focus'],
  setup(_, { emit }) {
    const updateValue = (event: Event) => {
      emit('update:modelValue', (event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value);
    };
    
    const onBlur = (event: FocusEvent) => {
      emit('blur', event);
    };
    
    const onFocus = (event: FocusEvent) => {
      emit('focus', event);
    };
    
    return {
      updateValue,
      onBlur,
      onFocus
    };
  }
});
</script>

<style lang="scss" scoped>
.wfa-input-container {
  margin-bottom: var(--spacing-large);

  &.has-error {
    .wfa-input {
      border-color: var(--color-danger);

      &:focus {
        border-color: var(--color-danger);
        box-shadow: 0 0 0 2px rgba(var(--color-danger-rgb, 255, 59, 48), 0.2);
      }
    }
  }
}

.wfa-label {
  display: block;
  margin-bottom: var(--spacing-small);
  color: var(--color-text-primary);
  font-weight: bold;
  font-size: var(--font-size-medium);
}

.wfa-input {
  width: 100%;
  padding: var(--spacing-medium);
  border-radius: 6pt;
  border: 1px solid var(--color-border);
  background-color: var(--color-white);
  color: var(--color-text-primary);
  font-size: var(--font-size-medium);
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb, 0, 122, 255), 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background-color: var(--color-light);
  }

  &::placeholder {
    color: var(--color-text-secondary);
    opacity: 0.7;
  }
}

.wfa-textarea {
  resize: vertical;
  min-height: 80px;
}

.wfa-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8.825L1.587 4.412 3 3l3 3 3-3 1.413 1.412L6 8.825z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--spacing-medium) center;
  padding-right: calc(var(--spacing-medium) * 2 + 12px);
}

.wfa-error-message {
  margin-top: var(--spacing-small);
  color: var(--color-danger);
  font-size: var(--font-size-small);
}
</style>
