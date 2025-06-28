<template>
  <div 
    class="api-card" 
    :class="{ 
      'selected': selected,
      [`method-${api.method?.toLowerCase()}`]: api.method 
    }"
    @click="handleCardClick"
  >

    <div class="flex-space-between flex-v-center mb-s">
      <h4 class="api-title">
        {{ api.name || 'API Endpoint' }}
      </h4>
      <div class="api-group" v-if="api.groupName">
        <span class="group-tag">{{ api.groupName }}</span>
      </div>
    </div>
    <div class="api-header">
      <div class="method-badge" :class="`method-${api.method?.toLowerCase()}`">
        {{ api.method || 'GET' }}
      </div>
      <div class="api-path">
        {{ api.url || '/api/endpoint' }}
      </div>
    </div>
    
    <div class="api-content">
      <div class="api-params" v-if="hasAnyParameters">
        <div class="param-section" v-if="hasPathParams">
          <span class="param-type">Path:</span>
          <span class="param-count">{{ pathParamCount }}</span>
        </div>
        <div class="param-section" v-if="hasQueryParams">
          <span class="param-type">Query:</span>
          <span class="param-count">{{ queryParamCount }}</span>
        </div>
        <div class="param-section" v-if="hasHeaders">
          <span class="param-type">Headers:</span>
          <span class="param-count">{{ headerCount }}</span>
        </div>
        <div class="param-section" v-if="hasBody">
          <span class="param-type">Body:</span>
          <i class="pi pi-file"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApiCardComponent',
  props: {
    api: {
      type: Object, // ExtractedAPI interface
      default: () => ({})
    },
    selected: {
      type: Boolean,
      default: false
    },
  },
  emits: ['select'],
  computed: {
    hasPathParams() {
      return this.api.pathParam && this.api.pathParam.length > 0;
    },
    hasQueryParams() {
      return this.api.queryParam && this.api.queryParam.length > 0;
    },
    hasHeaders() {
      return this.api.header && this.api.header.length > 0;
    },
    hasBody() {
      return this.api.body !== null && this.api.body !== undefined;
    },
    hasAnyParameters() {
      return this.hasPathParams || this.hasQueryParams || this.hasHeaders || this.hasBody;
    },
    pathParamCount() {
      return this.api.pathParam ? this.api.pathParam.length : 0;
    },
    queryParamCount() {
      return this.api.queryParam ? this.api.queryParam.length : 0;
    },
    headerCount() {
      return this.api.header ? this.api.header.length : 0;
    },
    allParameters() {
      return [
        ...(this.api.pathParam || []),
        ...(this.api.queryParam || []),
        ...(this.api.header || [])
      ];
    },
    requiredParamCount() {
      return this.allParameters.filter(param => param.required).length;
    },
    optionalParamCount() {
      return this.allParameters.filter(param => !param.required).length;
    }
  },
  methods: {
    handleCardClick() {
      this.$emit('select', this.api);
    }
  }
}
</script>

<style lang='scss' scoped>
.api-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 8pt;
  padding: var(--spacing-large);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: var(--spacing-medium);
  
  &:hover {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-drop);
    transform: translateY(-1px);
  }
  
  &.selected {
    border-color: var(--color-primary);
    background-color: rgba(var(--color-primary-rgb), 0.05);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
  }
}

.api-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-medium);
  margin-bottom: var(--spacing-medium);
}

.method-badge {
  padding: calc(var(--spacing-small) / 2) var(--spacing-small);
  border-radius: 4pt;
  font-size: var(--font-size-small);
  font-weight: 600;
  text-transform: uppercase;
  min-width: 60px;
  text-align: center;
  
  &.method-get {
    background-color: rgba(var(--color-success-rgb), 0.1);
    color: var(--color-success);
  }
  
  &.method-post {
    background-color: rgba(var(--color-primary-rgb), 0.1);
    color: var(--color-primary);
  }
  
  &.method-put {
    background-color: rgba(var(--color-warning-rgb), 0.1);
    color: var(--color-warning);
  }
  
  &.method-patch {
    background-color: rgba(var(--color-warning-rgb), 0.1);
    color: var(--color-warning);
  }
  
  &.method-delete {
    background-color: rgba(var(--color-danger-rgb), 0.1);
    color: var(--color-danger);
  }
  
  &.method-options,
  &.method-head {
    background-color: rgba(var(--color-info-rgb), 0.1);
    color: var(--color-info);
  }
}

.api-path {
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: var(--font-size-small);
  color: var(--color-text-primary);
  font-weight: 500;
  flex: 1;
  word-break: break-all;
  background-color: var(--color-light);
  padding: calc(var(--spacing-small) / 2) var(--spacing-small);
  border-radius: 4pt;
}

.api-content {
  margin-bottom: var(--spacing-medium);
}

.api-title {
  font-size: var(--font-size-medium);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-small);
  line-height: var(--line-height-small);
}

.api-group {
  margin-bottom: var(--spacing-small);
  
  .group-tag {
    background-color: var(--color-secondary);
    color: white;
    padding: calc(var(--spacing-small) / 2) var(--spacing-small);
    border-radius: 4pt;
    font-size: calc(var(--font-size-small) - 1pt);
    font-weight: 500;
    text-transform: capitalize;
  }
}

.api-params {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-small);
  margin-bottom: var(--spacing-small);
  
  .param-section {
    display: flex;
    align-items: center;
    gap: calc(var(--spacing-small) / 2);
    background-color: var(--color-light);
    padding: calc(var(--spacing-small) / 2) var(--spacing-small);
    border-radius: 4pt;
    font-size: var(--font-size-small);
    
    .param-type {
      font-weight: 600;
      color: var(--color-text-secondary);
    }
    
    .param-count {
      background-color: var(--color-primary);
      color: white;
      padding: 1px calc(var(--spacing-small) / 2);
      border-radius: 2pt;
      font-size: calc(var(--font-size-small) - 1pt);
      min-width: 16px;
      text-align: center;
    }
    
    i {
      color: var(--color-text-secondary);
    }
  }
}

.api-footer {
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-small);
}

.api-meta {
  display: flex;
  gap: var(--spacing-medium);
  
  .required-params,
  .optional-params {
    display: flex;
    align-items: center;
    gap: calc(var(--spacing-small) / 2);
    font-size: var(--font-size-small);
    
    span {
      color: var(--color-text-secondary);
    }
    
    i.text-warning {
      color: var(--color-warning);
    }
    
    i.text-info {
      color: var(--color-info);
    }
  }
}

// Dark theme adjustments
.dark-theme {
  .api-card {
    background-color: var(--color-light);
    
    &.selected {
      background-color: rgba(var(--color-primary-rgb), 0.1);
    }
  }
  
  .api-path,
  .api-params .param-section {
    background-color: var(--color-background);
  }
}
</style>
