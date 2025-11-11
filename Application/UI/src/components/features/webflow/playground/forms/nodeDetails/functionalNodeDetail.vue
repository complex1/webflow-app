<template>
  <div class="functional-node-detail">
    <!-- Node Header -->
    <div class="detail-header">
      <div class="header-content">
        <div class="header-icon functional-node">
          <i class="fas fa-code"></i>
        </div>
        <div class="header-info">
          <h2 class="node-name">{{ functionalNode.name || 'Unnamed Functional Node' }}</h2>
          <p v-if="functionalNode.description" class="node-description">{{ functionalNode.description }}</p>
          <div class="node-meta">
            <span class="node-id">{{ functionalNode.id }}</span>
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

    <!-- Transform Function Card -->
    <div class="transform-card glass-panel">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-code"></i>
          <span>Transform Function</span>
        </h3>
      </div>
      
      <div class="transform-content">
        <div class="function-meta">
          <div class="meta-grid">
            <div class="meta-item">
              <div class="meta-label">
                <i class="fab fa-js-square"></i>
                <span>Language</span>
              </div>
              <div class="meta-value">JavaScript</div>
            </div>
            <div class="meta-item" v-if="functionalNode.parameters.length > 0">
              <div class="meta-label">
                <i class="fas fa-cogs"></i>
                <span>Parameters</span>
              </div>
              <div class="meta-value">{{ parameterNames.join(', ') }}</div>
            </div>
          </div>
        </div>
        
        <div class="code-section">
          <div class="code-header">
            <div class="code-title">
              <i class="fas fa-terminal"></i>
              <span>Function Code</span>
            </div>
          </div>
          <div class="code-container">
            <pre class="code-block">{{ transformCode }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Parameters Card -->
    <div v-if="functionalNode.parameters.length > 0" class="parameters-card glass-panel">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-sliders-h"></i>
          <span>Function Parameters ({{ functionalNode.parameters.length }})</span>
        </h3>
      </div>
      
      <div class="parameters-content">
        <div class="parameter-list">
          <div 
            v-for="param in functionalNode.parameters" 
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
          <div class="stat-item" v-if="functionalNode.executionTime">
            <div class="stat-label">Execution Time</div>
            <div class="stat-value">{{ functionalNode.executionTime }}ms</div>
          </div>
          <div class="stat-item error" v-if="functionalNode.hasError">
            <div class="stat-label">Error</div>
            <div class="stat-value">{{ functionalNode.errorMessage }}</div>
          </div>
        </div>

        <!-- Result Data -->
        <div v-if="!functionalNode.hasError" class="result-section">
          <h4 class="result-title">Transformed Data</h4>
          <div class="result-content">
            <div class="code-container">
              <pre v-if="(typeof getVariableData !== 'object')" class="code-block">{{ getVariableData}}</pre>
              <UiJsonEditor
                v-else
                :modelValue="getVariableData"
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
          <i class="fas fa-function"></i>
        </div>
        <h3 class="empty-title">Functional Node Not Configured</h3>
        <p class="empty-description">
          This functional node hasn't been set up yet. Add a name, description, transform code, and configure the parameters to get started.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type FunctionalNode from '@/apifluxCore/nodes/functionalNode';
import { NodeStatus } from '@/apifluxCore/types';
import { UiJsonEditor } from '@/components/base';

// Props
const props = defineProps<{
  functionalNode: FunctionalNode;
  globalStore?: Record<string, any>;
  envVariableMap?: Record<string, string>;
}>();

// Computed properties
const statusClass = computed(() => {
  switch (props.functionalNode.nodeStatus) {
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
  switch (props.functionalNode.nodeStatus) {
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
  switch (props.functionalNode.nodeStatus) {
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

const transformCode = computed(() => {
  return props.functionalNode.transform || '// No transform code defined';
});

const parameterNames = computed(() => {
  return props.functionalNode.parameters.map(param => param.name);
});

const resultType = computed(() => {
  return typeof props.functionalNode.nodeData;
});

const hasExecutionResults = computed(() => {
  return props.functionalNode.executionDone || props.functionalNode.hasError;
});

const resultIcon = computed(() => {
  if (props.functionalNode.hasError) {
    return 'fas fa-exclamation-triangle';
  }
  return 'fas fa-chart-line';
});

const isEmpty = computed(() => {
  return !props.functionalNode.name &&
         !props.functionalNode.description &&
         !props.functionalNode.transform &&
         props.functionalNode.parameters.length === 0;
});

// Methods
const getVariableValue = (variable: any) => {
  try {
    const value = variable.get(props.globalStore || {}, props.envVariableMap || {});
    return value !== undefined && value !== null ? String(value) : 'Not set';
  } catch (error) {
    return 'Error getting value';
  }
};

const getVariableData = computed(() => {
  // Logic to fetch and return the variable data
  return props.functionalNode.nodeData.get(
    props.globalStore || {},
    props.envVariableMap || {}
  );
});
</script>

<style scoped>
/* ===== Functional Node Detail - Neo-Systemic Design ===== */
.functional-node-detail {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--glass-bg);
  border-bottom-left-radius: var(--radius-xl);
  border-bottom-right-radius: var(--radius-xl);
  font-size: var(--font-size-sm);
}

/* ===== Detail Header ===== */
.detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: linear-gradient(135deg, var(--color-background) 0%, var(--color-background-subtle) 100%);
  border-radius: var(--radius-md);
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
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: var(--font-size-xl);
  box-shadow: var(--shadow-md);
  flex-shrink: 0;
}

.header-icon.functional-node {
  background: var(--color-functional-node-gradient);
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
  border-radius: var(--radius-md);
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
.transform-card,
.parameters-card,
.results-card,
.empty-state-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.card-header {
  padding: var(--spacing-md);
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
  color: var(--color-functional-node);
  font-size: var(--font-size-sm);
}

/* ===== Transform Card ===== */
.transform-content {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.function-meta {
  background: var(--color-background-subtle);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-subtle);
  padding: var(--spacing-md);
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.meta-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.meta-label i {
  font-size: var(--font-size-sm);
  color: var(--color-functional-node);
}

.meta-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  font-family: var(--font-family-mono);
}

.code-section {
  background: var(--color-background-code);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-subtle);
  overflow: hidden;
}

.code-header {
  padding: var(--spacing-md);
  background: var(--color-background-secondary);
  border-bottom: 1px solid var(--color-border-subtle);
}

.code-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.code-title i {
  color: var(--color-functional-node);
  font-size: var(--font-size-xs);
}

.code-container {
  max-height: 400px;
  overflow-y: auto;
}

.code-block {
  margin: 0;
  padding: var(--spacing-md);
  background: var(--color-background-code);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--color-text-code);
}

/* ===== Parameters Card ===== */
.parameters-content {
  padding: var(--spacing-md);
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

/* ===== Results Card ===== */
.results-content {
  padding: var(--spacing-md);
}

.execution-stats {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
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

.result-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.result-content {
  background: var(--color-background-code);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-subtle);
  overflow: hidden;
}

/* ===== Empty State ===== */
.empty-state-card {
  text-align: center;
}

.empty-content {
  padding: var(--spacing-md);
}

.empty-icon {
  font-size: var(--font-size-4xl);
  color: var(--color-text-tertiary);
  opacity: 0.4;
  margin-bottom: var(--spacing-md);
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
  .functional-node-detail {
    padding: var(--spacing-md);
  }
  
  .detail-header {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .meta-grid {
    grid-template-columns: 1fr;
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
