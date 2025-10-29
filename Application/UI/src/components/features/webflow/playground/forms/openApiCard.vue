<template>
  <div class="openapi-card" :class="{ selected }" @click="handleSelect">
    <!-- Row 1: Checkbox + Name -->
    <div class="card-row-1">
      <div class="selection-checkbox">
        <i :class="selected ? 'fas fa-check-square' : 'far fa-square'" 
           :style="{ color: selected ? 'var(--color-primary)' : 'var(--color-text-tertiary)' }"></i>
      </div>
      <div class="card-name">{{ api.name }}</div>
    </div>
    
    <!-- Row 2: Description -->
    <div v-if="api.description" class="card-row-2">
      <div class="card-description">{{ api.description }}</div>
    </div>
    
    <!-- Row 3: Method chip + URL -->
    <div class="card-row-3">
      <div class="api-method" :class="`method-${api.method.toLowerCase()}`">
        {{ api.method }}
      </div>
      <div class="api-url">{{ api.url }}</div>
    </div>
    
    <!-- Row 4: Parameters count -->
    <div class="card-row-4">
      <div class="api-params">
        <span v-if="api.pathParam?.length" class="param-count">
          <i class="fas fa-route"></i>
          {{ api.pathParam.length }} path
        </span>
        <span v-if="api.queryParam?.length" class="param-count">
          <i class="fas fa-search"></i>
          {{ api.queryParam.length }} query
        </span>
        <span v-if="api.header?.length" class="param-count">
          <i class="fas fa-header"></i>
          {{ api.header.length }} headers
        </span>
        <span v-if="api.body" class="param-count">
          <i class="fas fa-code"></i>
          body
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ExtractedField {
  name: string;
  required: boolean;
  type: string;
  description?: string;
}

interface ExtractedAPI {
  id: string;
  groupName: string;
  name: string;
  url: string;
  method: string;
  description?: string;
  header?: ExtractedField[];
  pathParam?: ExtractedField[];
  queryParam?: ExtractedField[];
  body?: any;
}

const props = defineProps<{
  api: ExtractedAPI;
  selected?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', api: ExtractedAPI): void;
}>();

const handleSelect = () => {
  emit('select', props.api);
};
</script>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({ name: 'OpenApiCard' });
</script>

<style scoped>
.openapi-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-background);
  padding: var(--spacing-md);
  cursor: pointer;
  margin-bottom: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.openapi-card.selected {
  border-color: var(--color-primary);
  background: var(--color-background-secondary);
}

.openapi-card:hover {
  border-color: var(--color-primary);
}

/* Row 1: Checkbox + Name */
.card-row-1 {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.selection-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.selection-checkbox i {
  font-size: var(--font-size-sm);
  cursor: pointer;
}

.card-name {
  font-weight: 600;
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Row 2: Description */
.card-row-2 {
  padding-left: calc(20px + var(--spacing-sm)); /* Align with name */
}

.card-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Row 3: Method + URL */
.card-row-3 {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding-left: calc(20px + var(--spacing-sm)); /* Align with name */
}

.api-method {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid var(--color-border);
  flex-shrink: 0;
}

.method-get {
  color: var(--color-success);
  border-color: var(--color-success);
  background: var(--color-background-secondary);
}

.method-post {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: var(--color-background-secondary);
}

.method-put {
  color: var(--color-warning);
  border-color: var(--color-warning);
  background: var(--color-background-secondary);
}

.method-delete {
  color: var(--color-error);
  border-color: var(--color-error);
  background: var(--color-background-secondary);
}

.api-url {
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  background: var(--color-background-secondary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Row 4: Parameters */
.card-row-4 {
  padding-left: calc(20px + var(--spacing-sm)); /* Align with name */
}

.api-params {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.param-count {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  padding: var(--spacing-xs);
  background: var(--color-background-secondary);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.param-count i {
  font-size: var(--font-size-xs);
}
</style>