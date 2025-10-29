<template>
  <div class="openapi-node-form">
    <div class="form-header">
      <h3 class="form-title">Select OpenAPI Endpoints</h3>
      <p class="form-description">Choose the API endpoints you want to include in your workflow.</p>
    </div>

    <div class="search-section">
      <UiInput
        v-model="searchQuery"
        placeholder="Search APIs..."
        left-icon="search"
        @input="handleSearch"
      />
    </div>

    <div class="apis-section">
      <div class="section-header">
        <h4 class="section-title">Available APIs ({{ filteredApis.length }})</h4>
        <div class="selection-info">
          {{ selectedApiIds.length }} selected
        </div>
      </div>

      <div class="apis-grid">
        <div v-for="(group, idx) in groupedApis" :key="group.name + idx" class="api-group-block">
          <div class="group-header">
            <strong>{{ group.name }}</strong>
            <span class="group-count">{{ group.apis.length }}</span>
          </div>
          <div class="group-cards">
            <OpenApiCard
              v-for="api in group.apis"
              :key="api.id"
              :api="api"
              :selected="selectedApiIds.includes(api.id)"
              @select="handleApiSelect"
            />
          </div>
        </div>
      </div>

      <div v-if="filteredApis.length === 0" class="empty-state">
        <i class="fas fa-search"></i>
        <p>No APIs found matching your search.</p>
      </div>
    </div>

    <div class="form-actions">
      <UiButton variant="secondary" @click="handleCancel">
        Cancel
      </UiButton>
      <UiButton 
        variant="primary" 
        :disabled="selectedApiIds.length === 0"
        @click="handleSave"
      >
        Add Selected APIs ({{ selectedApiIds.length }})
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
.openapi-node-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  max-height: 80vh;
}

.form-header {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-md);
}

.form-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.form-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.search-section {
  display: flex;
  gap: var(--spacing-md);
}

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
  border-bottom: 1px solid var(--color-border);
}

.section-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.selection-info {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-background-secondary);
  border-radius: var(--radius-sm);
}

.apis-grid {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  max-height: 400px;
  padding: var(--spacing-xs);
}

.api-group-block {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.group-cards {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
}

.group-count {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  color: var(--color-text-tertiary);
  text-align: center;
}

.empty-state i {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: var(--font-size-sm);
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}
</style>