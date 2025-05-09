<template>
  <div class="node-header p-s gap-m flex-space-between flex-v-center">
    <div class="flex-grow" >
      <div class="text-dark text-m text-500 flex-v-center gap-s">
        <div class="text-truncate" style="max-width: 200px">
          {{ nodeData.name }}
        </div>
        <popover v-if="nodeData.description || nodeData.description === ''" :tooltip="true">
          <template #target>
            <small class="pi pi-info-circle cursor-pointer opacity-50 text-s"></small>
          </template>
          <template #content>
            <div class="text-m bg-white p-m round-1" style="max-width: 200px" >
              <span class="text-secondary">
                <strong>Description:</strong> {{ nodeData.description }}
              </span>
            </div>
          </template>
        </popover>
      </div>
    </div>
    <div class="flex-v-center">
      <status-chip :status="nodeData.nodeStatus" size="small"></status-chip>
      <popover ref="popover">
        <template #target>
          <button class="btn btn-icon" data-tooltip="Node Options">
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
<style lang="scss" scoped></style>
