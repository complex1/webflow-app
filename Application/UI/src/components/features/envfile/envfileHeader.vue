<template>
  <div class="envfile-header">
    <div class="header-content">
      <!-- Title Section -->
      <div class="header-title">
        <h1 class="title">Environment Files</h1>
        <p class="subtitle">Manage your environment configurations</p>
      </div>

      <!-- Actions Section -->
      <div class="header-actions">
        <!-- Search Box -->
        <div class="search-container">
          <UiInput
            v-model="searchQuery"
            placeholder="Search environment files..."
            left-icon="search"
            size="sm"
            class="search-input"
            @input="handleSearch"
            @clear="handleSearchClear"
          />
        </div>

        <!-- Add Button -->
        <UiButton
          variant="primary"
          size="sm"
          icon="plus"
          @click="handleAdd"
          class="add-button"
        >
          Add Environment File
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { UiInput, UiButton } from '@/components/base'

interface Props {
  showStats?: boolean
  totalFiles?: number
  activeFiles?: number
  lastUpdated?: string
  initialSearch?: string
}

const props = withDefaults(defineProps<Props>(), {
  showStats: true,
  initialSearch: ''
})

const emit = defineEmits<{
  search: [query: string]
  searchClear: []
  add: []
}>()

const searchQuery = ref(props.initialSearch)

const handleSearch = (event: Event) => {
  const target = event.target as HTMLInputElement
  const query = target.value.trim()
  emit('search', query)
}

const handleSearchClear = () => {
  searchQuery.value = ''
  emit('searchClear')
}

const handleAdd = () => {
  emit('add')
}

// Expose methods for parent component
defineExpose({
  clearSearch: () => {
    searchQuery.value = ''
    emit('searchClear')
  },
  setSearch: (query: string) => {
    searchQuery.value = query
    emit('search', query)
  }
})
</script>

<style scoped>
.envfile-header {
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-sm) var(--spacing-sm);
  box-shadow: var(--shadow-sm);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-xl);
}

.header-title {
  flex: 1;
  min-width: 0;
}

.title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-dark);
  margin: 0 0 var(--spacing-xs) 0;
  line-height: 1.2;
}

.subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
  font-weight: var(--font-weight-medium);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-shrink: 0;
}

.search-container {
  min-width: 300px;
  max-width: 400px;
}

.search-input {
  width: 100%;
}

.add-button {
  white-space: nowrap;
  font-weight: var(--font-weight-semibold);
}

.header-stats {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-gray-100);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.stat-value {
  font-size: var(--font-size-sm);
  color: var(--color-primary-dark);
  font-weight: var(--font-weight-semibold);
}

/* Dark theme support */
[data-theme="dark"] .envfile-header {
  background: var(--color-gray-800);
  border-color: var(--color-gray-700);
}

[data-theme="dark"] .title {
  color: var(--color-text-inverse);
}

[data-theme="dark"] .subtitle {
  color: var(--color-gray-400);
}

[data-theme="dark"] .header-stats {
  border-color: var(--color-gray-700);
}

[data-theme="dark"] .stat-label {
  color: var(--color-gray-400);
}

[data-theme="dark"] .stat-value {
  color: var(--color-primary);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-lg);
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .search-container {
    min-width: 200px;
    flex: 1;
  }
}

@media (max-width: 768px) {
  .envfile-header {
    padding: var(--spacing-md) var(--spacing-lg);
  }

  .title {
    font-size: var(--font-size-2xl);
  }

  .header-actions {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
  }

  .search-container {
    min-width: auto;
    max-width: none;
  }

  .add-button {
    width: 100%;
  }

  .header-stats {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
}

@media (max-width: 480px) {
  .envfile-header {
    padding: var(--spacing-md);
  }

  .title {
    font-size: var(--font-size-xl);
  }

  .subtitle {
    font-size: var(--font-size-xs);
  }
}
</style>
