<template>
  <monaco-editor
    ref="monacoEditor"
    :value="jsString"
    @onChange="onChange"
    language="javascript"
    theme="vs-dark"
    :options="{ automaticLayout: true }"
    :height="height"
    :readOnly="readOnly"
  ></monaco-editor>
</template>

<script>
import monacoEditor from "./monacoEditor.vue";
export default {
  components: { monacoEditor },
  name: "JsEditor",
  props: {
    modelValue: {
      type: String,
      required: true,
      default: () => ({}),
    },
    height: {
      type: String,
      default: "100%",
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      jsString: this.modelValue, // Bind v-model to jsString
    };
  },
  methods: {
    onChange(value) {
      this.jsString = value;
      this.$emit("update:modelValue", value);
    },
  },
  created() {
    this.jsString = this.modelValue;
  },
};
</script>