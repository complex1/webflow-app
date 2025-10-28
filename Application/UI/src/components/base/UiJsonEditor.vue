<template>
  <div class="ui-json-editor" :class="editorClasses">
    <div v-if="label" class="editor-label">
      <label :for="editorId" class="label-text">
        {{ label }}
        <span v-if="required" class="required-indicator">*</span>
      </label>
      <div class="label-actions">
        <button
          v-if="showFormatButton"
          type="button"
          class="action-button format-button"
          @click="formatJson"
          :disabled="!isValidJson || isLoading"
          title="Format JSON (Ctrl+Shift+F)"
        >
          <i class="fas fa-magic"></i>
          Format
        </button>

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
        <span class="loading-text">Loading JSON editor...</span>
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
        <span class="language-info">JSON</span>
        <span v-if="jsonSize" class="json-size">
          Size: {{ jsonSize }}
        </span>
      </div>
      
      <div class="footer-actions">
        <button
          v-if="showClearButton"
          type="button"
          class="action-button clear-button"
          @click="clearContent"
          :disabled="!stringValue.trim() || isLoading"
          title="Clear content"
        >
          <i class="fas fa-trash"></i>
          Clear
        </button>
        <button
          v-if="showCopyButton"
          type="button"
          class="action-button copy-button"
          @click="copyToClipboard"
          :disabled="!stringValue.trim() || isLoading"
          title="Copy to clipboard"
        >
          <i class="fas fa-copy"></i>
          Copy
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { linter, lintGutter, type Diagnostic } from '@codemirror/lint'

// Props
interface Props {
  modelValue: string | object | any[]
  label?: string
  placeholder?: string
  height?: number
  theme?: 'light' | 'dark'
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: string | boolean
  errorMessage?: string
  showFooter?: boolean
  showLineCount?: boolean
  showCharCount?: boolean
  showFormatButton?: boolean
  showClearButton?: boolean
  showCopyButton?: boolean
  autoValidate?: boolean
  formatOnBlur?: boolean
  strictMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: 200,
  theme: 'light',
  disabled: false,
  readonly: false,
  required: false,
  showFooter: true,
  showLineCount: true,
  showCharCount: true,
  showFormatButton: true,
  showClearButton: false,
  showCopyButton: false,
  autoValidate: true,
  formatOnBlur: false,
  strictMode: false
})

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | object | any[]): void
  (e: 'change', value: string | object | any[]): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
  (e: 'validation', isValid: boolean, error?: string): void
  (e: 'format', formatted: string): void
}>()

// Template refs
const editorContainer = ref<HTMLElement>()

// State
const editorView = ref<EditorView>()
const isLoading = ref(true)
const error = ref<string>('')
const validationError = ref<string>('')
const isValidJson = ref(true)
const editorId = `json-editor-${Math.random().toString(36).substr(2, 9)}`

// Convert between string and object formats
const stringValue = computed(() => {
  if (typeof props.modelValue === 'string') {
    return props.modelValue
  }
  try {
    return JSON.stringify(props.modelValue, null, 2)
  } catch {
    return ''
  }
})

const isInputObject = computed(() => {
  return typeof props.modelValue !== 'string'
})

// Computed properties
const editorClasses = computed(() => ({
  'disabled': props.disabled,
  'readonly': props.readonly,
  'has-error': props.error || validationError.value,
  'theme-dark': props.theme === 'dark',
  'theme-light': props.theme === 'light'
}))

const containerClasses = computed(() => ({
  'loading': isLoading.value,
  'has-error': error.value || validationError.value
}))

const lineCount = computed(() => {
  if (!editorView.value) return 0
  return editorView.value.state.doc.lines
})

const charCount = computed(() => {
  return stringValue.value.length
})

const jsonSize = computed(() => {
  if (!stringValue.value.trim()) return null
  const bytes = new Blob([stringValue.value]).size
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
})

