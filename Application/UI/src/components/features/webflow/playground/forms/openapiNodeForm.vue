<template>
  <div class="openapi-node-form">
    <!-- Form Header -->
    <div class="form-header">
      <div class="header-content">
        <div class="header-icon">
          <i class="fas fa-code-branch"></i>
        </div>
        <div class="header-info">
          <h3 class="form-title">OpenAPI Explorer</h3>
          <p class="form-description">
            Browse and select APIs from your OpenAPI specification to create API nodes.
          </p>
        </div>
      </div>
      
      <!-- Stats Badge -->
      <div class="stats-badge">
        <span class="total-count">{{ filteredApis.length }} APIs</span>
        <span class="selected-count" v-if="selectedApiIds.length > 0">
          {{ selectedApiIds.length }} selected
        </span>
      </div>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <div class="search-wrapper">
        <UiInput
          v-model="searchQuery"
          placeholder="Search APIs by name, description, or endpoint..."
          left-icon="search"
          @input="handleSearch"
          class="search-input"
        />
        <div class="search-stats" v-if="searchQuery">
          <i class="fas fa-filter"></i>
          <span>{{ filteredApis.length }} of {{ props.openapiApis.length }} APIs</span>
        </div>
      </div>
    </div>

    <!-- APIs Section -->
    <div class="apis-section">
      <div class="section-header">
        <div class="section-title-wrapper">
          <h4 class="section-title">
            <i class="fas fa-layer-group section-icon"></i>
            API Groups
          </h4>
          <span class="groups-count">({{ groupedApis.length }} groups)</span>
        </div>
        
        <!-- Quick Actions -->
        <div class="quick-actions">
          <button 
            @click="selectAll"
            class="quick-action-btn"
            :disabled="filteredApis.length === 0"
          >
            <i class="fas fa-check-square"></i>
            Select All
          </button>
          <button 
            @click="clearSelection"
            class="quick-action-btn"
            :disabled="selectedApiIds.length === 0"
          >
            <i class="fas fa-times"></i>
            Clear
          </button>
        </div>
      </div>

      <!-- APIs Grid -->
      <div class="apis-grid" v-if="groupedApis.length > 0">
        <div 
          v-for="(group, idx) in groupedApis" 
          :key="group.name + idx" 
          class="api-group-block"
        >
          <div class="group-header">
            <div class="group-info">
              <i class="fas fa-folder-open group-icon"></i>
              <strong class="group-name">{{ group.name }}</strong>
              <span class="group-count">{{ group.apis.length }} APIs</span>
            </div>
            <button 
              @click="toggleGroupSelection(group)"
              class="group-toggle-btn"
              :class="{ active: isGroupSelected(group) }"
            >
              <i class="fas" :class="isGroupSelected(group) ? 'fa-check-circle' : 'fa-circle'"></i>
            </button>
          </div>
          
          <div class="group-cards">
            <OpenApiCard
              v-for="api in group.apis"
              :key="api.id"
              :api="api"
              :selected="selectedApiIds.includes(api.id)"
              @select="handleApiSelect"
              class="api-card"
            />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-search"></i>
        </div>
        <h5 class="empty-title">No APIs Found</h5>
        <p class="empty-message">
          {{ searchQuery ? 
            `No APIs match your search "${searchQuery}". Try different keywords.` : 
            'No APIs available in your OpenAPI specification.' 
          }}
        </p>
        <button 
          v-if="searchQuery" 
          @click="clearSearch"
          class="clear-search-btn"
        >
          <i class="fas fa-times"></i>
          Clear Search
        </button>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="form-actions">
      <UiButton variant="secondary" @click="handleCancel">
        <i class="fas fa-times"></i>
        <span>Cancel</span>
      </UiButton>
      <UiButton 
        variant="primary" 
        :disabled="selectedApiIds.length === 0"
        @click="handleSave"
        class="save-btn"
      >
        <i class="fas fa-plus"></i>
        <span>Add Selected APIs</span>
        <span class="selection-badge" v-if="selectedApiIds.length > 0">
          {{ selectedApiIds.length }}
        </span>
      </UiButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import OpenApiCard from './openApiCard.vue';
import { UiInput, UiButton } from '@/components/base';
import type { ExtractedAPI } from '@/types';

const props = defineProps<{
  openapiApis: ExtractedAPI[];
}>();

const emit = defineEmits<{
  (e: 'on-save', selectedApis: ExtractedAPI[]): void;
  (e: 'on-cancel'): void;
}>();

const searchQuery = ref('');
const selectedApiIds = ref<string[]>([]);

