<template>
  <div>
    <div class="grid-2">
      <div class="wfa-input">
        <label for="name">Name</label>
        <input type="text" id="name" v-model="name" />
      </div>
      <div class="wfa-input">
        <label for="description">Description</label>
        <input type="text" id="description" v-model="description" />
      </div>
    </div>
    <div class="grid-3 mt-m">
      <div class="wfa-input">
        <label for="baseUrl">Base URL</label>
        <input type="text" id="baseUrl" v-model="baseUrl" />
      </div>
      <div class="wfa-input">
        <label for="url">URL</label>
        <input type="text" id="url" v-model="url" />
      </div>
      <div class="wfa-input">
        <label for="pathParams">Methods</label>
        <select id="method" v-model="method" @change="onChangeMethod">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
      </div>
    </div>
    <expension-panel v-if="body" class="mt-m">
      <template #header>
        <div class="flex-v-center flex-space-between pr-l">
          <span>Body</span>
        </div>
      </template>
      <template #content>
        <variable-form
          :variable="body"
          :canRemove="false"
          @update="onUpdateBody($event)"
        ></variable-form>
      </template>
    </expension-panel>

    <expension-panel class="mt-m">
      <template #header>
        <div class="flex-v-center flex-space-between pr-l">
          <span
            >Path Parameters
            <small v-if="pathParams.length > 0"
              >({{ pathParams.length }})</small
            ></span
          >
          <button
            class="btn btn-primary btn-outlined"
            @click.stop="AddPathParam"
          >
            Add Path Parameter
          </button>
        </div>
      </template>
      <template #content>
        <div
          v-for="(param, index) in pathParams"
          :key="'param-' + index"
          class="mb-m"
        >
          <variable-form
            :variable="param"
            :canRemove="true"
            @remove="RemovePathParam(index)"
            @update="onUpdatePathParam(index, $event)"
          ></variable-form>
        </div>
        <div
          v-if="pathParams.length === 0"
          class="no-params-message text-center text-warning text-bold"
        >
          No path parameters added.
        </div>
      </template>
    </expension-panel>

    <expension-panel class="mt-m">
      <template #header>
        <div class="flex-v-center flex-space-between pr-l">
          <span
            >Query Parameters
            <small v-if="queryParams.length > 0"
              >({{ queryParams.length }})</small
            ></span
          >
          <button
            class="btn btn-primary btn-outlined"
            @click.stop="AddQueryParam"
          >
            Add Query Parameter
          </button>
        </div>
      </template>
      <template #content>
        <div
          v-for="(param, index) in queryParams"
          :key="'query-' + index"
          class="mb-m"
        >
          <variable-form
            :variable="param"
            :canRemove="true"
            @remove="RemoveQueryParam(index)"
            @update="onUpdateQueryParam(index, $event)"
          ></variable-form>
        </div>
        <div
          v-if="queryParams.length === 0"
          class="no-params-message text-center text-warning text-bold"
        >
          No query parameters added.
        </div>
      </template>
    </expension-panel>

    <expension-panel class="mt-m">
      <template #header>
        <div class="flex-v-center flex-space-between pr-l">
          <span
            >Headers
            <small v-if="headers.length > 0"
              >({{ headers.length }})</small
            ></span
          >
          <button class="btn btn-primary btn-outlined" @click.stop="AddHeader">
            Add Header
          </button>
        </div>
      </template>
      <template #content>
        <div
          v-for="(header, index) in headers"
          :key="'header-' + index"
          class="mb-m"
        >
          <variable-form
            :variable="header"
            :canRemove="true"
            @remove="RemoveHeader(index)"
            @update="onUpdateHeader(index, $event)"
          ></variable-form>
        </div>
        <div
          v-if="headers.length === 0"
          class="no-params-message text-center text-warning text-bold"
        >
          No headers added.
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
import ExpensionPanel from "../common/expensionPanel.vue";
import variableForm from "./variableForm.vue";
import HttpNode from "../../classes/HttpNode";
import ErrorMessage from "../../classes/ErrorMessage";
import validationErrors from '../common/validationError.vue';

