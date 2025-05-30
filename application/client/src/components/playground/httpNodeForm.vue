<template>
  <div>
    <div class="grid-2">
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
      />
    </div>
    <div class="grid-3 mt-m">
      <wfa-input
        id="baseUrl"
        label="Base URL"
        v-model="baseUrl"
        @update:modelValue="update"
        :error="baseUrlError"
        placeholder="https://api.example.com"
        required
      />
      <wfa-input
        id="url"
        label="URL"
        v-model="url"
        @update:modelValue="update"
        :error="urlError"
        placeholder="/endpoint"
        required
      />
      <wfa-input
        id="method"
        label="Methods"
        type="select"
        v-model="method"
        @update:modelValue="onChangeMethod"
      >
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
        <option value="PATCH">PATCH</option>
      </wfa-input>
    </div>
    <div v-if="isLocalhost" class="http-localhost-warning text-s">
      <i class="pi pi-exclamation-triangle" style="color: var(--color-warning);"></i>
      <span style="margin-left: var(--spacing-medium);">Using localhost or 127.0.0.1 as the base URL
        will only work in the <b class="text-warning">local environment</b> and
        may cause issues with <b class="text-warning">CORS</b>.</span>
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
          :dataType="'object'"
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
            :dataType="'string'"
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
            :dataType="'string'"
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
            :dataType="'string'"
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
    <!-- <validation-errors
      v-if="errors.length > 0"
      :errors="errors"
      class="mt-m"
      style="max-height: 20rem; overflow-y: auto"></validation-errors> -->
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
import { mapMutations } from 'vuex';
import Variable from '../../classes/Variable';
import ExpensionPanel from '../common/expensionPanel.vue';
import variableForm from './variableForm.vue';
import HttpNode from '../../classes/HttpNode';
import ErrorMessage from '../../classes/ErrorMessage';
import validationErrors from '../common/validationError.vue';
import wfaInput from '../common/wfa-input.vue';

export default {
  name: 'HttpNodeForm',
  props: {
    node: {
      type: HttpNode,
      required: true,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    variableForm,
    ExpensionPanel,
    validationErrors,
    wfaInput,
  },
  data: function () {
    return {
      name: '',
      description: '',
      baseUrl: '',
      url: '',
      pathParams: [],
      queryParams: [],
      headers: [],
      body: null,
      method: 'GET',
      errors: [],
      nameError: '',
      baseUrlError: '',
      urlError: '',
    };
  },
  computed: {
    // Computed properties can be added here if needed
    isLocalhost() {
      const localhostRegex = /(localhost|127\.0\.0\.1)/;
      const isLocalhost = localhostRegex.test(this.baseUrl);
      return isLocalhost;
    },
  },
  methods: {
    ...mapMutations({
      addHttpNode: 'workflowModule/addHttpNode',
      updateHttpNode: 'workflowModule/updateHttpNode',
    }),
    update() {
      this.validateFields();
    },
    validateFields() {
      this.nameError = this.name ? '' : 'Name is required';
      this.baseUrlError = this.baseUrl ? '' : 'Base URL is required';
      this.urlError = this.url ? '' : 'URL is required';

      // Validate URL format
      if (this.baseUrl && !this.isValidUrl(this.baseUrl)) {
        this.baseUrlError = 'Invalid URL format';
      }
    },
    isValidUrl(url) {
      try {
        // Check if it's a valid URL (supports http/https protocols)
        return url.startsWith('http://') || url.startsWith('https://');
      } catch (e) {
        return false;
      }
    },
    onChangeMethod() {
      if (this.method === 'GET' || this.method === 'DELETE') {
        this.body = null;
      } else {
        this.body = new Variable();
        this.body.name = 'body';
        this.body.type = 'object';
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
      this.validateFields();

      if (!this.name) {
        this.errors.push(new ErrorMessage('Name is required', 'ERROR'));
      }
      if (!this.baseUrl) {
        this.errors.push(new ErrorMessage('Base URL is required', 'ERROR'));
      }
      if (!this.url) {
        this.errors.push(new ErrorMessage('URL is required', 'ERROR'));
      }
      if (this.baseUrl && !this.isValidUrl(this.baseUrl)) {
        this.errors.push(new ErrorMessage('Invalid Base URL format', 'ERROR'));
      }

      if (
        this.method === 'POST' ||
        this.method === 'PUT' ||
        this.method === 'PATCH'
      ) {
        if (this.body) {
          this.errors = this.errors.concat(this.body.validation('Body') || []);
        }
      }
      this.pathParams.forEach((item, index) => {
        this.errors = this.errors.concat(
          item.validation('Path Parameter', index + 1) || []
        );
      });
      this.queryParams.forEach((item, index) => {
        this.errors = this.errors.concat(
          item.validation('Query Parameter', index + 1) || []
        );
      });
      this.headers.forEach((item, index) => {
        this.errors = this.errors.concat(
          item.validation('Header', index + 1) || []
        );
      });

      return this.errors.length === 0;
    },
    save() {
      if (!this.validation()) {
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
      if (this.isEdit && this.node) {
        httpNode.id = this.node.id; // Preserve the ID for updates
      }
      this.isEdit ? this.updateHttpNode(httpNode) : this.addHttpNode(httpNode);

      this.resetForm();
      this.$emit('close');
    },
    cancel() {
      this.resetForm();
      this.$emit('close');
    },
    resetForm() {
      this.name = '';
      this.description = '';
      this.baseUrl = '';
      this.url = '';
      this.method = 'GET';
      this.pathParams = [];
      this.queryParams = [];
      this.headers = [];
      this.body = null;
      this.errors = [];
      this.nameError = '';
      this.baseUrlError = '';
      this.urlError = '';
    },
  },
  created() {
    if (this.isEdit && this.node) {
      this.name = this.node.name;
      this.description = this.node.description;
      this.baseUrl = this.node.baseUrl;
      this.url = this.node.url;
      this.method = this.node.method || 'GET';
      this.pathParams = this.node.pathParams || [];
      this.queryParams = this.node.queryParams || [];
      this.headers = this.node.headers || [];
      this.body = this.node.body || null;
    }
  },
};
</script>

<style scoped lang="scss">
.http-localhost-warning {
  padding: var(--spacing-large);
  border: 1px solid var(--color-warning);
  background-color: rgba(var(--color-warning-rgb), 0.1);
  color: var(--color-text-primary);
  border-radius: 4px;
  margin-top: var(--spacing-large);
  display: flex;
  align-items: center;
}
</style>
