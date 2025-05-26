<template>
  <div class="variable-form p-l bg-white round-2">
    <div class="grid-2">
      <wfa-input
        id="name"
        label="Name"
        v-model="name"
        @update:modelValue="update"
        :error="nameError"
        required
      />
      <div class="flex-space-between">
        <div class="checkbox-wrapper mt-l">
          <label for="formStore" class="wfa-label">Use Form Store</label>
          <input
            type="checkbox"
            id="formStore"
            v-model="formStore"
            @change="update"
          />
        </div>
        <span
          class="variable-form-remove mt-xl text-l"
          v-if="canRemove"
          @click="removeVariable"
        >
          <i class="pi pi-trash"></i>
        </span>
      </div>
    </div>
    <div v-if="hasDefaultValue">
      <wfa-input
        id="type"
        label="Type"
        type="select"
        v-model="type"
        @update:modelValue="typeChange"
        :error="typeError"
        required
        v-if="!dataType"
      >
        <option value="string">String</option>
        <option value="number">Number</option>
        <option value="boolean">Boolean</option>
        <option value="object">Object</option>
        <option value="null">Null</option>
        <option value="undefined">Undefined</option>
      </wfa-input>
      <div class="mt-l">
        <wfa-input
          v-if="type === 'string'"
          id="defaultValue"
          label="Default Value"
          v-model="defaultValue"
          @update:modelValue="update"
          placeholder="Enter default string value"
        />
        <wfa-input
          v-else-if="type === 'number'"
          id="defaultValue"
          label="Default Value"
          type="number"
          v-model="defaultValue"
          @update:modelValue="update"
          placeholder="0"
        />
        <div v-else-if="type === 'boolean'" class="checkbox-wrapper">
          <label for="defaultValue" class="wfa-label">Default Value</label>
          <input
            type="checkbox"
            id="defaultValue"
            v-model="defaultValue"
            @change="update"
          />
        </div>
        <div v-else-if="type === 'object'">
          <label for="defaultValue" class="wfa-label">Default Value</label>
          <json-editor
            id="defaultValue"
            v-model="defaultValue"
            @change="update"
            :height="'200px'"
          ></json-editor>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import type { PropType } from 'vue';
import Variable from '../../classes/Variable';
import jsonEditor from '../common/code/jsonEditor.vue';
import wfaInput from '../common/wfa-input.vue';

export default defineComponent({
  components: { jsonEditor, wfaInput },
  name: 'VariableForm',
  props: {
    variable: {
      type: Object as PropType<Variable>,
      required: true,
    },
    canRemove: {
      type: Boolean,
      default: false,
    },
    hasDefaultValue: {
      type: Boolean,
      default: true,
    },
    dataType: {
      type: String as PropType<'string' | 'number' | 'boolean' | 'object' | 'null' | 'undefined'>,
      default: undefined,
    },
  },
  emits: ['update', 'remove'],
  setup(props, { emit }) {
    // Type the emit function
    type VariableFormEmits = {
      (e: 'update', data: { name: string; type: string; description: string; defaultValue: any; required: boolean; formStore: boolean; }): void;
      (e: 'remove'): void;
    }
    const emitter = emit as VariableFormEmits;
    
    // Reactive state
    const name = ref<string>(props.variable.name);
    const type = ref<string>(props.variable.type || props.dataType || 'string');
    const description = ref<string>(props.variable.description);
    const defaultValue = ref<any>(props.variable.defaultValue);
    const required = ref<boolean>(props.variable.required);
    const formStore = ref<boolean>(props.variable.formStore);
    const nameError = ref<string>('');
    const typeError = ref<string>('');
    
    // Watch for prop changes
    watch(() => props.variable, (newVar) => {
      name.value = newVar.name;
      type.value = newVar.type;
      description.value = newVar.description;
      defaultValue.value = newVar.defaultValue;
      required.value = newVar.required;
      formStore.value = newVar.formStore;
    });
    
    const removeVariable = () => {
      emitter('remove');
    };
    
    const typeChange = () => {
      if (!props.dataType) return;
      // Reset default value based on selected type
      if (type.value === 'string') {
        defaultValue.value = '';
      } else if (type.value === 'number') {
        defaultValue.value = 0;
      } else if (type.value === 'boolean') {
        defaultValue.value = false;
      } else if (type.value === 'object') {
        defaultValue.value = {};
      } else if (type.value === 'array') {
        defaultValue.value = [];
      } else if (type.value === 'null') {
        defaultValue.value = null;
      } else if (type.value === 'undefined') {
        defaultValue.value = undefined;
      }
      
      update();
    };
    
    const update = () => {
      // Validate before emitting update
      validate();
      
      emitter('update', {
        name: name.value,
        type: type.value,
        description: description.value,
        defaultValue: defaultValue.value,
        required: required.value,
        formStore: formStore.value,
      });
    };
    
    const validate = () => {
      // Basic validation
      nameError.value = name.value ? '' : 'Name is required';
      typeError.value = (!formStore.value && !type.value) ? 'Type is required' : '';
      
      return !nameError.value && !typeError.value;
    };
    
    return {
      name,
      type,
      description,
      defaultValue,
      required,
      formStore,
      nameError,
      typeError,
      removeVariable,
      typeChange,
      update,
      validate
    };
  }
});
</script>
<style lang="scss" scoped>
.variable-form {
  position: relative;
}

.variable-form-remove {
  cursor: pointer;
  color: var(--color-danger);
}

.checkbox-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-large);

  input[type="checkbox"] {
    margin-top: var(--spacing-small);
    width: 18px;
    height: 18px;
    cursor: pointer;
    border: 1px solid var(--color-border);
    border-radius: 3px;
    
    &:checked {
      background-color: var(--color-primary);
      border-color: var(--color-primary);
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb, 0, 122, 255), 0.2);
    }
  }
}
</style>
