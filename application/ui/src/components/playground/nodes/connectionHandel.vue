<template>
  <div>
    <Handle
      :key="id"
      type="target"
      :position="Position.Left"
      :id="id"
      :style="{
        top: '15px',
        transform: 'translateY(-50%)',
        left: '-5px',
        height: '5px',
        width: '5px',
        background: 'var(--color-success)',
        borderRadius: '50%',
      }"
    />
    <Handle
      :key="id"
      type="source"
      :position="Position.Right"
      :id="id"
      :style="{
        top: '15px',
        transform: 'translateY(-50%)',
        right: '-5px',
        height: '5px',
        width: '5px',
        background: 'var(--color-primary)',
        borderRadius: '50%',
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