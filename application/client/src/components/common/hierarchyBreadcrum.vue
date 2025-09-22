<template>
  <div class="hierarchy-breadcrumb">
    <div v-if="loading" class="breadcrumb-loading">
      <i class="pi pi-spin pi-spinner"></i>
      <span>Loading...</span>
    </div>
    
    <nav v-else-if="hierarchy.length > 0" class="breadcrumb-nav" aria-label="Breadcrumb">
      <ol class="breadcrumb-list">
        <li class="breadcrumb-item">
          <router-link :to="'/dashboard'" class="breadcrumb-link">
            <i class="pi pi-home icon"></i>
            <span class="breadcrumb-text">Home</span>
          </router-link>
          <span class="breadcrumb-separator" aria-hidden="true">
            <i class="pi pi-angle-right"></i>
          </span>
        </li>
        <li 
          v-for="(item, index) in hierarchy" 
          :key="item.id"
          class="breadcrumb-item"
          :class="{ 'is-current': index === hierarchy.length - 1 }"
        >
          <router-link
            v-if="index < hierarchy.length - 1"
            :to="'/dashboard?id=' + item.id"
            class="breadcrumb-link"
          >
            <i v-if="item.isFolder" class="pi pi-folder icon folder-icon"></i>
            <i v-else class="pi pi-file icon file-icon"></i>
            <span class="breadcrumb-text">{{ item.name }}</span>
          </router-link>
          
          <span v-else class="breadcrumb-current">
            <i v-if="item.isFolder" class="pi pi-folder icon folder-icon"></i>
            <i v-else class="pi pi-file icon file-icon"></i>
            <span class="breadcrumb-text">{{ item.name }}</span>
          </span>
          
          <span 
            v-if="index < hierarchy.length - 1" 
            class="breadcrumb-separator"
            aria-hidden="true"
          >
            <i class="pi pi-angle-right"></i>
          </span>
        </li>
      </ol>
    </nav>
    
    <div v-else class="breadcrumb-empty">
      <router-link :to="'/dashboard'" class="breadcrumb-link">
        <i class="pi pi-home icon"></i>
        <span class="breadcrumb-text">Home</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { WebflowService } from '../../services/webflow.service';

// Types
interface HierarchyItem {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  tags?: string[];
  openApiDocConfig?: {
    enabled: boolean;
    url: string;
    baseUrl?: string;
  };
  createdAt: Date;
  parentId?: string;
  isFolder?: boolean;
}

// Reactive data
const route = useRoute();
const webflowService = new WebflowService();
const hierarchy = ref<HierarchyItem[]>([]);
const loading = ref(false);

// Fetch hierarchy for given ID
const fetchHierarchy = async (id: string) => {
  if (!id) {
    hierarchy.value = [];
    return;
  }

  try {
    loading.value = true;
    const result = await webflowService.getHierarchy(id) as HierarchyItem[];
    hierarchy.value = result;
  } catch (error) {
    console.error('Error fetching hierarchy:', error);
    hierarchy.value = [];
  } finally {
    loading.value = false;
  }
};

// Watch for route changes
watch(
  () => route.query.id,
  async (newId) => {
    if (newId && typeof newId === 'string') {
      await fetchHierarchy(newId);
    } else {
      hierarchy.value = [];
    }
  },
  { immediate: true }
);

// Initialize on mount
onMounted(() => {
  const id = route.query.id;
  if (id && typeof id === 'string') {
    fetchHierarchy(id);
  }
});
</script>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HierarchyBreadcrumb'
});
</script>

<style scoped>
.hierarchy-breadcrumb {
}

.breadcrumb-loading {
  display: flex;
  align-items: center;
  gap: var(--spacing-medium);
  color: var(--color-text-secondary);
  font-size: var(--font-size-small);
}

.breadcrumb-nav {
  width: 100%;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: var(--spacing-small);
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-small);
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-medium);
  padding: var(--spacing-medium);
  border-radius: var(--spacing-small);
  color: var(--color-text-primary);
  text-decoration: none;
  font-size: var(--font-size-small);
  font-weight: 500;
  transition: all 0.15s ease;
  max-width: 200px;
}

.breadcrumb-link:hover {
  background-color: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary);
}

.breadcrumb-current {
  display: flex;
  align-items: center;
  gap: var(--spacing-medium);
  padding: var(--spacing-medium) var(--spacing-large);
  color: var(--color-text-primary);
  font-size: var(--font-size-small);
  font-weight: 600;
  max-width: 200px;
}

.breadcrumb-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.breadcrumb-separator {
  color: var(--color-text-secondary);
  font-weight: 400;
  margin: 0 var(--spacing-small);
  user-select: none;
  font-size: var(--font-size-small);
}

.breadcrumb-empty {
  display: flex;
  align-items: center;
}

.icon {
  font-size: var(--font-size-medium);
  line-height: 1;
  flex-shrink: 0;
}

.folder-icon {
  color: var(--color-warning);
}

.file-icon {
  color: var(--color-primary);
}

/* Responsive design */
@media (max-width: 640px) {
  .hierarchy-breadcrumb {
    padding: var(--spacing-medium) 0;
  }
  
  .breadcrumb-link,
  .breadcrumb-current {
    padding: var(--spacing-small) var(--spacing-medium);
    font-size: var(--font-size-small);
    max-width: 120px;
  }
  
  .breadcrumb-text {
    max-width: 80px;
  }
  
  .breadcrumb-list {
    gap: 2px;
  }
  
  .breadcrumb-separator {
    margin: 0 2px;
  }
  
  .icon {
    font-size: var(--font-size-small);
  }
}

/* Current item styling */
.breadcrumb-item.is-current .breadcrumb-current {
  background-color: rgba(var(--color-primary-rgb), 0.1);
  border-radius: var(--spacing-small);
  color: var(--color-primary);
}

/* Loading spinner */
.breadcrumb-loading .pi-spinner {
  color: var(--color-primary);
}
</style>
