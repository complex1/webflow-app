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

<script lang="ts">
import { defineComponent, ref, PropType, onMounted } from 'vue';
import monacoEditor from "./monacoEditor.vue";

export default defineComponent({
  components: { monacoEditor },
  name: "JsonEditor",
  props: {
    modelValue: {
      type: [String, Object, Array] as PropType<string | object | any[]>,
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
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    // Define functions before using them
    const toString = (value: any): string => {
      try {
        return JSON.stringify(value, null, 2);
      } catch (e) {
        console.error('Error stringifying JSON:', e);
        return '{}';
      }
    };
    
    const jsonString = ref<string>(toString(props.modelValue));
    
    const toJson = (value: string): any => {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error('Error parsing JSON:', e);
        return {};
      }
    };
    
    const onChange = (value: string) => {
      try {
        jsonString.value = value;
        const parsedValue = JSON.parse(value);
        emit("update:modelValue", parsedValue);
        emit("change", parsedValue);
      } catch (e) {
        // Silent error handling for invalid JSON
      }
    };
    
    onMounted(() => {
      jsonString.value = toString(props.modelValue);
    });
    
    return {
      jsonString,
      toString,
      toJson,
      onChange
    };
  }
});
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