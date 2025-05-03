<template>
  <div>
    <div class="wfa-input">
      <label for="name">Name</label>
      <input type="text" id="name" v-model="name" @change="update" />
    </div>
    <div class="wfa-input mt-m">
      <label for="description">Description</label>
      <input
        type="text"
        id="description"
        v-model="description"
        @change="update"
      />
    </div>
    <expension-panel class="mt-m">
      <template #header>
        <div class="flex-v-center flex-space-between pr-l">
          <span
            >Parameters
            <small v-if="parameters.length > 0"
              >({{ parameters.length }})</small
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
        <div class="wfa-input">
          <textarea
            class="wfa-textarea"
            placeholder="Transform function"
            rows="5"
            cols="50"
            type="text"
            id="transform"
            v-model="transform"
            @change="update"
          />
        </div>
      </template>
    </expension-panel>
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
export default {
  components: { expensionPanel, VariableForm },
  name: "FunctionalNodeForm",
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      name: "",
      description: "",
      parameters: [],
      transform: "",
      errors: [],
    };
  },
  methods: {
    ...mapMutations({
      addHttpNode: "workflowModule/addFunctionalNode",
    }),
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
      if (this.name === "") {
        this.errors.push("Name is required.");
      }
      if (this.transform === "") {
        this.errors.push("Transform function is required.");
      }
    },
    save() {
      this.validate();
      if (this.errors.length > 0) {
        return;
      }
      const functionalNode = new FunctionalNode();
      functionalNode.name = this.name;
      functionalNode.description = this.description;
      functionalNode.parameters = this.parameters;
      functionalNode.transform = this.transform;
      this.addHttpNode(functionalNode);

      this.name = "";
      this.description = "";
      this.parameters = [];
      this.transform = "";
      this.$emit("close");
    },
    cancel() {
      this.name = "";
      this.description = "";
      this.parameters = [];
      this.transform = "";
      this.$emit("close");
    },
  },
};
</script>

<style></style>
