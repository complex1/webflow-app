<template>
  <div>
    <!-- <div class="border-top border-secondary-light my-s"></div> -->
    <div class="flex-v-center gap-s position-relative">
      <div class="text-s text-primary font-600">
        Response:
      </div>
      <Handle
        :key="`data-${id}`"
        type="source"
        :position="Position.Right"
        :id="`data-${id}`"
        :style="{
          top: '12px',
          transform: 'translateY(-50%)',
          right: '-13px',
          height: '6px',
          width: '6px',
          background: nodeData.executionDone
            ? nodeData.hasError
              ? 'var(--color-danger)'
              : 'var(--color-success)'
            : 'var(--color-primary)',
          borderRadius: '50%',
          border: '1px solid var(--color-light)',
          boxShadow: '0 0 3px rgba(0,0,0,0.2)'
        }"
      />
    </div>
    <div class="border-top border-secondary-light"></div>
    <div class="mt-m">
      <div v-if="!nodeData.executionDone" class="text-s opacity-50 font-400">
        <i class="pi pi-clock mr-xs"></i> Node is not executed yet.
      </div>
      <div v-else class="node-response-container">
        <div class="mb-xs flex-v-center">
          <span class="text-s font-400 opacity-50 w-100px">Status:</span>
          <span
            class="text-s pl-xs badge"
            :class="nodeData.hasError ? 'badge-danger' : 'badge-success'"
          >
            <i :class="nodeData.hasError ? 'pi pi-times' : 'pi pi-check'"></i>
            {{ nodeData.hasError ? "Error" : "Success" }}
          </span>
        </div>
        <div class="mb-xs flex-v-center">
          <span class="text-s font-400 opacity-50 w-100px">Response Time:</span>
          <span class="text-s opacity-70 pl-xs">
            {{ nodeData.executionTime }}ms
          </span>
        </div>
        <div class="flex-v-center">
          <span class="text-s font-400 opacity-50 w-100px">Response:</span>
          <popover :tooltip="false" class="pl-xs">
            <template #target>
              <span class="text-s text-primary font-600 cursor-pointer hover-underline">
                <i class="pi pi-eye mr-2xs"></i> View Data
              </span>
            </template>
            <template #content>
              <node-state :node="nodeData" />
            </template>
          </popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import popover from "../../common/popover.vue";
import NodeState from "./nodeState.vue";
import { Position, Handle } from "@vue-flow/core";

export default {
  components: { popover, NodeState, Handle },
  name: "NodeResponse",
  props: {
    nodeData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      Position,
    };
  },
  computed: {
    id () {
      return this.nodeData.id;
    },
  },
  watch: {},
  methods: {},
};
</script>

<style scoped>
.badge {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.badge-success {
  background-color: var(--color-success-light);
  color: var(--color-success);
}
.badge-danger {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
}
.w-100px {
  width: 100px;
}
.hover-underline:hover {
  text-decoration: underline;
}
.mr-2xs {
  margin-right: 2px;
}
.border-top {
  height: 1px;
  width: 100%;
}
.border-secondary-light {
  background-color: var(--color-border);
}
</style>
