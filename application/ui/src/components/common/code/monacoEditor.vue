<template>
  <div class="monaco-editor-container" ref="editorContainer" :style="{ height: height }"></div>
</template>

<script>
const monaco = window.monaco;

export default {
  name: 'MonacoEditor',
  props: {
    value: {
      type: String,
      required: true,
      default: '',
    },
    language: {
      type: String,
      default: 'javascript',
    },
    theme: {
      type: String,
      default: 'vs-dark',
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    height: {
      type: String,
      default: '100%',
    },
  },
  data() {
    return {
      dispose: null,
    };
  },
  computed: {
    _options() {
      return {
        automaticLayout: true,
        minimap: {
          enabled: false,
        },
        scrollBeyondLastLine: false,
        lineNumbersMinChars: 3,
        ...this.options,
      }
    }
  },
  mounted() {
    const editor = monaco.editor.create(this.$refs.editorContainer, {
      value: this.value,
      language: this.language,
      theme: this.theme,
      ...this._options,
    });
    window.editor = editor; // For debugging purposes
    this.dispose = editor.dispose;
    editor.onDidChangeModelContent(() => {
      this.$emit('onChange', editor.getValue());
    });
  },
  beforeDestroy() {
    if (this.dispose) {
      this.dispose();
    }
  },
};
</script>

<style scoped>
.monaco-editor-container {
  width: 100%;
  height: 100%;
}
</style>