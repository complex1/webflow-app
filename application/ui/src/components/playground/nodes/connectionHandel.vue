<template>
  <div>
     <Handle
      :key="id"
      type="target"
      :position="Position.Left"
      :id="id"
      :style="{
        top: '10px',
        transform: 'translateY(-50%)',
        left: '-5px',
      }"
    />
    <Handle
        :key="id"
        type="source"
        :position="Position.Right"
        :id="id"
        :style="{
            top: '10px',
            transform: 'translateY(-50%)',
            right: '-5px',
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

}
</script>

<style>

</style>