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
          <input type="checkbox" id="theme" :checked="editorTheme === 'vs-dark'" @change="changeTheme" />
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

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount, PropType } from 'vue';
import { MonacoEditor } from "./monaco";

export default defineComponent({
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
      type: Object as PropType<Record<string, any>>,
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
  emits: ['onChange'],
  setup(props, { emit }) {
    const monacoInstance = ref<any>(null);
    const editorContainer = ref<HTMLElement | null>(null);
    const storedTheme = localStorage.getItem("monaco-theme") || "vs-dark";
    const editorTheme = ref<string>(props.theme || storedTheme);
    const fullscreen = ref<boolean>(false);
    
    const editorOptions = computed(() => {
      return {
        automaticLayout: true,
        minimap: {
          enabled: false,
        },
        readOnly: props.readOnly,
        scrollBeyondLastLine: false,
        lineNumbersMinChars: 3,
        ...props.options,
      };
    });
    
    const headerStyle = computed(() => {
      return {
        backgroundColor: editorTheme.value === "vs-dark" ? "#1e1e1e" : "#ffffff",
        color: editorTheme.value === "vs-dark" ? "#ffffff" : "#000000",
      };
    });
    
    const changeTheme = (e: Event) => {
      const target = e.target as HTMLInputElement;
      editorTheme.value = target.checked ? "vs-dark" : "vs";
      localStorage.setItem("monaco-theme", editorTheme.value);
      if (monacoInstance.value) {
        monacoInstance.value.changeTheme(editorTheme.value);
      }
    };
    
    onMounted(() => {
      if (editorContainer.value) {
        monacoInstance.value = new MonacoEditor(editorContainer.value, {
          value: props.value,
          language: props.language,
          theme: editorTheme.value,
          readOnly: props.readOnly,
          ...editorOptions.value,
          onChange: (value: string) => {
            emit("onChange", value);
          },
        });
      }
    });
    
    onBeforeUnmount(() => {
      if (monacoInstance.value) {
        monacoInstance.value.dispose();
      }
    });
    
    return {
      editorContainer,
      editorTheme,
      fullscreen,
      headerStyle,
      changeTheme,
    };
  },
});
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
