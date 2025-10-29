<template>
  <nav class="breadcrumb" aria-label="breadcrumb" v-if="hierarchy.length > 0">
    <ol class="breadcrumb-list">
      <!-- Root/Home item -->
      <li class="breadcrumb-item">
        <router-link 
          :to="{ path: $route.path }" 
          class="breadcrumb-link breadcrumb-home"
          :class="{ active: !currentWfid }"
        >
          <i class="fas fa-home"></i>
          <span>Home</span>
        </router-link>
      </li>

      <!-- Hierarchy items -->
      <li 
        v-for="(item, index) in hierarchy" 
        :key="item.id" 
        class="breadcrumb-item"
      >
        <i class="breadcrumb-separator fas fa-chevron-right"></i>
        <router-link 
          v-if="index < hierarchy.length - 1 || !isLastItemActive"
          :to="{ path: $route.path, query: { ...$route.query, wfid: item.id } }" 
          class="breadcrumb-link"
        >
          <i :class="item.icon"></i>
          <span>{{ item.name }}</span>
        </router-link>
        <span 
          v-else 
          class="breadcrumb-current"
        >
          <i :class="item.icon"></i>
          <span>{{ item.name }}</span>
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { webFlowService } from '@/services/webflow'
import type { WebflowHierarchy } from '@/types'
import { toast } from '@/utils'

interface Props {
  isLastItemActive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLastItemActive: false
})

// Router
const route = useRoute()

// State
const hierarchy = ref<WebflowHierarchy[]>([])
const loading = ref(false)

// Computed
const currentWfid = computed(() => route.query.wfid as string | undefined)

// Fetch hierarchy data
const fetchHierarchy = async (wfid: string | number) => {
  try {
    loading.value = true
    const response = await webFlowService.getHierarchy(Number(wfid))
    hierarchy.value = response.hierarchy
  } catch (error) {
    console.error('Failed to fetch hierarchy:', error)
    toast.error('Failed to load breadcrumb navigation')
    hierarchy.value = []
  } finally {
    loading.value = false
  }
}

// Watch for wfid changes
watch(
  () => route.query.wfid,
  (newWfid) => {
    if (newWfid && typeof newWfid === 'string') {
      fetchHierarchy(newWfid)
    } else if (Array.isArray(newWfid) && newWfid.length > 0 && newWfid[0]) {
      fetchHierarchy(newWfid[0])
    } else {
      hierarchy.value = []
    }
  },
  { immediate: true }
)

// Initialize on mount
onMounted(() => {
  const wfid = currentWfid.value
  if (wfid && typeof wfid === 'string') {
    fetchHierarchy(wfid)
  }
})
</script>

<style scoped>
.breadcrumb {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: var(--spacing-xs);
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.breadcrumb-separator {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
  margin: 0 var(--spacing-xs);
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  min-height: 32px;
}

.breadcrumb-link:hover {
  background: var(--color-gray-50);
  color: var(--color-primary);
  text-decoration: none;
}

.breadcrumb-link.active {
  background: var(--color-primary-50);
  color: var(--color-primary);
}

.breadcrumb-home {
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.breadcrumb-home:hover {
  background: var(--color-primary-50);
}

.breadcrumb-current {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  min-height: 32px;
}

.breadcrumb-link i,
.breadcrumb-current i {
  font-size: var(--font-size-sm);
  width: 16px;
  text-align: center;
}

/* Theme support removed for monochromatic design */

/* Responsive design */

/* Truncate long names */
.breadcrumb-link span,
.breadcrumb-current span {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
