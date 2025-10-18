<template>
  <div class="ui-codemirror-editor" :class="editorClasses">
    <div v-if="label" class="editor-label">
      <label :for="editorId" class="label-text">
        {{ label }}
        <span v-if="required" class="required-indicator">*</span>
      </label>
      <div v-if="actions" class="label-actions">
        <slot name="actions" />
      </div>
    </div>
    
    <div class="editor-container" :class="containerClasses">
      <div
        :id="editorId"
        ref="editorContainer"
        class="codemirror-wrapper"
        :style="{ height: `${height}px` }"
      ></div>
      
      <!-- Loading overlay -->
      <div v-if="isLoading" class="editor-loading">
        <div class="loading-spinner"></div>
        <span class="loading-text">Loading editor...</span>
      </div>
      
      <!-- Error overlay -->
      <div v-if="error" class="editor-error">
        <i class="fas fa-exclamation-triangle"></i>
        <span>{{ error }}</span>
      </div>
    </div>
    
    <!-- Footer with info and actions -->
    <div v-if="showFooter" class="editor-footer">
      <div class="footer-info">
        <span v-if="showLineCount" class="line-count">
          Lines: {{ lineCount }}
        </span>
        <span v-if="showCharCount" class="char-count">
          Characters: {{ charCount }}
        </span>
        <span v-if="currentLanguage" class="language-info">
          {{ currentLanguage.toUpperCase() }}
        </span>
      </div>
      
      <div class="footer-actions">
        <button
          v-if="showFormatButton"
          type="button"
          class="format-btn"
          @click="formatCode"
          :disabled="!canFormat"
        >
          <i class="fas fa-magic"></i>
          Format
        </button>
        
        <button
          v-if="showFullscreenButton"
          type="button"
          class="fullscreen-btn"
          @click="toggleFullscreen"
        >
          <i :class="isFullscreen ? 'fas fa-compress' : 'fas fa-expand'"></i>
        </button>
      </div>
    </div>
    
    <!-- Validation messages -->
    <div v-if="errorMessage || hint" class="editor-messages">
      <div v-if="errorMessage" class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        {{ errorMessage }}
      </div>
      <div v-if="hint && !errorMessage" class="hint-message">
        <i class="fas fa-info-circle"></i>
        {{ hint }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';

// Types
interface Props {
  modelValue?: string;
  language?: string;
  theme?: 'light' | 'dark';
  height?: number;
  width?: number | string;
  label?: string;
  hint?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  showLineCount?: boolean;
  showCharCount?: boolean;
  showFooter?: boolean;
  showFormatButton?: boolean;
  showFullscreenButton?: boolean;
  actions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  language: 'javascript',
  theme: 'light',
  height: 300,
  width: '100%',
  showLineCount: true,
  showCharCount: true,
  showFooter: true,
  showFormatButton: true,
  showFullscreenButton: true,
});

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string];
  'change': [value: string];
  'focus': [];
  'blur': [];
  'ready': [editor: EditorView];
}>();

// Reactive state
const editorContainer = ref<HTMLElement>();
const isLoading = ref(true);
const error = ref<string>('');
const isFullscreen = ref(false);
const editorId = ref(`codemirror-editor-${Math.random().toString(36).substr(2, 9)}`);

let editor: EditorView | null = null;

// Computed properties
const editorClasses = computed(() => ({
  'ui-codemirror-editor--disabled': props.disabled,
  'ui-codemirror-editor--readonly': props.readonly,
  'ui-codemirror-editor--error': !!props.errorMessage,
  'ui-codemirror-editor--fullscreen': isFullscreen.value,
}));

const containerClasses = computed(() => ({
  'editor-container--loading': isLoading.value,
  'editor-container--error': !!error.value,
}));

const lineCount = computed(() => {
  if (!editor) return 0;
  return editor.state.doc.lines;
});

const charCount = computed(() => {
  return props.modelValue.length;
});

const currentLanguage = computed(() => {
  return props.language;
});

const canFormat = computed(() => {
  return ['javascript', 'typescript', 'json', 'html', 'css'].includes(props.language);
});

// Language extension mapping
const getLanguageExtension = (language: string) => {
  switch (language) {
    case 'javascript':
    case 'typescript':
      return javascript();
    case 'json':
      return json();
    case 'html':
      return html();
    case 'css':
    case 'scss':
    case 'less':
      return css();
    default:
      return javascript(); // Default fallback
  }
};

