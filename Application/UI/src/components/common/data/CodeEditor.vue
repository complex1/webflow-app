<template>
  <div
    class="af-code-editor"
    ref="editorRef"
    :style="{
      minHeight: props.minHeight,
      maxHeight: props.maxHeight
    }"
  ></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import { EditorView } from "@codemirror/view";
import { EditorState, type Extension } from "@codemirror/state";
import { basicSetup } from "codemirror";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    extensions?: Extension[];
    readOnly?: boolean;
    minHeight?: string;
    maxHeight?: string;
  }>(),
  {
    modelValue: "",
    minHeight: "200px",
    maxHeight: "400px",
  }
);

const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>();

const editorRef = ref<HTMLDivElement | null>(null);
const view = ref<EditorView | null>(null);

const createEditor = () => {
  if (!editorRef.value) return;
  view.value = new EditorView({
    state: EditorState.create({
      doc: props.modelValue,
      extensions: [
        basicSetup,
        EditorView.theme({
          "&": {
            backgroundColor: "var(--bg-elevated)",
            color: "var(--text-primary)",
          },
          ".cm-content": { fontFamily: "var(--font-mono)", fontSize: "13px" },
        }),
        EditorView.editable.of(!props.readOnly),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            emit("update:modelValue", update.state.doc.toString());
          }
        }),
        ...(props.extensions || []),
      ],
    }),
    parent: editorRef.value,
  });
};

onMounted(() => {
  createEditor();
});

onBeforeUnmount(() => {
  view.value?.destroy();
});

watch(
  () => props.modelValue,
  (value) => {
    const current = view.value?.state.doc.toString();
    if (value !== undefined && current !== value) {
      view.value?.dispatch({
        changes: { from: 0, to: view.value.state.doc.length, insert: value },
      });
    }
  }
);
</script>

<style scoped>
.af-code-editor {
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  background: var(--bg-elevated);
}

.af-code-editor :deep(.cm-editor) {
  border-radius: var(--radius-md);
}
</style>
