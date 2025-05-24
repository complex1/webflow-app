<template>
  <div class="variable-node">
    <Handle
      v-if="variable.formStore"
      :key="variable.id"
      type="target"
      :position="Position.Left"
      :id="variable.id"
      :style="{
        top: '9px',
        transform: 'translateY(-50%)',
        left: '0px',
        height: '5px',
        width: '5px',
        background: 'var(--color-text-secondary)',
        borderRadius: '50%',
      }"
    />
    <span class="text-s opacity-50 gap-s text-600 flex-v-center">
      <span class="pl-m">
        {{ variable.name }}
      </span>
      <popover @open="loadValue">
        <template #target>
          <small class="pi pi-info-circle cursor-pointer"></small>
        </template>
        <template #content>
          <div class="text-m bg-white p-s round-1">
            <span v-if="noValue" class="text-danger">No value</span>
            <span v-else-if="dataType !== 'object'">
              {{ value }}
            </span>
            <div v-else style="width: 400px; height: 200px">
              <json-editor :modelValue="value" :readOnly="true" />
            </div>
          </div>
        </template>
      </popover>
    </span>
  </div>
</template>

<script>
import Variable from "../../../classes/Variable";
import { Position, Handle } from "@vue-flow/core";
import Popover from "../../common/popover.vue";
import JsonEditor from "../../common/code/jsonEditor.vue";
import { mapState } from 'vuex';
export default {
  props: {
    variable: {
      type: Variable,
      required: true,
    },
  },
  components: {
    Handle,
    Popover,
    JsonEditor,
  },
  data() {
    return {
      Position: Position,
      value: this.variable.get(),
    };
  },
  computed: {
    ...mapState({
      workflow: (state) => state.workflowModule.workflow,
    }),
    noValue() {
      return (
        this.value === undefined ||
        this.value === null
      );
    },
    dataType() {
      return typeof this.value;
    },
  },
  methods: {
    loadValue() {
      this.value = this.variable.get(this.workflow.globalStore);
    },
  },
  watch: {
    variable: {
      handler() {
        this.loadValue();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.variable-node {
  position: relative;
}
</style>