// JSON validation function
const validateJsonContent = (content: string): { isValid: boolean; error?: string } => {
  if (!content.trim()) {
    return { isValid: true }
  }

  try {
    JSON.parse(content)
    return { isValid: true }
  } catch (e) {
    const error = e as Error
    let message = error.message
    
    // Try to extract line and column information
    const match = message.match(/at position (\d+)/)
    if (match && match[1]) {
      const position = parseInt(match[1])
      const lines = content.substring(0, position).split('\n')
      const line = lines.length
      const lastLine = lines[lines.length - 1]
      const column = lastLine ? lastLine.length + 1 : 1
      message = `${message} (Line ${line}, Column ${column})`
    }
    
    return { isValid: false, error: message }
  }
}

// JSON linter for CodeMirror
const jsonLinter = linter((view) => {
  const diagnostics: Diagnostic[] = []
  const content = view.state.doc.toString()
  
  if (!content.trim()) return diagnostics
  
  const validation = validateJsonContent(content)
  if (!validation.isValid && validation.error) {
    // Try to get position information for better error highlighting
    try {
      JSON.parse(content)
    } catch (e) {
      const error = e as any
      const message = error.message || 'Invalid JSON'
      
      // Default to highlighting the entire document if we can't get specific position
      let from = 0
      let to = content.length
      
      // Try to extract position from error message
      const positionMatch = message.match(/at position (\d+)/)
      if (positionMatch) {
        const position = Math.min(parseInt(positionMatch[1]), content.length)
        from = Math.max(0, position - 1)
        to = Math.min(content.length, position + 1)
      }
      
      diagnostics.push({
        from,
        to,
        severity: 'error',
        message: validation.error || 'Invalid JSON syntax'
      })
    }
  }
  
  return diagnostics
})

// Initialize CodeMirror
const initializeEditor = async () => {
  if (!editorContainer.value) return

  try {
    isLoading.value = true
    error.value = ''

    const extensions = [
      basicSetup,
      json(),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const newValue = update.state.doc.toString()
          
          // If the original modelValue was an object, try to parse and emit object
          if (isInputObject.value) {
            try {
              const parsed = JSON.parse(newValue)
              emit('update:modelValue', parsed)
              emit('change', parsed)
            } catch {
              // If parsing fails, emit the string anyway to show the error
              emit('update:modelValue', newValue)
              emit('change', newValue)
            }
          } else {
            emit('update:modelValue', newValue)
            emit('change', newValue)
          }
          
          if (props.autoValidate) {
            validateJson()
          }
        }
      }),
      EditorView.domEventHandlers({
        blur: (event) => {
          emit('blur', event as FocusEvent)
          if (props.formatOnBlur && isValidJson.value) {
            formatJson()
          }
        },
        focus: (event) => emit('focus', event as FocusEvent)
      }),
      EditorState.readOnly.of(props.readonly || props.disabled)
    ]

    // Add theme
    if (props.theme === 'dark') {
      extensions.push(oneDark)
    }

    // Add linting
    extensions.push(lintGutter(), jsonLinter)

    // Add key bindings
    extensions.push(EditorView.domEventHandlers({
      keydown: (event) => {
        // Format shortcut: Ctrl+Shift+F (Cmd+Shift+F on Mac)
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'F') {
          event.preventDefault()
          formatJson()
          return true
        }
        return false
      }
    }))

    const state = EditorState.create({
      doc: stringValue.value,
      extensions
    })

    editorView.value = new EditorView({
      state,
      parent: editorContainer.value
    })

    // Initial validation
    if (props.autoValidate) {
      await nextTick()
      validateJson()
    }

  } catch (e) {
    console.error('Failed to initialize JSON editor:', e)
    error.value = 'Failed to initialize editor'
  } finally {
    isLoading.value = false
  }
}

// Update editor content when modelValue changes
watch(() => stringValue.value, (newValue) => {
  if (editorView.value && editorView.value.state.doc.toString() !== newValue) {
    editorView.value.dispatch({
      changes: {
        from: 0,
        to: editorView.value.state.doc.length,
        insert: newValue
      }
    })
  }
})

