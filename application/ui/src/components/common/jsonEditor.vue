<template>
    <textarea v-model="jsonString" @input="onInput" placeholder="Enter JSON here..."></textarea>
</template>

<script>
export default {
  name: "JsonEditor",
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      jsonString: this.modelValue,
      error: null,
    };
  },
  watch: {
    modelValue(newValue) {
      this.jsonString = newValue;
    },
  },
  methods: {
    onInput() {
      try {
        JSON.parse(this.jsonString);
        this.error = null;
        this.$emit("update:modelValue", this.jsonString);
        this.$emit("change", this.jsonString);
      } catch (e) {
        this.error = "Invalid JSON format";
      }
    },
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