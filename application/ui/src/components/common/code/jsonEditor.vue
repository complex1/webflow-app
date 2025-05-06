<template>
  <monaco-editor
    ref="monacoEditor"
    :value="jsonString"
    @onChange="onChange"
    language="json"
    theme="vs-dark"
    :options="{ automaticLayout: true }"
    :height="height"
  ></monaco-editor>
</template>

<script>
import monacoEditor from "./monacoEditor.vue";
export default {
  components: { monacoEditor },
  name: "JsonEditor",
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
  },
  data() {
    return {
      jsonString: this.modelValue, // Bind v-model to jsonString
    };
  },
  methods: {
    toString(value) {
      return JSON.stringify(value, null, 2);
    },
    toJson(value) {
      return JSON.parse(value);
    },
    onChange(value) {
      try {
        this.jsonString = value;
        this.$emit("update:modelValue", JSON.parse(value));
      } catch (e) {}
    },
  },
  created() {
    this.jsonString = this.toString(this.modelValue);
  },
};
</script>

<style scoped>
.json-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.json-editor textarea {
  width: 100%;
  height: 200px;
  padding: 8px;
  font-family: monospace;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  resize: vertical;
}

.json-editor textarea:focus {
  border-color: #007aff;
}

.error {
  color: #d9534f;
  font-size: 12px;
}
</style>