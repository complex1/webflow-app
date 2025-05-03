<template>
  <div>
    <popover>
      <template #target>
        <button class="btn btn-primary btn-icon">
          <i class="pi pi-plus"></i>
          <span class="ml-s">Add Node</span>
        </button>
      </template>
      <template #content>
        <div class="popover-content">
          <div class="menu-item" @click="toggleHttpModal">
            <i class="pi pi-globe mr-s"></i>
            Create HTTP Node
          </div>
          <div></div>
          <div class="menu-item" @click="toggleFunctionalModal">
            <i class="pi pi-cog mr-s"></i>
            Create Functional Node
          </div>
        </div>
      </template>
    </popover>
    <modal
      v-if="addHttpModal"
      @close="toggleHttpModal"
      title="Create HTTP Node"
    >
      <http-node-form @close="toggleHttpModal"></http-node-form>
    </modal>
    <modal
      v-if="addFunctionalModal"
      @close="toggleFunctionalModal"
      title="Create Functional Node"
    >
      <functional-node-form
        @close="toggleFunctionalModal"
      ></functional-node-form>
    </modal>
  </div>
</template>

<script>
import modal from "../common/modal.vue";
import Popover from "../common/popover.vue";
import FunctionalNodeForm from "./functionalNodeForm.vue";
import HttpNodeForm from "./httpNodeForm.vue";
export default {
  components: { modal, HttpNodeForm, FunctionalNodeForm, Popover },
  name: "AddNode",
  data() {
    return {
      addHttpModal: false,
      addFunctionalModal: false,
    };
  },
  methods: {
    toggleHttpModal() {
      this.addHttpModal = !this.addHttpModal;
    },
    toggleFunctionalModal() {
      this.addFunctionalModal = !this.addFunctionalModal;
    },
  },
};
</script>

<style></style>