// Methods
const initializeEditor = async () => {
  if (!editorContainer.value) return;

  try {
    isLoading.value = true;
    error.value = '';

    await nextTick();

    // Create extensions array
    const extensions = [
      basicSetup,
      getLanguageExtension(props.language),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const value = update.state.doc.toString();
          emit('update:modelValue', value);
          emit('change', value);
        }
      }),
      EditorView.theme({
        '&': {
          fontSize: '14px',
        },
        '.cm-content': {
          padding: '10px',
          minHeight: `${props.height - 20}px`,
        },
        '.cm-focused': {
          outline: 'none',
        },
        '.cm-editor': {
          borderRadius: '6px',
        },
      }),
    ];

    // Add dark theme if specified
    if (props.theme === 'dark') {
      extensions.push(oneDark);
    }

    // Add readonly state
    if (props.readonly || props.disabled) {
      extensions.push(EditorState.readOnly.of(true));
    }

    // Create the editor state
    const state = EditorState.create({
      doc: props.modelValue || '',
      extensions,
    });

    // Create the editor view
    editor = new EditorView({
      state,
      parent: editorContainer.value,
    });

    // Focus the editor
    editor.focus();

    isLoading.value = false;
    emit('ready', editor);
  } catch (err) {
    error.value = 'Failed to initialize editor';
    isLoading.value = false;
  }
};

const formatCode = async () => {
  if (!editor || !canFormat.value) return;

  try {
    const content = editor.state.doc.toString();
    let formatted = content;

    // Simple JSON formatting
    if (props.language === 'json') {
      try {
        const parsed = JSON.parse(content);
        formatted = JSON.stringify(parsed, null, 2);
      } catch (e) {
        return;
      }
    }

    // Update editor content
    if (formatted !== content) {
      editor.dispatch({
        changes: {
          from: 0,
          to: editor.state.doc.length,
          insert: formatted,
        },
      });
    }
  } catch (err) {
  }
};

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  
  nextTick(() => {
    if (editor) {
      // Trigger a resize
      editor.requestMeasure();
    }
  });
};

const focus = () => {
  editor?.focus();
};

const setValue = (value: string) => {
  if (editor) {
    editor.dispatch({
      changes: {
        from: 0,
        to: editor.state.doc.length,
        insert: value,
      },
    });
  }
};

const getValue = (): string => {
  return editor?.state.doc.toString() || '';
};

const dispose = () => {
  if (editor) {
    editor.destroy();
    editor = null;
  }
};

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (editor && newValue !== editor.state.doc.toString()) {
    editor.dispatch({
      changes: {
        from: 0,
        to: editor.state.doc.length,
        insert: newValue,
      },
    });
  }
});

watch(() => props.language, async (newLanguage) => {
  if (editor) {
    // Recreate editor with new language
    const currentValue = editor.state.doc.toString();
    dispose();
    await nextTick();
    await initializeEditor();
    setValue(currentValue);
  }
});

// Lifecycle
onMounted(() => {
  initializeEditor();
});

onBeforeUnmount(() => {
  dispose();
});

// Expose methods
defineExpose({
  focus,
  setValue,
  getValue,
  formatCode,
  toggleFullscreen,
  editor: () => editor,
});
</script>

<style scoped>
.ui-codemirror-editor {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
}

.ui-codemirror-editor--fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-modal);
  background: var(--color-background);
}

.ui-codemirror-editor--fullscreen .codemirror-wrapper {
  height: calc(100vh - 120px) !important;
}

.editor-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.label-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.required-indicator {
  color: var(--color-error);
}

.label-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.editor-container {
  position: relative;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-background);
  transition: border-color var(--transition-fast);
}

.editor-container:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.ui-codemirror-editor--error .editor-container {
  border-color: var(--color-error);
}

.ui-codemirror-editor--disabled .editor-container {
  opacity: 0.6;
  pointer-events: none;
}

.codemirror-wrapper {
  width: 100%;
  position: relative;
}

/* CodeMirror global styles */
:global(.cm-editor) {
  height: 100%;
}

:global(.cm-scroller) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.editor-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-background);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  z-index: 10;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.editor-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-error-light);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  color: var(--color-error);
  font-size: var(--font-size-sm);
  z-index: 10;
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-background-secondary);
  border-top: 1px solid var(--color-border);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.footer-info {
  display: flex;
  gap: var(--spacing-md);
}

.footer-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.format-btn,
.fullscreen-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-background);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
}

.format-btn:hover,
.fullscreen-btn:hover {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.format-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.editor-messages {
  margin-top: var(--spacing-sm);
}

.error-message,
.hint-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  padding: var(--spacing-xs);
}

.error-message {
  color: var(--color-error);
  background: var(--color-error-light);
  border-radius: var(--radius-sm);
}

.hint-message {
  color: var(--color-info);
  background: var(--color-info-light);
  border-radius: var(--radius-sm);
}

/* Dark theme adjustments */
[data-theme="dark"] .editor-container {
  background: var(--color-gray-800);
  border-color: var(--color-gray-700);
}

[data-theme="dark"] .editor-footer {
  background: var(--color-gray-700);
  border-color: var(--color-gray-600);
}

[data-theme="dark"] .format-btn,
[data-theme="dark"] .fullscreen-btn {
  background: var(--color-gray-600);
  border-color: var(--color-gray-500);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .ui-codemirror-editor--fullscreen .codemirror-wrapper {
    height: calc(100vh - 60px) !important;
  }

  .editor-footer {
    flex-direction: column;
    gap: var(--spacing-sm);
    text-align: center;
  }

  .footer-info {
    justify-content: center;
  }
}
</style>
