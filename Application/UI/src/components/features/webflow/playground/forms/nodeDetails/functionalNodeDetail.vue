<template>
  <div class="functional-node-detail">
    <!-- Node Info Section -->
    <div class="node-info-section">
      <div class="node-header">
        <h2 class="node-name">{{ functionalNode.name || 'Unnamed Functional Node' }}</h2>
        <div class="node-status" :class="statusClass">
          <i :class="statusIcon"></i>
          {{ statusText }}
        </div>
      </div>
      <p v-if="functionalNode.description" class="node-description">{{ functionalNode.description }}</p>
      <div class="node-id">{{ functionalNode.id }}</div>
    </div>

    <!-- Transform Code Section -->
    <div class="transform-section">
      <h3 class="section-title">
        <i class="fas fa-code"></i>
        Transform Function
      </h3>
      
      <div class="transform-content">
        <div class="transform-info">
          <div class="info-item">
            <span class="info-label">Language:</span>
            <span class="info-value">JavaScript</span>
          </div>
          <div class="info-item" v-if="functionalNode.parameters.length > 0">
            <span class="info-label">Parameters:</span>
            <span class="info-value">{{ parameterNames.join(', ') }}</span>
          </div>
        </div>
        
        <div class="code-container">
          <pre class="code-block">{{ transformCode }}</pre>
        </div>
      </div>
    </div>

    <!-- Parameters Section -->
    <div v-if="functionalNode.parameters.length > 0" class="parameters-section">
      <h3 class="section-title">
        <i class="fas fa-cogs"></i>
        Parameters ({{ functionalNode.parameters.length }})
      </h3>
      
      <div class="variable-list">
        <div 
          v-for="param in functionalNode.parameters" 
          :key="param.id"
          class="variable-item"
        >
          <div class="variable-name">{{ param.name }}</div>
          <div class="variable-type">{{ param.type }}</div>
          <div class="variable-value">{{ getVariableValue(param) }}</div>
        </div>
      </div>
    </div>

    <!-- Execution Results -->
    <div v-if="hasExecutionResults" class="results-section">
      <h3 class="section-title">
        <i :class="resultIcon"></i>
        Execution Results
      </h3>
      
      <div class="execution-meta">
        <div class="meta-row" v-if="functionalNode.executionTime">
          <span class="meta-label">Execution Time:</span>
          <span class="meta-value">{{ functionalNode.executionTime }}ms</span>
        </div>
        <div class="meta-row" v-if="functionalNode.hasError">
          <span class="meta-label">Error:</span>
          <span class="meta-value error">{{ functionalNode.errorMessage }}</span>
        </div>
      </div>

      <!-- Result Data -->
      <div v-if="functionalNode.nodeData && !functionalNode.hasError" class="result-section">
        <h4 class="subsection-title">Result Data</h4>
        <div class="result-content">
          <pre v-if="resultType !== 'object'" class="code-block">{{ JSON.stringify(functionalNode.nodeData, null, 2) }}</pre>
          <UiJsonEditor
            v-else
            :modelValue="functionalNode.nodeData"
            readonly
            :show-footer="false"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="isEmpty" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-function"></i>
      </div>
      <h3 class="empty-title">Functional Node Not Configured</h3>
      <p class="empty-description">
        This functional node hasn't been set up yet. Add a name, description, transform code, and configure the parameters to get started.
      </p>
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
    const value = variable.get(props.globalStore || {});
    return value !== undefined && value !== null ? String(value) : 'Not set';
  } catch (error) {
    return 'Error getting value';
  }
};
</script>

<style scoped>
.functional-node-detail {
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

/* Transform Section */
.transform-section {
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

.transform-content {
  background: var(--color-gray-50);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.transform-info {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-gray-25);
}

.info-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  min-width: 80px;
}

.info-value {
  font-size: var(--font-size-xs);
  color: var(--color-text-primary);
  font-family: var(--font-family-mono);
}

.code-container {
  max-height: 400px;
  overflow-y: auto;
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
  color: var(--color-text-primary);
}

/* Parameters Section */
.parameters-section {
  margin-bottom: var(--spacing-lg);
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

/* Results Section */
.results-section {
  margin-bottom: var(--spacing-lg);
}

.result-content {
  background: var(--color-gray-50);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  overflow: hidden;
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

.result-section {
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
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
  
  .info-label {
    min-width: auto;
  }
}
</style>
