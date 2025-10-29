<template>
  <div
    class="api-card glass-panel"
    :class="{ selected: selected }"
    @click="handleSelect"
  >
    <!-- Card Header: Selection + Name + Method Badge -->
    <div class="card-header">
      <div class="selection-area">
        <div class="selection-checkbox" :class="{ checked: selected }">
          <i class="fas fa-check" v-if="selected"></i>
        </div>
      </div>
      <div class="card-title-row">
        <h4 class="api-name">{{ api.name }}</h4>
      </div>
    </div>
    <div class="card-content">
      <div class="endpoint-section">
        <div class="method-badge" :class="`method-${api.method.toLowerCase()}`">
          {{ api.method.toUpperCase() }}
        </div>
        <code class="endpoint-url">{{ api.url }}</code>
      </div>
    </div>
    <!-- Card Footer: Parameters Info -->
    <div class="card-footer" v-if="hasParameters">
      <div class="parameters-grid">
        <div v-if="api.pathParam?.length" class="param-chip path-params">
          <i class="fas fa-route"></i>
          <span>{{ api.pathParam.length }} Path</span>
        </div>
        <div v-if="api.queryParam?.length" class="param-chip query-params">
          <i class="fas fa-filter"></i>
          <span>{{ api.queryParam.length }} Query</span>
        </div>
        <div v-if="api.header?.length" class="param-chip header-params">
          <i class="fas fa-list"></i>
          <span>{{ api.header.length }} Headers</span>
        </div>
        <div v-if="api.body" class="param-chip body-params">
          <i class="fas fa-code"></i>
          <span>Request Body</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

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
  (e: "select", api: ExtractedAPI): void;
}>();

const hasParameters = computed(() => {
  return !!(
    props.api.pathParam?.length ||
    props.api.queryParam?.length ||
    props.api.header?.length ||
    props.api.body
  );
});

const handleSelect = () => {
  emit("select", props.api);
};
</script>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({ name: "OpenApiCard" });
</script>

<style scoped>
/* ===== API Card - Neo-Systemic Design ===== */
.api-card {
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-spring);
  overflow: hidden;
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}

.api-card:hover {
  border-color: var(--color-primary);
}

.api-card.selected {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.api-card.selected::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--gradient-primary);
  z-index: 1;
}

/* ===== Card Header ===== */
.card-header {
  display: flex;
  gap: var(--spacing-md);
  background-color: transparent;
  padding: 0;
  border-bottom: none;
  margin-bottom: var(--spacing-sm);
}

.selection-area {
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  padding-top: 2px;
}

.selection-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background);
  transition: all var(--transition-fast);
  position: relative;
}

.selection-checkbox.checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

.selection-checkbox i {
  font-size: var(--font-size-xs);
  opacity: 0;
  transform: scale(0.5);
  transition: all var(--transition-fast);
}

.selection-checkbox.checked i {
  opacity: 1;
  transform: scale(1);
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.api-name {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin: 0 0 var(--spacing-md) 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== Method Badge ===== */
.method-badge {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
  border: 1px solid;
  flex-shrink: 0;
  line-height: 1;
}

.method-get {
  color: var(--color-success);
  background: var(--color-success-light);
  border-color: var(--color-success);
}

.method-post {
  color: var(--color-primary);
  background: var(--color-primary-light);
  border-color: var(--color-primary);
}

.method-put {
  color: var(--color-warning);
  background: var(--color-warning-light);
  border-color: var(--color-warning);
}

.method-patch {
  color: var(--color-info);
  background: var(--color-info-light);
  border-color: var(--color-info);
}

.method-delete {
  color: var(--color-danger);
  background: var(--color-danger-light);
  border-color: var(--color-danger);
}

/* ===== Endpoint Section ===== */
.endpoint-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.endpoint-url {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  display: block;
  word-break: break-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
}

/* ===== Card Footer: Parameters ===== */
.card-footer {
  border-top: none;
  background: transparent;
  padding: 0;
}

.parameters-grid {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.param-chip {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  border: 1px solid;
  background: var(--color-background);
  transition: all var(--transition-fast);
}

.param-chip i {
  font-size: var(--font-size-xs);
  opacity: 0.8;
}

.path-params {
  color: var(--color-info);
  border-color: var(--color-info);
  background: var(--color-info-light);
}

.query-params {
  color: var(--color-warning);
  border-color: var(--color-warning);
  background: var(--color-warning-light);
}

.header-params {
  color: var(--color-text-secondary);
  border-color: var(--color-border);
  background: var(--color-background-subtle);
}

.body-params {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

/* ===== Responsive Design ===== */
@media (max-width: 768px) {
  .api-card {
    padding: var(--spacing-md);
  }

  .card-title-row {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: flex-start;
  }

  .parameters-grid {
    justify-content: flex-start;
  }

  .param-chip {
    font-size: 10px;
    padding: 4px 8px;
  }
}

/* ===== Animation ===== */
@keyframes pulse-glow {
  0%,
  100% {
    transform: scale(1);
    box-shadow: var(--shadow-md);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 122, 255, 0.4);
  }
}
</style>