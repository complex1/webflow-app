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
    readOnly: {
      type: Boolean,
      default: false,
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
  gap: 6pt;
}

.json-editor textarea {
  width: 100%;
  height: 150pt;
  padding: 6pt;
  font-family: monospace;
  font-size: 10.5pt;
  border: 0.75pt solid var(--color-border);
  border-radius: 3pt;
  outline: none;
  resize: vertical;
}

.json-editor textarea:focus {
  border-color: var(--color-primary);
}

.error {
  color: var(--color-danger);
  font-size: 9pt;
}
</style>