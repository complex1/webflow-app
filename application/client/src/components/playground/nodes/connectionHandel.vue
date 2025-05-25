<template>
  <div>
    <Handle
      :key="`target-${id}`"
      type="target"
      :position="Position.Left"
      :id="id"
      :style="{
        top: '15px',
        transform: 'translateY(-50%)',
        left: '-5px',
        height: '6px',
        width: '6px',
        background: 'var(--color-success)',
        borderRadius: '50%',
        border: '1px solid rgba(255, 255, 255, 0.7)',
        boxShadow: '0 0 3px rgba(0, 0, 0, 0.2)',
        zIndex: 10
      }"
    />
    <Handle
      :key="`source-${id}`"
      type="source"
      :position="Position.Right"
      :id="id"
      :style="{
        top: '15px',
        transform: 'translateY(-50%)',
        right: '-5px',
        height: '6px',
        width: '6px',
        background: 'var(--color-primary)',
        borderRadius: '50%',
        border: '1px solid rgba(255, 255, 255, 0.7)',
        boxShadow: '0 0 3px rgba(0, 0, 0, 0.2)',
        zIndex: 10
      }"
    />
  </div>
</template>

<script>
import { Position, Handle } from "@vue-flow/core";
export default {
  name: "ConnectionHandle",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  components: {
    Handle,
  },
  data() {
    return {
      Position: Position,
    };
  },
};
</script>

<style>
</style>