export default {
  name: "HttpNodeForm",
  props: {
    node: {
      type: HttpNode,
      required: true,
    },
  },
  components: { variableForm, ExpensionPanel, validationErrors },
  data: function () {
    return {
      name: "",
      description: "",
      baseUrl: "",
      url: "",
      pathParams: [],
      queryParams: [],
      headers: [],
      body: null,
      method: "GET",
      errors: [],
    };
  },
  methods: {
    ...mapMutations({
      addHttpNode: "workflowModule/addHttpNode",
    }),
    onChangeMethod() {
      if (this.method === "GET" || this.method === "DELETE") {
        this.body = null;
      } else {
        this.body = new Variable();
        this.body.name = "body";
        this.body.type = "object";
      }
    },
    onUpdateBody(variable) {
      this.body.name = variable.name;
      this.body.type = variable.type;
      this.body.description = variable.description;
      this.body.defaultValue = variable.defaultValue;
      this.body.required = variable.required;
      this.body.formStore = variable.formStore;
    },
    AddQueryParam() {
      const variable = new Variable();
      this.queryParams.push(variable);
    },
    RemoveQueryParam(index) {
      this.queryParams.splice(index, 1);
    },
    onUpdateQueryParam(index, variable) {
      this.queryParams[index].name = variable.name;
      this.queryParams[index].type = variable.type;
      this.queryParams[index].description = variable.description;
      this.queryParams[index].defaultValue = variable.defaultValue;
      this.queryParams[index].required = variable.required;
      this.queryParams[index].formStore = variable.formStore;
    },
    AddHeader() {
      const variable = new Variable();
      this.headers.push(variable);
    },
    RemoveHeader(index) {
      this.headers.splice(index, 1);
    },
    onUpdateHeader(index, variable) {
      this.headers[index].name = variable.name;
      this.headers[index].type = variable.type;
      this.headers[index].description = variable.description;
      this.headers[index].defaultValue = variable.defaultValue;
      this.headers[index].required = variable.required;
      this.headers[index].formStore = variable.formStore;
    },
    AddPathParam() {
      const variable = new Variable();
      this.pathParams.push(variable);
    },
    RemovePathParam(index) {
      this.pathParams.splice(index, 1);
    },
    onUpdatePathParam(index, variable) {
      this.pathParams[index].name = variable.name;
      this.pathParams[index].type = variable.type;
      this.pathParams[index].description = variable.description;
      this.pathParams[index].defaultValue = variable.defaultValue;
      this.pathParams[index].required = variable.required;
      this.pathParams[index].formStore = variable.formStore;
    },
    validation() {
      this.errors = [];
      if (!this.name) {
        this.errors.push(new ErrorMessage("Name is required", "ERROR"));
      }
      if (!this.baseUrl) {
        this.errors.push(new ErrorMessage("Base URL is required", "ERROR"));
      }
      if (!this.url) {
        this.errors.push(new ErrorMessage("URL is required", "ERROR"));
      }
      if (
        this.method === "POST" ||
        this.method === "PUT" ||
        this.method === "PATCH"
      ) {
        if (!this.body) {
          this.errors = this.errors.concat(this.body.validation('Body') || []);
        }
      }
      this.pathParams.forEach((item, index) => {
        this.errors = this.errors.concat(item.validation('Path Parameter', index + 1) || []);
      });
      this.queryParams.forEach((item, index) => {
        this.errors = this.errors.concat(item.validation('Query Parameter', index + 1) || []);
      });
      this.headers.forEach((item, index) => {
        this.errors = this.errors.concat(item.validation('Header', index + 1) || []);
      });
    },
    save() {
      this.validation();
      if (this.errors.length > 0) {
        return;
      }
      const httpNode = new HttpNode();
      httpNode.name = this.name;
      httpNode.description = this.description;
      httpNode.baseUrl = this.baseUrl;
      httpNode.url = this.url;
      httpNode.method = this.method;
      httpNode.pathParams = this.pathParams;
      httpNode.queryParams = this.queryParams;
      httpNode.headers = this.headers;
      httpNode.body = this.body;
      this.addHttpNode(httpNode);
      this.$emit("close");
    },
    cancel() {
      this.$emit("close");
    },
  },
};
</script>

<style></style>
