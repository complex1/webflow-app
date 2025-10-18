<template>
  <div class="webflow-header">
    <div class="header-content">
      <!-- Title Section -->
      <div class="header-title">
        <h1 class="title">Web Flows</h1>
        <!-- Breadcrumb Navigation -->
      <UiWebflowBreadcrumb />
      </div>

      <!-- Actions Section -->
      <div class="header-actions">
        <!-- Search Box -->
        <div class="search-container">
          <UiInput
            v-model="searchQuery"
            placeholder="Search web flows..."
            left-icon="search"
            size="md"
            class="search-input"
            @input="handleSearch"
            @clear="handleSearchClear"
          />
        </div>

        <!-- Add Button -->
        <UiButton
          variant="primary"
          size="md"
          icon="plus"
          @click="handleAdd"
          class="add-button"
        >
          Add Web Flow
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UiInput, UiButton } from '@/components/base'
import UiWebflowBreadcrumb from '@/components/base/UiWebflowBreadcrumb.vue';

interface Props {
  initialSearch?: string
}

const props = withDefaults(defineProps<Props>(), {
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
.webflow-header {
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-lg) var(--spacing-xl);
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
  font-size: var(--font-size-3xl);
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

/* Dark theme support */
[data-theme="dark"] .webflow-header {
  background: var(--color-gray-800);
  border-color: var(--color-gray-700);
}

[data-theme="dark"] .title {
  color: var(--color-text-inverse);
}

[data-theme="dark"] .subtitle {
  color: var(--color-gray-400);
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
  .webflow-header {
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
}

@media (max-width: 480px) {
  .webflow-header {
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