// Watch for readonly/disabled changes
watch([() => props.readonly, () => props.disabled], () => {
  if (editorView.value) {
    // Recreate the editor with new readonly state
    const currentValue = editorView.value.state.doc.toString()
    editorView.value.destroy()
    
    nextTick(() => {
      initializeEditor()
    })
  }
})

// Methods
const validateJson = () => {
  const validation = validateJsonContent(stringValue.value)
  isValidJson.value = validation.isValid
  validationError.value = validation.error || ''
  
  emit('validation', validation.isValid, validation.error)
}

const formatJson = () => {
  if (!isValidJson.value || !stringValue.value.trim()) return

  try {
    const parsed = JSON.parse(stringValue.value)
    const formatted = JSON.stringify(parsed, null, 2)
    
    if (editorView.value) {
      editorView.value.dispatch({
        changes: {
          from: 0,
          to: editorView.value.state.doc.length,
          insert: formatted
        }
      })
    }
    
    emit('format', formatted)
  } catch (e) {
    console.error('Failed to format JSON:', e)
  }
}

const clearContent = () => {
  if (editorView.value) {
    editorView.value.dispatch({
      changes: {
        from: 0,
        to: editorView.value.state.doc.length,
        insert: ''
      }
    })
  }
}

const copyToClipboard = async () => {
  if (!stringValue.value.trim()) return
  
  try {
    await navigator.clipboard.writeText(stringValue.value)
  } catch (e) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = stringValue.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

const focus = () => {
  editorView.value?.focus()
}

const blur = () => {
  editorView.value?.contentDOM.blur()
}

// Expose methods
defineExpose({
  focus,
  blur,
  validateJson,
  formatJson,
  clearContent,
  copyToClipboard
})

// Lifecycle
onMounted(() => {
  initializeEditor()
})

onUnmounted(() => {
  editorView.value?.destroy()
})
</script>

<style scoped>
.ui-json-editor {
  width: 100%;
  background-color: var(--color-background);
}

.editor-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.label-text {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.required-indicator {
  color: var(--color-error);
  margin-left: var(--spacing-xs);
}

.label-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-gray-300);
  color: var(--color-text-primary);
  background: var(--color-background-primary);
  transition: var(--transition-fast);
  cursor: pointer;
}

.action-button:hover:not(:disabled) {
  background: var(--color-gray-100);
  border-color: var(--color-gray-400);
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.format-button:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.editor-container {
  position: relative;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: var(--transition-fast);
}

.editor-container.has-error {
  border-color: var(--color-error);
}

.editor-container.loading {
  background: var(--color-gray-100);
}

.codemirror-wrapper {
  width: 100%;
}

.editor-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 10;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-primary);
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: var(--spacing-sm);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.editor-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(254, 242, 242, 0.9);
  color: var(--color-error);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  gap: var(--spacing-sm);
  z-index: 10;
}

.editor-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--color-gray-200);
}

.footer-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.footer-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.clear-button:hover:not(:disabled) {
  border-color: var(--color-error);
  color: var(--color-error);
  background: rgba(254, 242, 242, 0.5);
}

.copy-button:hover:not(:disabled) {
  border-color: var(--color-gray-500);
  color: var(--color-text-primary);
  background: var(--color-gray-200);
}

.theme-dark .editor-container {
  background: var(--color-background-secondary);
}

.theme-light .editor-container {
  background: var(--color-background-primary);
}

.disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* CodeMirror overrides */
:deep(.cm-editor) {
  outline: none !important;
}

:deep(.cm-focused) {
  outline: none !important;
}

:deep(.cm-editor.cm-focused) {
  outline: none !important;
}

:deep(.cm-content) {
  outline: none !important;
  padding: var(--spacing-md);
}

:deep(.cm-lint-marker-error) {
  background: var(--color-error) !important;
}

:deep(.cm-diagnostic-error) {
  border-left: 4px solid var(--color-error) !important;
}

:deep(.cm-tooltip.cm-tooltip-lint) {
  background: var(--color-background-primary) !important;
  border: 1px solid var(--color-gray-300) !important;
  box-shadow: var(--shadow-md) !important;
}
</style>
