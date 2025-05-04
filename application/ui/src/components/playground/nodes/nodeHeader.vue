<template>
  <div class="node-header p-s gap-4 flex-space-between flex-v-center">
    <div>
      <h3 class="text-dark text-m">{{ nodeData.name }}</h3>
      <p v-if="nodeData.description" class="text-secondry text-s">
        {{ nodeData.description }}
      </p>
    </div>
    <div class="flex-v-center">
      <status-chip :status="nodeData.nodeStatus"></status-chip>
      <popover ref="popover">
        <template #target>
          <button class="btn btn-icon ml-m" data-tooltip="Node Options">
            <i class="pi pi-ellipsis-v cursor-pointer"></i>
          </button>
        </template>
        <template #content>
          <div class="bg-white">
            <div class="menu-item" @click="editNode">
              <i class="pi pi-pencil mr-s"></i>
              <span class="text-secondry">Edit Node</span>
            </div>
            <div class="menu-item" @click="deleteNode">
              <i class="pi pi-trash mr-s"></i>
              <span class="text-secondry">Delete Node</span>
            </div>
          </div>
        </template>
      </popover>
    </div>
  </div>
</template>
<script>
import Popover from "../../common/popover.vue";
import statusChip from "../../common/statusChip.vue";
import { DeleteConfirmationPopup } from "../../../lib/alertPopup";
export default {
  components: { statusChip, Popover },
  name: "nodeHeaderComponent",
  props: {
    nodeData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    editNode() {},
    deleteNode() {
      this.$refs.popover.close();
      DeleteConfirmationPopup(
        "Are you sure you want to delete this node?"
      ).then((result) => {
        console.log(result);
      });
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang='scss' scoped>
</style>
