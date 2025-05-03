<template>
  <div class="variable-form p-l bg-white round-2">
    <div class="grid-2">
      <div class="wfa-input">
        <label for="name">Name</label>
        <input type="text" id="name" v-model="name" @change="update" />
      </div>
      <div class="flex-space-between ">
        <div class="wfa-input checkbox-inline-reverse mt-l">
          <label for="formStore">Use Form Store</label>
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
    <div class="wfa-input mt-l">
      <label for="description">Description</label>
      <input
        type="text"
        id="description"
        v-model="description"
        @change="typeChange"
      />
    </div>
    <div v-if="!formStore">
      <div class="wfa-input mt-l">
        <label for="type">Type</label>
        <select id="type" v-model="type" @change="update">
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
          <option value="object">Object</option>
          <option value="null">Null</option>
          <option value="undefined">Undefined</option>
        </select>
      </div>
      <div class="wfa-input mt-l">
        <label for="defaultValue">Default Value</label>
        <input
          v-if="type === 'string'"
          type="text"
          id="defaultValue"
          v-model="defaultValue"
          @change="update"
        />
        <input
          v-else-if="type === 'number'"
          type="number"
          id="defaultValue"
          v-model="defaultValue"
          @change="update"
        />
        <input
          v-else-if="type === 'boolean'"
          type="checkbox"
          id="defaultValue"
          v-model="defaultValue"
          @change="update"
        />
        <json-editor
          v-else-if="type === 'object'"
          id="defaultValue"
          v-model="defaultValue"
          @change="update"
        ></json-editor>
      </div>
    </div>
  </div>
</template>

<script>
import Variable from "../../classes/Variable";
import jsonEditor from "../common/jsonEditor.vue";
export default {
  components: { jsonEditor },
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
    };
  },
  methods: {
    removeVariable() {
      this.$emit("remove");
    },
    typeChange() {
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
      } else if (this.type === "function") {
        this.defaultValue = function () {};
      } else if (this.type === "any") {
        this.defaultValue = null;
      } else if (this.type === "null") {
        this.defaultValue = null;
      } else if (this.type === "undefined") {
        this.defaultValue = undefined;
      }
    },
    update() {
      this.$emit("update", {
        name: this.name,
        type: this.type,
        description: this.description,
        defaultValue: this.defaultValue,
        required: this.required,
        formStore: this.formStore,
      });
    },
  },
  mounted() {},
};
</script>

<style>
.variable-form {
  position: relative;
}
.variable-form-remove {
  cursor: pointer;
  color: var(--color-danger);
}
</style>
