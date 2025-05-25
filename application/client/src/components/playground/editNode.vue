<template>
  <div class="edit-node-component">
    <drawer :isOpen="open" @close="onClose" title="Create API Node">
      <http-node-form
        v-if="open && isHttp"
        @close="onClose"
        :node="nodeData"
        :isEdit="true"
      ></http-node-form>
      <functional-node-form
        v-if="open && isFunctional"
        @close="onClose"
        :node="nodeData"
        :isEdit="true"
      ></functional-node-form>
    </drawer>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import drawer from '../common/drawer.vue';
import FunctionalNodeForm from './functionalNodeForm.vue';
import HttpNodeForm from './httpNodeForm.vue';
export default {
  components: { drawer, HttpNodeForm, FunctionalNodeForm },
  name: 'editNodeComponent',
  props: {
    id: {
      type: String,
      required: true,
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      workflow: (state) => state.workflowModule.workflow,
    }),
    isFunctional() {
      return this.nodeData.type === 'FUNCTIONAL';
    },
    isHttp() {
      return this.nodeData.type === 'HTTP';
    },
    nodeData() {
      return this.workflow.getNode(this.id);
    },
  },
  watch: {},
  methods: {
    onClose () {
      this.$emit('close');
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang='scss' scoped>
</style>
