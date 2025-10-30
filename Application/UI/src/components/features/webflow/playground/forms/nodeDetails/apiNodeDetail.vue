<template>
  <div class="api-node-detail glass-panel">
    <!-- Node Header -->
    <div class="detail-header">
      <div class="header-content">
        <div class="header-icon api-node">
          <i class="fas fa-globe"></i>
        </div>
        <div class="header-info">
          <h2 class="node-name">{{ apiNode.name || 'Unnamed API Node' }}</h2>
          <p v-if="apiNode.description" class="node-description">{{ apiNode.description }}</p>
          <div class="node-meta">
            <span class="node-id">{{ apiNode.id }}</span>
          </div>
        </div>
      </div>
      <div class="status-badge">
        <div class="node-status" :class="statusClass">
          <i :class="statusIcon"></i>
          <span>{{ statusText }}</span>
        </div>
      </div>
    </div>

    <!-- Request Configuration Card -->
    <div class="config-card glass-panel">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-cog"></i>
          <span>Request Configuration</span>
        </h3>
      </div>
      
      <div class="config-content">
        <div class="method-url-section">
          <div class="method-container">
            <div class="method-badge" :class="methodClass">
              {{ apiNode.method || 'GET' }}
            </div>
          </div>
          
          <div class="url-section">
            <div class="url-row">
              <div class="url-label">
                <i class="fas fa-server"></i>
                <span>Base URL</span>
              </div>
              <code class="url-value">{{ getVariableValue(apiNode.baseUrl) || 'Not configured' }}</code>
            </div>
            <div class="url-row">
              <div class="url-label">
                <i class="fas fa-route"></i>
                <span>Endpoint</span>
              </div>
              <code class="url-value">{{ getVariableValue(apiNode.url) || 'Not configured' }}</code>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Parameters Card -->
    <div v-if="hasVariables" class="parameters-card glass-panel">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-sliders-h"></i>
          <span>Parameters</span>
        </h3>
      </div>
      
      <div class="parameters-content">
        <!-- Query Parameters -->
        <div v-if="apiNode.queryParams.length > 0" class="parameter-group">
          <div class="group-header">
            <div class="group-icon query-params">
              <i class="fas fa-filter"></i>
            </div>
            <div class="group-info">
              <h4 class="group-title">Query Parameters</h4>
              <span class="group-count">{{ apiNode.queryParams.length }} parameters</span>
            </div>
          </div>
          <div class="parameter-list">
            <div 
              v-for="param in apiNode.queryParams" 
              :key="param.id"
              class="parameter-item"
            >
              <div class="param-info">
                <div class="param-name">{{ param.name }}</div>
                <div class="param-type">{{ param.type }}</div>
              </div>
              <div class="param-value">{{ getVariableValue(param) }}</div>
            </div>
          </div>
        </div>

        <!-- Path Parameters -->
        <div v-if="apiNode.pathParams.length > 0" class="parameter-group">
          <div class="group-header">
            <div class="group-icon path-params">
              <i class="fas fa-route"></i>
            </div>
            <div class="group-info">
              <h4 class="group-title">Path Parameters</h4>
              <span class="group-count">{{ apiNode.pathParams.length }} parameters</span>
            </div>
          </div>
          <div class="parameter-list">
            <div 
              v-for="param in apiNode.pathParams" 
              :key="param.id"
              class="parameter-item"
            >
              <div class="param-info">
                <div class="param-name">{{ param.name }}</div>
                <div class="param-type">{{ param.type }}</div>
              </div>
              <div class="param-value">{{ getVariableValue(param) }}</div>
            </div>
          </div>
        </div>

        <!-- Headers -->
        <div v-if="apiNode.headers.length > 0" class="parameter-group">
          <div class="group-header">
            <div class="group-icon headers">
              <i class="fas fa-list"></i>
            </div>
            <div class="group-info">
              <h4 class="group-title">Headers</h4>
              <span class="group-count">{{ apiNode.headers.length }} headers</span>
            </div>
          </div>
          <div class="parameter-list">
            <div 
              v-for="header in apiNode.headers" 
              :key="header.id"
              class="parameter-item"
            >
              <div class="param-info">
                <div class="param-name">{{ header.name }}</div>
                <div class="param-type">{{ header.type }}</div>
              </div>
              <div class="param-value">{{ getVariableValue(header) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Request Body Card -->
    <div v-if="shouldShowBody" class="body-card glass-panel">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-code"></i>
          <span>Request Body</span>
        </h3>
      </div>
      <div class="body-content">
        <div class="code-container">
          <pre v-if="bodyType !== 'object'" class="code-block">{{ getBodyValue() }}</pre>
          <UiJsonEditor
            v-else
            :modelValue="getBodyValue()"
            readonly
            :show-footer="false"
          />
        </div>
      </div>
    </div>

    <!-- Execution Results Card -->
    <div v-if="hasExecutionResults" class="results-card glass-panel">
      <div class="card-header">
        <h3 class="card-title">
          <i :class="resultIcon"></i>
          <span>Execution Results</span>
        </h3>
      </div>
      
      <div class="results-content">
        <div class="execution-stats">
          <div class="stat-item" v-if="apiNode.executionTime">
            <div class="stat-label">Execution Time</div>
            <div class="stat-value">{{ apiNode.executionTime }}ms</div>
          </div>
          <div class="stat-item error" v-if="apiNode.hasError">
            <div class="stat-label">Error</div>
            <div class="stat-value">{{ apiNode.errorMessage }}</div>
          </div>
        </div>

        <!-- Response Data -->
        <div v-if="apiNode.nodeData && !apiNode.hasError" class="response-section">
          <h4 class="response-title">Response Data</h4>
          <div class="response-content">
            <div class="code-container">
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
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="isEmpty" class="empty-state-card glass-panel">
      <div class="empty-content">
        <div class="empty-icon">
          <i class="fas fa-globe"></i>
        </div>
        <h3 class="empty-title">API Node Not Configured</h3>
        <p class="empty-description">
          This API node hasn't been set up yet. Add a name, description, URL, and configure the request parameters to get started.
        </p>
      </div>
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
    return props.apiNode.getUrl(props.globalStore || {}, {});
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
    return props.apiNode.getBody(props.globalStore || {}, {});
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
/* ===== API Node Detail - Neo-Systemic Design ===== */
.api-node-detail {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  font-size: var(--font-size-sm);
}

/* ===== Detail Header ===== */
.detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  background: linear-gradient(135deg, var(--color-background) 0%, var(--color-background-subtle) 100%);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-subtle);
}

