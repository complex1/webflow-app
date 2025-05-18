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
    <wfa-input
      id="description"
      label="Description"
      v-model="description"
      @update:modelValue="update"
      placeholder="Optional description"
    />
    <div v-if="!formStore">
      <wfa-input
        id="type"
        label="Type"
        type="select"
        v-model="type"
        @update:modelValue="typeChange"
        :error="typeError"
        required
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

<script>
import Variable from "../../classes/Variable";
import jsonEditor from "../common/code/jsonEditor.vue";
import wfaInput from "../common/wfa-input.vue";

export default {
  components: { jsonEditor, wfaInput },
  name: "VariableForm",
  props: {
    variable: {
      type: Variable,
      required: true,
    },
    canRemove: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      name: this.variable.name,
      type: this.variable.type,
      description: this.variable.description,
      defaultValue: this.variable.defaultValue,
      required: this.variable.required,
      formStore: this.variable.formStore,
      nameError: '',
      typeError: '',
    };
  },
  methods: {
    removeVariable() {
      this.$emit("remove");
    },
    typeChange() {
      // Reset default value based on selected type
      if (this.type === "string") {
        this.defaultValue = "";
      } else if (this.type === "number") {
        this.defaultValue = 0;
      } else if (this.type === "boolean") {
        this.defaultValue = false;
      } else if (this.type === "object") {
        this.defaultValue = {};
      } else if (this.type === "array") {
        this.defaultValue = [];
      } else if (this.type === "null") {
        this.defaultValue = null;
      } else if (this.type === "undefined") {
        this.defaultValue = undefined;
      }
      
      this.update();
    },
    update() {
      // Validate before emitting update
      this.validate();
      
      this.$emit("update", {
        name: this.name,
        type: this.type,
        description: this.description,
        defaultValue: this.defaultValue,
        required: this.required,
        formStore: this.formStore,
      });
    },
    validate() {
      // Basic validation
      this.nameError = this.name ? '' : 'Name is required';
      this.typeError = (!this.formStore && !this.type) ? 'Type is required' : '';
      
      return !this.nameError && !this.typeError;
    }
  },
};
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
