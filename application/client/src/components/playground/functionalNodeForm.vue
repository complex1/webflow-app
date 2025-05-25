<template>
  <div>
    <wfa-input
      id="name"
      label="Name"
      v-model="name"
      @update:modelValue="update"
      :error="nameError"
      required
    />
    <wfa-input
      id="description"
      label="Description"
      v-model="description"
      @update:modelValue="update"
      placeholder="Optional description"
      class="mt-m"
    />
    <expension-panel class="mt-m">
      <template #header>
        <div class="flex-v-center flex-space-between pr-l">
          <span
            >Parameters
            <small v-if="parameters.length > 0">({{ parameters.length }})</small
            ></span
          >
          <button
            class="btn btn-primary btn-outlined"
            @click.stop="AddParameter"
          >
            Add Parameter
          </button>
        </div>
      </template>
      <template #content>
        <div
          v-for="(param, index) in parameters"
          :key="'param-' + index"
          class="mb-m"
        >
          <variable-form
            :variable="param"
            :canRemove="true"
            @remove="RemoveParameter(index)"
            @update="onUpdateParameter(index, $event)"
          ></variable-form>
        </div>
        <div
          v-if="parameters.length === 0"
          class="no-params-message text-center text-warning text-bold"
        >
          No parameters added.
        </div>
      </template>
    </expension-panel>
    <expension-panel class="mt-m">
      <template #header>
        <div class="flex-v-center flex-space-between pr-l">
          <span>Transform</span>
        </div>
      </template>
      <template #content>
        <div style="height: 200px;">
          <js-editor
            v-model="transform"
          ></js-editor>
        </div>
      </template>
    </expension-panel>
    <validation-errors
      v-if="errors.length > 0"
      :errors="errors"
      class="mt-m"
      style="max-height: 20rem; overflow-y: auto"
    ></validation-errors>
    <div class="flex-end mt-m">
      <button
        class="btn btn-primary btn-outline mx-m"
        style="width: 8rem"
        @click="cancel"
      >
        Cancel
      </button>
      <button class="btn btn-primary" style="width: 8rem" @click="save">
        Save
      </button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import Variable from "../../classes/Variable";
import FunctionalNode from "../../classes/FunctionalNode";
import expensionPanel from "../common/expensionPanel.vue";
import VariableForm from "./variableForm.vue";
import ErrorMessage from "../../classes/ErrorMessage";
import ValidationErrors from "../common/validationError.vue";
import JsEditor from '../common/code/jsEditor.vue';
import wfaInput from "../common/wfa-input.vue";

export default {
  components: { 
    expensionPanel, 
    VariableForm, 
    ValidationErrors, 
    JsEditor,
    wfaInput
  },
  name: "FunctionalNodeForm",
  props: {
    node: {
      type: FunctionalNode,
      required: true,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      name: "",
      description: "",
      parameters: [],
      transform: "",
      errors: [],
      nameError: "",
    };
  },
  methods: {
    ...mapMutations({
      addFunctionalNode: "workflowModule/addFunctionalNode",
      updateFunctionalNode: "workflowModule/updateFunctionalNode",
    }),
    update() {
      this.validateName();
    },
    validateName() {
      this.nameError = this.name ? "" : "Name is required";
    },
    AddParameter() {
      const variable = new Variable();
      this.parameters.push(variable);
    },
    RemoveParameter(index) {
      this.parameters.splice(index, 1);
    },
    onUpdateParameter(index, variable) {
      this.parameters[index].name = variable.name;
      this.parameters[index].type = variable.type;
      this.parameters[index].description = variable.description;
      this.parameters[index].defaultValue = variable.defaultValue;
      this.parameters[index].required = variable.required;
      this.parameters[index].formStore = variable.formStore;
    },
    validate() {
      this.errors = [];
      this.validateName();
      
      if (this.name === "") {
        this.errors.push(new ErrorMessage("Name is required.", "ERROR"));
      }
      if (this.transform === "") {
        this.errors.push(
          new ErrorMessage("Transform function is required.", "ERROR")
        );
      }
      this.parameters.forEach((param, index) => {
        this.errors = this.errors.concat(param.validation("Parameter", index + 1));
      });
      
      return this.errors.length === 0;
    },
    save() {
      if (!this.validate()) {
        return;
      }
      
      const functionalNode = new FunctionalNode();
      functionalNode.name = this.name;
      functionalNode.description = this.description;
      functionalNode.parameters = this.parameters;
      functionalNode.transform = this.transform;
      if (this.isEdit && this.node) {
        functionalNode.id = this.node.id; // Preserve the ID for updates
      }
      this.isEdit ? this.updateFunctionalNode(functionalNode) : this.addFunctionalNode(functionalNode);

      this.name = "";
      this.description = "";
      this.parameters = [];
      this.transform = "";
      this.nameError = "";
      this.$emit("close");
    },
    cancel() {
      this.name = "";
      this.description = "";
      this.parameters = [];
      this.transform = "";
      this.nameError = "";
      this.errors = [];
      this.$emit("close");
    },
  },
  created() {
    if (this.isEdit && this.node) {
      this.name = this.node.name;
      this.description = this.node.description;
      this.parameters = this.node.parameters;
      this.transform = this.node.transform || "";
    }
  },
};
</script>

<style></style>
