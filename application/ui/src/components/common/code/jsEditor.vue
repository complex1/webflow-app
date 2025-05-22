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

<script lang="ts">
import { defineComponent, ref, onMounted, watch, PropType } from 'vue';
import monacoEditor from "./monacoEditor.vue";

export default defineComponent({
  components: { monacoEditor },
  name: "JsEditor",
  props: {
    modelValue: {
      type: String as PropType<string>,
      required: true,
      default: '',
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
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    // Use primitive ref instead of reactive object to avoid proxy issues
    const jsString = ref<string>(props.modelValue || '');
    
    const onChange = (value: string) => {
      try {
        // Create a clean value to break reactivity chain
        const cleanValue = String(value || '');
        jsString.value = cleanValue;
        
        // Use setTimeout to avoid potential reactivity issues
        setTimeout(() => {
          emit("update:modelValue", cleanValue);
        }, 0);
      } catch (error) {
        console.error('Error in jsEditor change handler:', error);
      }
    };
    
    // Watch for external changes to modelValue
    watch(() => props.modelValue, (newValue) => {
      if (newValue !== jsString.value) {
        jsString.value = newValue || '';
      }
    });
    
    onMounted(() => {
      jsString.value = props.modelValue || '';
    });
    
    return {
      jsString,
      onChange
    };
  },
});
</script>