<template>
  <div class="api-node-detail">
    <!-- Node Info Section -->
    <div class="node-info-section">
      <div class="node-header">
        <h2 class="node-name">{{ apiNode.name || 'Unnamed API Node' }}</h2>
        <div class="node-status" :class="statusClass">
          <i :class="statusIcon"></i>
          {{ statusText }}
        </div>
      </div>
      <p v-if="apiNode.description" class="node-description">{{ apiNode.description }}</p>
      <div class="node-id">{{ apiNode.id }}</div>
    </div>

    <!-- Method and URL Section -->
    <div class="request-config">
      <h3 class="section-title">Request Configuration</h3>
      
      <div class="url-container">
        <div class="method-badge" :class="methodClass">
          {{ apiNode.method || 'GET' }}
        </div>
        <div class="url-info">
          <div class="url-parts">
            <div class="url-part">
              <span class="url-label">Base:</span>
              <code class="url-value">{{ getVariableValue(apiNode.baseUrl) || 'Not set' }}</code>
            </div>
            <div class="url-part">
              <span class="url-label">Path:</span>
              <code class="url-value">{{ getVariableValue(apiNode.url) || 'Not set' }}</code>
            </div>
          </div>
          <!-- <div class="full-url">
            <span class="url-label">Full URL:</span>
            <div class="full-url-container">
              <code class="full-url-text">{{ getFullUrl() }}</code>
              <button class="copy-btn" @click="copyUrl" title="Copy URL">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div> -->
        </div>
      </div>
    </div>

    <!-- Variables Section -->
    <div class="variables-section" v-if="hasVariables">
      <!-- Query Parameters -->
      <div v-if="apiNode.queryParams.length > 0" class="variable-group">
        <h4 class="variable-group-title">
          <i class="fas fa-search"></i>
          Query Parameters ({{ apiNode.queryParams.length }})
        </h4>
        <div class="variable-list">
          <div 
            v-for="param in apiNode.queryParams" 
            :key="param.id"
            class="variable-item"
          >
            <div class="variable-name">{{ param.name }}</div>
            <div class="variable-type">{{ param.type }}</div>
            <div class="variable-value">{{ getVariableValue(param) }}</div>
          </div>
        </div>
      </div>

      <!-- Path Parameters -->
      <div v-if="apiNode.pathParams.length > 0" class="variable-group">
        <h4 class="variable-group-title">
          <i class="fas fa-route"></i>
          Path Parameters ({{ apiNode.pathParams.length }})
        </h4>
        <div class="variable-list">
          <div 
            v-for="param in apiNode.pathParams" 
            :key="param.id"
            class="variable-item"
          >
            <div class="variable-name">{{ param.name }}</div>
            <div class="variable-type">{{ param.type }}</div>
            <div class="variable-value">{{ getVariableValue(param) }}</div>
          </div>
        </div>
      </div>

      <!-- Headers -->
      <div v-if="apiNode.headers.length > 0" class="variable-group">
        <h4 class="variable-group-title">
          <i class="fas fa-header"></i>
          Headers ({{ apiNode.headers.length }})
        </h4>
        <div class="variable-list">
          <div 
            v-for="header in apiNode.headers" 
            :key="header.id"
            class="variable-item"
          >
            <div class="variable-name">{{ header.name }}</div>
            <div class="variable-type">{{ header.type }}</div>
            <div class="variable-value">{{ getVariableValue(header) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Request Body -->
    <div v-if="shouldShowBody" class="body-section">
      <h3 class="section-title">
        <i class="fas fa-file-code"></i>
        Request Body
      </h3>
      <div class="body-content">
        <pre v-if="bodyType !== 'object'" class="code-block">{{ getBodyValue() }}</pre>
        <UiJsonEditor
          v-else
          :modelValue="getBodyValue()"
          readonly
          :show-footer="false"
        />
      </div>
    </div>

    <!-- Execution Results -->
    <div v-if="hasExecutionResults" class="results-section">
      <h3 class="section-title">
        <i :class="resultIcon"></i>
        Execution Results
      </h3>
      
      <div class="execution-meta">
        <div class="meta-row" v-if="apiNode.executionTime">
          <span class="meta-label">Execution Time:</span>
          <span class="meta-value">{{ apiNode.executionTime }}ms</span>
        </div>
        <div class="meta-row" v-if="apiNode.hasError">
          <span class="meta-label">Error:</span>
          <span class="meta-value error">{{ apiNode.errorMessage }}</span>
        </div>
      </div>

      <!-- Response Data -->
      <div v-if="apiNode.nodeData && !apiNode.hasError" class="response-section">
        <h4 class="subsection-title">Response Data</h4>
        <div class="response-content">
          <pre v-if="responseType !== 'object'" class="code-block">{{ JSON.stringify(apiNode.nodeData, null, 2) }}</pre>
          <UiJsonEditor
            v-else
            :modelValue="apiNode.nodeData"
            readonly
            :show-footer="false"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="isEmpty" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-globe"></i>
      </div>
      <h3 class="empty-title">API Node Not Configured</h3>
      <p class="empty-description">
        This API node hasn't been set up yet. Add a name, description, URL, and configure the request parameters to get started.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ApiNode } from '@/apifluxCore/nodes/apiNode';
import { NodeStatus } from '@/apifluxCore/types';
import { UiJsonEditor } from '@/components/base';
import { toast } from '@/utils';

// Props
const props = defineProps<{
  apiNode: ApiNode;
  globalStore?: Record<string, any>;
}>();

// Computed properties
const statusClass = computed(() => {
  switch (props.apiNode.nodeStatus) {
    case NodeStatus.SUCCESS:
      return 'status-success';
    case NodeStatus.FAILURE:
      return 'status-error';
    case NodeStatus.IN_PROGRESS:
      return 'status-running';
    default:
      return 'status-idle';
  }
});

const statusIcon = computed(() => {
  switch (props.apiNode.nodeStatus) {
    case NodeStatus.SUCCESS:
      return 'fas fa-check-circle';
    case NodeStatus.FAILURE:
      return 'fas fa-exclamation-circle';
    case NodeStatus.IN_PROGRESS:
      return 'fas fa-spinner fa-spin';
    default:
      return 'fas fa-circle';
  }
});

const statusText = computed(() => {
  switch (props.apiNode.nodeStatus) {
    case NodeStatus.SUCCESS:
      return 'Success';
    case NodeStatus.FAILURE:
      return 'Failed';
    case NodeStatus.IN_PROGRESS:
      return 'Running';
    case NodeStatus.PENDING:
      return 'Pending';
    case NodeStatus.INACTIVE:
      return 'Inactive';
    case NodeStatus.SKIPPED:
      return 'Skipped';
    default:
      return 'Ready';
  }
});

const methodClass = computed(() => {
  const method = props.apiNode.method || 'GET';
  return `method-${method.toLowerCase()}`;
});

const shouldShowBody = computed(() => {
  const method = props.apiNode.method || 'GET';
  return ['POST', 'PUT', 'PATCH'].includes(method) && props.apiNode.body;
});

const bodyType = computed(() => {
  return typeof getBodyValue();
});

const responseType = computed(() => {
  return typeof props.apiNode.nodeData;
});

const hasExecutionResults = computed(() => {
  return props.apiNode.executionDone || props.apiNode.hasError;
});

const resultIcon = computed(() => {
  if (props.apiNode.hasError) {
    return 'fas fa-exclamation-triangle';
  }
  return 'fas fa-chart-line';
});

const hasVariables = computed(() => {
  return props.apiNode.pathParams.length > 0 ||
         props.apiNode.queryParams.length > 0 ||
         props.apiNode.headers.length > 0;
});

const isEmpty = computed(() => {
  const baseUrlValue = getVariableValue(props.apiNode.baseUrl);
  const urlValue = getVariableValue(props.apiNode.url);
  
  return !props.apiNode.name &&
         !props.apiNode.description &&
         !urlValue && 
         !baseUrlValue && 
         props.apiNode.pathParams.length === 0 &&
         props.apiNode.queryParams.length === 0 &&
         props.apiNode.headers.length === 0;
});

// Methods
const getFullUrl = () => {
  try {
    return props.apiNode.getUrl(props.globalStore || {});
  } catch (error) {
    return 'Invalid URL configuration';
  }
};

const getVariableValue = (variable: any) => {
  try {
    const value = variable.get(props.globalStore || {});
    return value !== undefined && value !== null ? String(value) : 'Not set';
  } catch (error) {
    return 'Error getting value';
  }
};

const getBodyValue = () => {
  try {
    return props.apiNode.getBody(props.globalStore || {});
  } catch (error) {
    return 'Error getting body';
  }
};

const copyUrl = async () => {
  try {
    const url = getFullUrl();
    await navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  } catch (error) {
    toast.error('Failed to copy URL');
  }
};
</script>

<style scoped>
.api-node-detail {
  padding: 0;
  font-size: var(--font-size-sm);
}

/* Node Info Section */
.node-info-section {
  padding: var(--spacing-lg);
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
}

.node-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-sm);
}

