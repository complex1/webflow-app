<template>
  <div>
    <popover ref="popover">
      <template #target>
        <button class="btn btn-primary btn-icon mx-l">
          <i class="pi pi-plus"></i>
          <span class="ml-s">Add Node</span>
        </button>
      </template>
      <template #content>
        <div class="popover-content bg-white round-1">
          <div class="menu-item" @click="toggleHttpModal">
            <i class="pi pi-globe mr-s"></i>
            Create API Node
          </div>
          <div></div>
          <div class="menu-item" @click="toggleFunctionalModal">
            <i class="pi pi-cog mr-s"></i>
            Create Functional Node
          </div>
          <div class="menu-item" v-if="openApiDocConfig.enabled" @click="toggleApiDocModal">
            <img src="../../assets/openapi.svg" class="mr-s" width="20px" alt="">
            Import API Node from OpenAPI Doc
          </div>
        </div>
      </template>
    </popover>
    <drawer
      :isOpen="addHttpModal"
      @close="toggleHttpModal"
      title="Create API Node"
    >
      <http-node-form v-if="addHttpModal" @close="toggleHttpModal"></http-node-form>
    </drawer>
    <drawer
      :isOpen="addFunctionalModal"
      @close="toggleFunctionalModal"
      title="Create Functional Node"
    >
      <functional-node-form v-if="addFunctionalModal" @close="toggleFunctionalModal"></functional-node-form>
    </drawer>
    <modal
      v-if="addApiDocModal"
      :isOpen="addApiDocModal"
      @close="toggleApiDocModal"
      title="Import API Node from OpenAPI Doc"
      width="80%"
      closeOnEscape
    >
      <open-api-docs
        :openApiDocConfig="openApiDocConfig"
        @close="toggleApiDocModal"
      ></open-api-docs>
    </modal>
  </div>
</template>

<script>
import Drawer from '../common/drawer.vue';
import modal from '../common/modal.vue';
import Popover from '../common/popover.vue';
import FunctionalNodeForm from './functionalNodeForm.vue';
import HttpNodeForm from './httpNodeForm.vue';
import OpenApiDocs from './openapiDocs/index.vue';

export default {
  components: { modal, HttpNodeForm, FunctionalNodeForm, Popover, Drawer, OpenApiDocs },
  name: 'AddNode',
  props: {
    openApiDocConfig: {
      type: Object,
      default: () => ({ enabled: false, url: '' }),
    },
  },
  data() {
    return {
      addHttpModal: false,
      addFunctionalModal: false,
      addApiDocModal: false
    };
  },
  methods: {
    toggleHttpModal() {
      this.$refs.popover.close();
      this.addHttpModal = !this.addHttpModal;
    },
    toggleFunctionalModal() {
      this.$refs.popover.close();
      this.addFunctionalModal = !this.addFunctionalModal;
    },
    toggleApiDocModal() {
      this.$refs.popover.close();
      this.addApiDocModal = !this.addApiDocModal;
    },
  },
};
</script>

<style></style>
