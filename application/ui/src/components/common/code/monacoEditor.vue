<template>
  <div
    class="monaco-editor-container flex flex-column"
    :class="{ 'monaco-editor-fullscreen': fullscreen }"
    :style="{ height: height }"
  >
    <div class="monaco-editor-header flex-space-between flex-v-center p-m" :style="headerStyle">
      <span class="monaco-editor-header-title text-m">
        Lang: {{ language.toUpperCase() }}
      </span>
      <div class="monaco-editor-header-actions flex-v-center">
        <div class="wfa-input">
          <input type="checkbox" id="theme" :checked="_theme === 'vs-dark'" @change="changeTheme" />
        </div>
        <button
          class="btn btn-icon"
          @click="fullscreen = !fullscreen"
          :class="{ 'monaco-editor-header-expand-active': fullscreen }"
        >
          <i v-if="!fullscreen" class="pi pi-expand"></i>
          <i v-else class="pi pi-window-minimize"></i>
        </button>
      </div>
    </div>
    <div ref="editorContainer" class="monaco-editor flex-grow"></div>
  </div>
</template>

<script>
import { MonacoEditor } from "./monaco";
export default {
  name: "MonacoEditor",
  props: {
    value: {
      type: String,
      required: true,
      default: "",
    },
    language: {
      type: String,
      default: "javascript",
    },
    theme: {
      type: String,
      default: "vs-dark",
    },
    options: {
      type: Object,
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
      monacoInstance: null,
      dispose: null,
      _theme: this.theme || localStorage.getItem("monaco-theme") || "vs-dark",
      fullscreen: false,
    };
  },
  computed: {
    _options() {
      return {
        automaticLayout: true,
        minimap: {
          enabled: false,
        },
        readOnly: this.readOnly,
        scrollBeyondLastLine: false,
        lineNumbersMinChars: 3,
        ...this.options,
      };
    },
    headerStyle() {
      return {
        backgroundColor: this._theme === "vs-dark" ? "#1e1e1e" : "#ffffff",
        color: this._theme === "vs-dark" ? "#ffffff" : "#000000",
      };
    },
  },
  methods: {
    changeTheme(e) {
      this._theme = e.target.checked ? "vs-dark" : "vs";
      localStorage.setItem("monaco-theme", this._theme);
      this.monacoInstance.changeTheme(this._theme);
    },
  },
  mounted() {
    this.monacoInstance = new MonacoEditor(this.$refs.editorContainer, {
      value: this.value,
      language: this.language,
      theme: this._theme,
      readOnly: this.readOnly,
      ...this._options,
      onChange: (value) => {
        this.$emit("onChange", value);
      },
    });
  },
  beforeDestroy() {
    if (this.monacoInstance) {
      this.monacoInstance.dispose();
    }
  },
};
</script>

<style scoped>
.monaco-editor-container {
  width: 100%;
  height: 100%;
}
.monaco-editor-container.monaco-editor-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.monaco-editor-header {
  border-bottom: 1px solid var(--color-light);
}
</style>