.node-name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
  flex: 1;
  margin-right: var(--spacing-md);
}

.node-description {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.5;
  margin: 0 0 var(--spacing-sm) 0;
  font-style: italic;
}

.node-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  flex-shrink: 0;
}

.status-success {
  background: var(--color-success-light);
  color: var(--color-success-dark);
}

.status-error {
  background: var(--color-error-light);
  color: var(--color-error-dark);
}

.status-running {
  background: var(--color-warning-light);
  color: var(--color-warning-dark);
}

.status-idle {
  background: var(--color-gray-200);
  color: var(--color-text-secondary);
}

.node-id {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin-top: var(--spacing-xs);
}

/* Request Configuration */
.request-config {
  margin-bottom: var(--spacing-lg);
}

.section-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.url-container {
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-start;
}

.method-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-xs);
  min-width: 50px;
  text-align: center;
  flex-shrink: 0;
}

.method-get { background: #dcfce7; color: #166534; }
.method-post { background: #dbeafe; color: #1d4ed8; }
.method-put { background: #fef3c7; color: #d97706; }
.method-delete { background: #fee2e2; color: #dc2626; }
.method-patch { background: #e0e7ff; color: #6366f1; }

.url-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.url-parts {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.url-part {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.url-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  min-width: 40px;
}

.url-value {
  background: var(--color-gray-50);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  flex: 1;
}

.full-url {
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--color-border);
}

.full-url-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xs);
}

.full-url-text {
  background: var(--color-gray-100);
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  word-break: break-all;
  flex: 1;
}

.copy-btn {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-xs);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.copy-btn:hover {
  background: var(--color-gray-100);
  color: var(--color-text-primary);
}

/* Variables Section */
.variables-section {
  margin-bottom: var(--spacing-lg);
}

.variable-group {
  margin-bottom: var(--spacing-md);
}

.variable-group-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.variable-list {
  background: var(--color-gray-50);
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.variable-item {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  align-items: center;
  border-bottom: 1px solid var(--color-border);
}

.variable-item:last-child {
  border-bottom: none;
}

.variable-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.variable-type {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  background: var(--color-gray-200);
  padding: 2px 6px;
  border-radius: var(--radius-xs);
}

.variable-value {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-align: right;
  word-break: break-all;
}

/* Body and Results Sections */
.body-section,
.results-section {
  margin-bottom: var(--spacing-lg);
}

.body-content,
.response-content {
  background: var(--color-gray-50);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.code-block {
  margin: 0;
  padding: var(--spacing-md);
  background: var(--color-gray-50);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 300px;
  overflow-y: auto;
}

/* Execution Meta */
.execution-meta {
  margin-bottom: var(--spacing-md);
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  background: var(--color-gray-50);
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-xs);
}

.meta-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.meta-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.meta-value.error {
  color: var(--color-error);
}

.subsection-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.response-section {
  margin-top: var(--spacing-md);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-lg);
  color: var(--color-text-secondary);
}

.empty-icon {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-lg);
  opacity: 0.4;
  color: var(--color-text-tertiary);
}

.empty-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
}

.empty-description {
  font-size: var(--font-size-sm);
  max-width: 300px;
  margin: 0 auto;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
  .url-container {
    flex-direction: column;
  }
  
  .variable-item {
    grid-template-columns: 1fr;
    gap: var(--spacing-xs);
  }
  
  .variable-value {
    text-align: left;
  }
  
  .meta-row {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
}
</style>