const filteredApis = computed(() => {
  if (!searchQuery.value) {
    return props.openapiApis;
  }
  return props.openapiApis.filter(api =>
    api.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    api.description?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    api.groupName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    api.url.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const groupedApis = computed(() => {
  const map = new Map<string, ExtractedAPI[]>();
  for (const api of filteredApis.value) {
    const name = api.groupName || 'Ungrouped';
    if (!map.has(name)) map.set(name, []);
    map.get(name)!.push(api);
  }
  return Array.from(map.entries()).map(([name, apis]) => ({ name, apis }));
});

const handleSearch = () => {
  // Search is handled by the computed property
};

const handleApiSelect = (api: ExtractedAPI) => {
  const index = selectedApiIds.value.indexOf(api.id);
  if (index > -1) {
    selectedApiIds.value.splice(index, 1);
  } else {
    selectedApiIds.value.push(api.id);
  }
};

const selectAll = () => {
  selectedApiIds.value = filteredApis.value.map(api => api.id);
};

const clearSelection = () => {
  selectedApiIds.value = [];
};

const clearSearch = () => {
  searchQuery.value = '';
};

const toggleGroupSelection = (group: { name: string; apis: ExtractedAPI[] }) => {
  const groupApiIds = group.apis.map(api => api.id);
  const allSelected = groupApiIds.every(id => selectedApiIds.value.includes(id));
  
  if (allSelected) {
    // Remove all group APIs from selection
    selectedApiIds.value = selectedApiIds.value.filter(id => !groupApiIds.includes(id));
  } else {
    // Add all group APIs to selection
    groupApiIds.forEach(id => {
      if (!selectedApiIds.value.includes(id)) {
        selectedApiIds.value.push(id);
      }
    });
  }
};

const isGroupSelected = (group: { name: string; apis: ExtractedAPI[] }) => {
  const groupApiIds = group.apis.map(api => api.id);
  return groupApiIds.length > 0 && groupApiIds.every(id => selectedApiIds.value.includes(id));
};

const handleSave = () => {
  const selectedApis = props.openapiApis.filter(api => 
    selectedApiIds.value.includes(api.id)
  );
  emit('on-save', selectedApis);
};

const handleCancel = () => {
  emit('on-cancel');
};
</script>

<style scoped>
/* OpenAPI Node Form Container */
.openapi-node-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  position: relative;
}

/* Form Header */
.form-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-subtle);
  gap: var(--spacing-lg);
}

.header-content {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  flex: 1;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--color-primary-light);
  flex-shrink: 0;
}

.header-icon i {
  color: var(--color-primary);
  font-size: var(--font-size-xl);
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-title {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  letter-spacing: var(--letter-spacing-tight);
}

.form-description {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
}

.stats-badge {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

.total-count {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-background-secondary);
  border-radius: var(--radius-sm);
}

.selected-count {
  font-size: var(--font-size-xs);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-primary-light);
  border-radius: var(--radius-sm);
}

/* Search Section */
.search-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.search-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.search-input {
  width: 100%;
}

.search-stats {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  padding-left: var(--spacing-sm);
}

.search-stats i {
  color: var(--color-primary);
}

/* APIs Section */
.apis-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border-subtle);
  gap: var(--spacing-lg);
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.section-icon {
  color: var(--color-primary);
  font-size: var(--font-size-sm);
}

.groups-count {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  font-weight: var(--font-weight-normal);
}

.quick-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-background);
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.quick-action-btn:hover:not(:disabled) {
  background: var(--color-background-hover);
  border-color: var(--color-border-hover);
  color: var(--color-text-primary);
}

.quick-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quick-action-btn i {
  font-size: var(--font-size-xs);
}

/* APIs Grid */
.apis-grid {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-height: calc(100vh - 400px);
  padding: var(--spacing-xs);
  position: relative;
}

.api-group-block {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
}

.api-group-block:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-sm);
}

.group-header {
  position: sticky;
  top: -6px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-background-subtle);
  border-bottom: 1px solid var(--color-border-subtle);
}

.group-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.group-icon {
  color: var(--color-primary);
  font-size: var(--font-size-sm);
}

.group-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.group-count {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-background-secondary);
  border-radius: var(--radius-xs);
}

.group-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.group-toggle-btn:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

.group-toggle-btn.active {
  color: var(--color-primary);
}

.group-cards {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
}

.api-card {
  transition: all var(--transition-normal);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl);
  text-align: center;
  color: var(--color-text-tertiary);
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg);
  background: var(--color-background-secondary);
  margin-bottom: var(--spacing-lg);
}

.empty-icon i {
  font-size: var(--font-size-2xl);
  opacity: 0.5;
}

.empty-title {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
}

.empty-message {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  max-width: 400px;
}

.clear-search-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-background);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.clear-search-btn:hover {
  background: var(--color-background-hover);
  border-color: var(--color-border-hover);
  color: var(--color-text-primary);
}

/* Form Actions */
.form-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border-subtle);
}

.save-btn {
  position: relative;
}

.selection-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  background: var(--color-accent-amber);
  color: white;
  font-size: 10px;
  font-weight: var(--font-weight-bold);
  border-radius: var(--radius-full);
  padding: 0 var(--spacing-xs);
}

/* Scrollbar Styling */
.apis-grid::-webkit-scrollbar {
  width: 8px;
}

.apis-grid::-webkit-scrollbar-track {
  background: var(--color-background-secondary);
  border-radius: var(--radius-xs);
}

.apis-grid::-webkit-scrollbar-thumb {
  background: var(--color-border-hover);
  border-radius: var(--radius-xs);
}

.apis-grid::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}

/* Responsive Design */
@media (max-width: 768px) {
  .openapi-node-form {
    padding: var(--spacing-lg);
    margin: var(--spacing-md);
    gap: var(--spacing-lg);
  }

  .form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }

  .stats-badge {
    align-items: flex-start;
    flex-direction: row;
    gap: var(--spacing-sm);
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .quick-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .form-actions {
    flex-direction: column-reverse;
    gap: var(--spacing-sm);
  }

  .form-actions .btn {
    width: 100%;
  }

  .apis-grid {
    max-height: 350px;
  }
}

@media (max-width: 480px) {
  .openapi-node-form {
    padding: var(--spacing-md);
  }

  .header-icon {
    width: 40px;
    height: 40px;
  }

  .header-icon i {
    font-size: var(--font-size-lg);
  }

  .form-title {
    font-size: var(--font-size-lg);
  }

  .form-description {
    font-size: var(--font-size-xs);
  }

  .apis-grid {
    max-height: 300px;
  }
}

/* Focus States */
.openapi-node-form:focus-within {
  border-color: var(--color-primary-light);
}

/* Loading State */
.openapi-node-form.loading {
  opacity: 0.7;
  pointer-events: none;
}

.openapi-node-form.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
  border-radius: var(--radius-lg);
}
</style>