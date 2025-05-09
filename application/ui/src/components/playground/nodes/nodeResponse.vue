<template>
  <div>
    <hr class="mt-s" />
    <div class="flex-v-center gap-s">
      <div class="text-s text-primary text-600 my-s">Response:</div>
    </div>
    <hr />
    <div class="http-node-res mt-m">
      <div v-if="!nodeData.executionDone">Node is not executed yet.</div>
      <div v-else>
        <div>
          <strong class="text-s font-400 opacity-50">Execution Status:</strong>
          <span
            class="text-s pl-m"
            :style="{
              color: nodeData.hasError
                ? 'var(--color-danger)'
                : 'var(--color-success)',
            }"
          >
            {{ nodeData.hasError ? "Errored" : "Success" }}
          </span>
        </div>
        <div>
          <span>
            <strong class="text-s font-400 opacity-50">Response Time:</strong>
            <span class="text-s opacity-70 pl-m">
              {{ nodeData.executionTime }}ms
            </span>
          </span>
        </div>
        <popover :tooltip="false">
          <template #target>
            <div>
              <span>
                <strong class="text-s font-400 opacity-50 pr-m">
                  Response:</strong
                >
                <span class="text-s text-info text-500 cursor-pointer">
                  <small>View Data</small>
                </span>
              </span>
            </div>
          </template>
          <template #content>
            <node-state :node="nodeData" />
          </template>
        </popover>
      </div>
    </div>
  </div>
</template>

<script>
import popover from "../../common/popover.vue";
import NodeState from "./nodeState.vue";
export default {
  components: { popover, NodeState },
  name: "NodeResponse",
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
  methods: {},
};
</script>

<style></style>
