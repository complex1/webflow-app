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
        </div>
      </template>
    </popover>
    <drawer
      :isOpen="addHttpModal"
      @close="toggleHttpModal"
      title="Create API Node"
    >
      <http-node-form @close="toggleHttpModal"></http-node-form>
    </drawer>
    <drawer
      :isOpen="addFunctionalModal"
      @close="toggleFunctionalModal"
      title="Create Functional Node"
    >
      <functional-node-form @close="toggleFunctionalModal"></functional-node-form>
    </drawer>
  </div>
</template>

<script>
import Drawer from '../common/drawer.vue';
import modal from "../common/modal.vue";
import Popover from "../common/popover.vue";
import FunctionalNodeForm from "./functionalNodeForm.vue";
import HttpNodeForm from "./httpNodeForm.vue";
export default {
  components: { modal, HttpNodeForm, FunctionalNodeForm, Popover, Drawer },
  name: "AddNode",
  data() {
    return {
      addHttpModal: false,
      addFunctionalModal: false,
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
  },
};
</script>

<style></style>