.header-content {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  flex: 1;
}

.header-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: var(--font-size-xl);
  box-shadow: var(--shadow-md);
  flex-shrink: 0;
}

.header-icon.api-node {
  background: var(--color-api-node-gradient);
}

.header-info {
  flex: 1;
  min-width: 0;
}

.node-name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
}

.node-description {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  margin: 0 0 var(--spacing-md) 0;
  font-style: italic;
}

.node-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.node-id {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  background: var(--color-background-secondary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border-subtle);
}

.status-badge {
  flex-shrink: 0;
}

.node-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border: 1px solid;
  transition: all var(--transition-normal);
}

.status-success {
  background: var(--color-success-light);
  color: var(--color-success);
  border-color: var(--color-success);
}

.status-error {
  background: var(--color-danger-light);
  color: var(--color-danger);
  border-color: var(--color-danger);
}

.status-running {
  background: var(--color-warning-light);
  color: var(--color-warning);
  border-color: var(--color-warning);
}

.status-idle {
  background: var(--color-background-secondary);
  color: var(--color-text-secondary);
  border-color: var(--color-border);
}

/* ===== Card Components ===== */
.config-card,
.parameters-card,
.body-card,
.results-card,
.empty-state-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.card-header {
  padding: var(--spacing-lg);
  background: var(--color-background-subtle);
  border-bottom: 1px solid var(--color-border-subtle);
}

