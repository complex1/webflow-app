<template>
  <div class="functional-node bg-white shadow-1 round-1">
    <connection-handel :id="nodeData.id"></connection-handel>
    <node-header :nodeData="nodeData" />
  </div>
</template>

<script>
import ConnectionHandel from "./connectionHandel.vue";
import NodeHeader from "./nodeHeader.vue";
export default {
  name: "FunctionalNode",
  components: {
    ConnectionHandel,
    NodeHeader,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      nodeData: {
        id: "7",
        name: "shuabhm",
        description: "e rwf wer f wer fw ",
        type: "HTTP",
        nodeStatus: "INACTIVE",
        nodeData: {
          name: "shuabhm",
          age: 20,
          gender: "unknown",
          description: "",
        },
        executing: false,
        hasError: false,
        errorMessage: null,
        parameters: [
          {
            id: "1",
            name: "pathParam",
            description: " wfcwer fqw er",
            defaultValue: null,
            type: "string",
            formStore: true,
            required: false,
          },
        ],
        transform: 'return { "name": "shuabhm", "age": 20 }',
      },
    };
  },
  methods: {

  },
};
</script>

<style>
.functional-node {
  min-width: 300px;
  filter: drop-shadow(var(--shadow-drop));
}
</style>