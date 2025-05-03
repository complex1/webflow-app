<template>
  <div class="variable-node">
    <Handle
      v-if="variable.formStore"
      :key="variable.id"
      type="target"
      :position="Position.Left"
      :id="variable.id"
      :style="{
        top: '10px',
        transform: 'translateY(-50%)',
        left: '-10px',
      }"
    />
    <span class="text-s text-secondary flex-v-center">
      <span class="px-s">
        {{ variable.name }}
      </span>
      <popover :tooltip="true">
        <template #target>
          <small class="pi pi-info-circle cursor-pointer"></small>
        </template>
        <template #content>
          <div class="text-s">
            <strong>Description:</strong> {{ variable.description }}
            <br />
            <strong>Type:</strong> {{ variable.type }}
            <br />
            <strong>Default Value:</strong> {{ variable.defaultValue }}
            <br />
            <strong>Required:</strong> {{ variable.required ? "Yes" : "No" }}
          </div>
        </template>
      </popover>
    </span>
  </div>
</template>

<script>
import Variable from "../../../classes/Variable";
import { Position, Handle } from "@vue-flow/core";
import Popover from '../../common/popover.vue';
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
  },
  data() {
    return {
      Position: Position,
    };
  },
  methods: {},
};
</script>

<style scoped>
.variable-node {
  position: relative;
}
</style>
