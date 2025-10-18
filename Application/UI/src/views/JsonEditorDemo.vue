<template>
  <div class="json-editor-demo">
    <div class="demo-header">
      <h1>JSON Editor Demo</h1>
      <p>Testing the JSON editor component with different v-model types</p>
    </div>

    <div class="demo-grid">
      <!-- String v-model -->
      <div class="demo-section">
        <h2>String v-model</h2>
        <p>Bind to a string variable:</p>
        
        <UiJsonEditor
          v-model="jsonString"
          label="JSON as String"
          :height="200"
          show-format-button
          show-copy-button
          @validation="onStringValidation"
        />
        
        <div class="demo-output">
          <h3>String Value:</h3>
          <pre>{{ jsonString }}</pre>
          <p><strong>Type:</strong> {{ typeof jsonString }}</p>
          <p><strong>Is Valid:</strong> {{ stringIsValid ? '✅' : '❌' }}</p>
        </div>
      </div>

      <!-- Object v-model -->
      <div class="demo-section">
        <h2>Object v-model</h2>
        <p>Bind to an object variable:</p>
        
        <UiJsonEditor
          v-model="jsonObject"
          label="JSON as Object"
          :height="200"
          show-format-button
          show-copy-button
          @validation="onObjectValidation"
        />
        
        <div class="demo-output">
          <h3>Object Value:</h3>
          <pre>{{ JSON.stringify(jsonObject, null, 2) }}</pre>
          <p><strong>Type:</strong> {{ typeof jsonObject }}</p>
          <p><strong>Is Valid:</strong> {{ objectIsValid ? '✅' : '❌' }}</p>
        </div>
      </div>

      <!-- Array v-model -->
      <div class="demo-section">
        <h2>Array v-model</h2>
        <p>Bind to an array variable:</p>
        
        <UiJsonEditor
          v-model="jsonArray"
          label="JSON as Array"
          :height="200"
          show-format-button
          show-copy-button
          @validation="onArrayValidation"
        />
        
        <div class="demo-output">
          <h3>Array Value:</h3>
          <pre>{{ JSON.stringify(jsonArray, null, 2) }}</pre>
          <p><strong>Type:</strong> {{ Array.isArray(jsonArray) ? 'array' : typeof jsonArray }}</p>
          <p><strong>Length:</strong> {{ Array.isArray(jsonArray) ? jsonArray.length : 'N/A' }}</p>
          <p><strong>Is Valid:</strong> {{ arrayIsValid ? '✅' : '❌' }}</p>
        </div>
      </div>
    </div>

    <div class="demo-actions">
      <button @click="resetData" class="demo-button">Reset All Data</button>
      <button @click="updateData" class="demo-button">Update with Sample Data</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UiJsonEditor } from '@/components/base'

// Reactive data
const jsonString = ref('{"name": "John", "age": 30}')
const jsonObject = ref<any>({
  title: "Sample Object",
  data: {
    items: [1, 2, 3],
    active: true
  }
})
const jsonArray = ref<any[]>([
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" }
])

// Validation states
const stringIsValid = ref(true)
const objectIsValid = ref(true)
const arrayIsValid = ref(true)

// Validation handlers
const onStringValidation = (isValid: boolean) => {
  stringIsValid.value = isValid
}

const onObjectValidation = (isValid: boolean) => {
  objectIsValid.value = isValid
}

const onArrayValidation = (isValid: boolean) => {
  arrayIsValid.value = isValid
}

// Action handlers
const resetData = () => {
  jsonString.value = ''
  jsonObject.value = {}
  jsonArray.value = []
}

const updateData = () => {
  jsonString.value = '{"message": "Hello World", "timestamp": "2025-10-08"}'
  jsonObject.value = {
    user: {
      id: 123,
      username: "demo_user",
      preferences: {
        theme: "dark",
        notifications: true
      }
    },
    session: {
      token: "abc123",
      expires: "2025-10-09"
    }
  }
  jsonArray.value = [
    { type: "text", content: "Welcome to the demo" },
    { type: "button", content: "Click me", action: "alert" },
    { type: "link", content: "Learn more", url: "https://example.com" }
  ]
}
</script>

<style scoped>
.json-editor-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.demo-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.demo-header h1 {
  font-size: 2rem;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.demo-header p {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.demo-section {
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  background: var(--color-background-primary);
}

.demo-section h2 {
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
  font-size: 1.25rem;
}

.demo-section p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-sm);
}

.demo-output {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--color-gray-100);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-gray-200);
}

.demo-output h3 {
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
  font-size: 1rem;
}

.demo-output pre {
  background: var(--color-gray-50);
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: var(--font-size-xs);
  line-height: 1.4;
  overflow-x: auto;
  margin-bottom: var(--spacing-sm);
  border: 1px solid var(--color-gray-200);
}

.demo-output p {
  margin: var(--spacing-xs) 0;
  font-size: var(--font-size-xs);
}

.demo-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-gray-200);
}

.demo-button {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-fast);
}

.demo-button:hover {
  background: var(--color-primary-dark);
}

.demo-button:active {
  transform: translateY(1px);
}

/* Dark theme */
[data-theme="dark"] .demo-section {
  background: var(--color-background-secondary);
  border-color: var(--color-gray-600);
}

[data-theme="dark"] .demo-output {
  background: var(--color-gray-800);
  border-color: var(--color-gray-600);
}

[data-theme="dark"] .demo-output pre {
  background: var(--color-gray-900);
  border-color: var(--color-gray-600);
}
</style>