.card-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.card-title i {
  color: var(--color-primary);
  font-size: var(--font-size-sm);
}

/* ===== Configuration Card ===== */
.config-content {
  padding: var(--spacing-lg);
}

.method-url-section {
  display: flex;
  gap: var(--spacing-lg);
  align-items: flex-start;
}

.method-container {
  flex-shrink: 0;
}

.method-badge {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  border: 2px solid;
  min-width: 80px;
  text-align: center;
}

.method-get {
  background: var(--color-success-light);
  color: var(--color-success);
  border-color: var(--color-success);
}

.method-post {
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.method-put {
  background: var(--color-warning-light);
  color: var(--color-warning);
  border-color: var(--color-warning);
}

.method-delete {
  background: var(--color-danger-light);
  color: var(--color-danger);
  border-color: var(--color-danger);
}

.method-patch {
  background: var(--color-info-light);
  color: var(--color-info);
  border-color: var(--color-info);
}

.url-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.url-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.url-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  min-width: 100px;
  flex-shrink: 0;
}

.url-label i {
  font-size: var(--font-size-xs);
  opacity: 0.7;
}

.url-value {
  background: var(--color-background-code);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  color: var(--color-text-code);
  border: 1px solid var(--color-border-subtle);
  flex: 1;
  word-break: break-all;
}

/* ===== Parameters Card ===== */
.parameters-content {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.parameter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.group-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.group-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: var(--font-size-sm);
  flex-shrink: 0;
}

.group-icon.query-params {
  background: var(--color-warning-gradient);
}

.group-icon.path-params {
  background: var(--color-info-gradient);
}

.group-icon.headers {
  background: var(--color-text-secondary);
}

.group-info {
  flex: 1;
}

.group-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.group-count {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.parameter-list {
  background: var(--color-background-subtle);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-subtle);
  overflow: hidden;
}

.parameter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border-subtle);
}

.parameter-item:last-child {
  border-bottom: none;
}

.param-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
}

.param-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.param-type {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  background: var(--color-background-secondary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border-subtle);
  letter-spacing: var(--letter-spacing-wide);
}

.param-value {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  background: var(--color-background-code);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border-subtle);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===== Body and Results Cards ===== */
.body-content,
.results-content {
  padding: var(--spacing-lg);
}

.code-container {
  background: var(--color-background-code);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-subtle);
  overflow: hidden;
}

.code-block {
  margin: 0;
  padding: var(--spacing-lg);
  background: var(--color-background-code);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--color-text-code);
  max-height: 400px;
  overflow-y: auto;
}

.execution-stats {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
}

.stat-item {
  background: var(--color-background-subtle);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-subtle);
  flex: 1;
  min-width: 150px;
}

.stat-item.error {
  background: var(--color-danger-light);
  border-color: var(--color-danger);
}

.stat-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  margin-bottom: var(--spacing-xs);
}

.stat-value {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.stat-item.error .stat-value {
  color: var(--color-danger);
}

.response-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

/* ===== Empty State ===== */
.empty-state-card {
  text-align: center;
}

.empty-content {
  padding: var(--spacing-3xl);
}

.empty-icon {
  font-size: var(--font-size-4xl);
  color: var(--color-text-tertiary);
  opacity: 0.4;
  margin-bottom: var(--spacing-xl);
}

.empty-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.empty-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  max-width: 400px;
  margin: 0 auto;
}

/* ===== Responsive Design ===== */
@media (max-width: 768px) {
  .api-node-detail {
    padding: var(--spacing-lg);
  }
  
  .detail-header {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .method-url-section {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .url-row {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .url-label {
    min-width: auto;
  }
  
  .parameter-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .param-value {
    max-width: 100%;
  }
  
  .execution-stats {
    flex-direction: column;
  }
}
</style>
