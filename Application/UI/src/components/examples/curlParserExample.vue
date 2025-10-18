<template>
  <div class="curl-parser-demo">
    <div class="demo-section">
      <h3>cURL to ApiNode Parser Demo</h3>
      
      <div class="input-section">
        <label for="curl-input">Enter cURL Command:</label>
        <textarea 
          id="curl-input"
          v-model="curlCommand"
          placeholder="Paste your cURL command here..."
          rows="4"
          class="curl-input"
        ></textarea>
        
        <div class="button-group">
          <button @click="parseCommand" class="parse-btn">Parse cURL</button>
          <button @click="loadExample" class="example-btn">Load Example</button>
          <button @click="clear" class="clear-btn">Clear</button>
        </div>
      </div>
      
      <!-- Validation Messages -->
      <div v-if="validationResult && !validationResult.isValid" class="validation-errors">
        <h4>Validation Errors:</h4>
        <ul>
          <li v-for="error in validationResult.errors" :key="error" class="error-item">
            {{ error }}
          </li>
        </ul>
      </div>
      
      <!-- Parse Result -->
      <div v-if="parseResult" class="result-section">
        <div v-if="parseResult.success" class="success-result">
          <h4>✅ Successfully Parsed!</h4>
          
          <div class="api-node-details">
            <div class="detail-group">
              <label>Node Name:</label>
              <span>{{ parseResult.apiNode?.name }}</span>
            </div>
            
            <div class="detail-group">
              <label>HTTP Method:</label>
              <span class="method-badge" :class="`method-${parseResult.apiNode?.method.toLowerCase()}`">
                {{ parseResult.apiNode?.method }}
              </span>
            </div>
            
            <div class="detail-group">
              <label>Base URL:</label>
              <span>{{ parseResult.apiNode?.baseUrl.defaultValue }}</span>
            </div>
            
            <div class="detail-group">
              <label>Path:</label>
              <span>{{ parseResult.apiNode?.url.defaultValue }}</span>
            </div>
            
            <div v-if="parseResult.apiNode?.queryParams.length" class="detail-group">
              <label>Query Parameters:</label>
              <div class="params-list">
                <div 
                  v-for="param in parseResult.apiNode.queryParams" 
                  :key="param.id"
                  class="param-item"
                >
                  <code>{{ param.name }}: {{ param.defaultValue }}</code>
                </div>
              </div>
            </div>
            
            <div v-if="parseResult.apiNode?.headers.length" class="detail-group">
              <label>Headers:</label>
              <div class="params-list">
                <div 
                  v-for="header in parseResult.apiNode.headers" 
                  :key="header.id"
                  class="param-item"
                >
                  <code>{{ header.name }}: {{ header.defaultValue }}</code>
                </div>
              </div>
            </div>
            
            <div v-if="parseResult.apiNode?.body.defaultValue" class="detail-group">
              <label>Body:</label>
              <pre class="body-content">{{ JSON.stringify(parseResult.apiNode.body.defaultValue, null, 2) }}</pre>
            </div>
          </div>
          
          <!-- Generated cURL -->
          <div class="generated-curl">
            <h4>Generated cURL Command:</h4>
            <pre class="curl-output">{{ generatedCurl }}</pre>
            <button @click="copyCurl" class="copy-btn">Copy cURL</button>
          </div>
          
        </div>
        
        <div v-else class="error-result">
          <h4>❌ Parse Failed</h4>
          <p class="error-message">{{ parseResult.error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { parseCurlToApiNode, apiNodeToCurl, validateCurlCommand, curlExamples, type CurlParseResult } from '@/utils/curlCmd'

const curlCommand = ref('')
const parseResult = ref<CurlParseResult | null>(null)
const validationResult = ref<{ isValid: boolean; errors: string[] } | null>(null)

const generatedCurl = computed(() => {
  if (parseResult.value?.success && parseResult.value.apiNode) {
    try {
      return apiNodeToCurl(parseResult.value.apiNode, {})
    } catch (error) {
      console.error('Error generating cURL:', error)
      return 'Error generating cURL command'
    }
  }
  return ''
})

const parseCommand = () => {
  if (!curlCommand.value.trim()) {
    parseResult.value = { success: false, error: 'Please enter a cURL command' }
    return
  }
  
  // Validate first
  validationResult.value = validateCurlCommand(curlCommand.value)
  
  // Parse the command
  parseResult.value = parseCurlToApiNode(curlCommand.value)
}

const loadExample = () => {
  curlCommand.value = curlExamples.post
  parseCommand()
}

const clear = () => {
  curlCommand.value = ''
  parseResult.value = null
  validationResult.value = null
}

const copyCurl = async () => {
  if (generatedCurl.value) {
    try {
      await navigator.clipboard.writeText(generatedCurl.value)
      alert('cURL command copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }
}
</script>

<style scoped>
.curl-parser-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.demo-section {
  background: var(--color-background-elevated);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-lg);
}

.demo-section h3 {
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.input-section {
  margin-bottom: var(--spacing-lg);
}

.input-section label {
  display: block;
  color: var(--color-text-primary);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
}

.curl-input {
  width: 100%;
  min-height: 100px;
  padding: var(--spacing-md);
  background: var(--color-background-code);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-code);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  resize: vertical;
}

.curl-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-subtle);
}

.button-group {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.parse-btn, .example-btn, .clear-btn, .copy-btn {
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.parse-btn {
  background: var(--gradient-primary);
  color: var(--color-text-inverse);
}

.parse-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.example-btn {
  background: var(--gradient-accent);
  color: var(--color-text-inverse);
}

.clear-btn {
  background: var(--color-background-subtle);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.copy-btn {
  background: var(--gradient-success);
  color: var(--color-text-inverse);
  font-size: var(--font-size-sm);
  padding: var(--spacing-sm) var(--spacing-md);
}

.validation-errors {
  background: var(--color-danger-subtle);
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.validation-errors h4 {
  color: var(--color-danger);
  margin-bottom: var(--spacing-sm);
}

.error-item {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
}

.result-section {
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-lg);
}

.success-result h4 {
  color: var(--color-success);
  margin-bottom: var(--spacing-lg);
}

.error-result h4 {
  color: var(--color-danger);
  margin-bottom: var(--spacing-md);
}

.error-message {
  color: var(--color-danger);
  background: var(--color-danger-subtle);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

.api-node-details {
  background: var(--color-background-subtle);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.detail-group {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-md);
}

.detail-group label {
  font-weight: 600;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-xs);
}

.detail-group span {
  color: var(--color-text-primary);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
}

.method-badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: var(--font-size-xs);
  text-transform: uppercase;
}

.method-get { background: var(--color-success); }
.method-post { background: var(--color-primary); }
.method-put { background: var(--color-warning); }
.method-delete { background: var(--color-danger); }

.params-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.param-item code {
  background: var(--color-background-code);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-code);
}

.body-content {
  background: var(--color-background-code);
  color: var(--color-text-code);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  overflow-x: auto;
}

.generated-curl {
  background: var(--color-background-code);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
}

.generated-curl h4 {
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.curl-output {
  background: var(--color-background);
  color: var(--color-text-code);
  padding: var(--spacing-md);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  overflow-x: auto;
  margin-bottom: var(--spacing-md);
}
</style>
