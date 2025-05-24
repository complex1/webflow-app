<template>
  <div class="node-header p-s flex-space-between flex-v-center bg-light-gradient border-bottom">
    <div class="flex-grow">
      <div class="text-dark font-500 flex-v-center gap-s">
        <i class="pi pi-box mr-xs text-primary"></i>
        <div class="text-truncate" style="max-width: 200px">
          {{ nodeData.name }}
        </div>
        <popover v-if="nodeData.description || nodeData.description === ''" :tooltip="true">
          <template #target>
            <small class="pi pi-info-circle cursor-pointer text-secondary opacity-70 text-s"></small>
          </template>
          <template #content>
            <div class="text-m bg-white p-m round-2 shadow-1" style="max-width: 250px">
              <span class="text-secondary">
                <strong>Description:</strong> {{ nodeData.description || "No description provided" }}
              </span>
            </div>
          </template>
        </popover>
      </div>
    </div>
    <div class="flex-v-center gap-s">
      <status-chip :status="nodeData.nodeStatus" size="small"></status-chip>
      <popover ref="popover" placement="bottom-end">
        <template #target>
          <button class="btn btn-icon btn-ghost" data-tooltip="Node Options">
            <i class="pi pi-ellipsis-v cursor-pointer text-secondary"></i>
          </button>
        </template>
        <template #content>
          <div class="bg-white round-1 shadow-2 node-menu">
            <div class="menu-item flex-v-center p-xs hover-light" @click="editNode">
              <i class="pi pi-pencil text-primary mr-s"></i>
              <span class="text-secondary">Edit Node</span>
            </div>
            <div class="menu-item flex-v-center p-xs hover-light" @click="deleteNode">
              <i class="pi pi-trash text-danger mr-s"></i>
              <span class="text-secondary">Delete Node</span>
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
    editNode() {
      this.$refs.popover.close();
      this.$emit('edit-node', this.nodeData.id);
    },
    deleteNode() {
      this.$refs.popover.close();
      DeleteConfirmationPopup(
        "Are you sure you want to delete this node?"
      ).then((result) => {
        if (result.isConfirmed) {
          this.$emit('delete-node', this.nodeData.id);
        }
      });
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
.node-menu {
  min-width: 150px;
  overflow: hidden;
}
.menu-item {
  transition: background-color 0.2s;
  cursor: pointer;
}
.hover-light:hover {
  background-color: var(--color-light);
}
.bg-light-gradient {
  background: linear-gradient(to bottom, var(--color-light), rgba(var(--color-light-rgb), 0.5));
}
.border-bottom {
  border-bottom: 1px solid var(--color-border);
}
</style>
