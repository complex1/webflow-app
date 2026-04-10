<template>
  <nav class="webflow-breadcrumbs" aria-label="Web flow hierarchy">
    <Inline gap="xs" align="center">
      <template v-for="(crumb, index) in crumbs" :key="crumb.key">
        <button
          class="crumb"
          :class="{ 'is-active': crumb.id === activeId }"
          type="button"
          :disabled="crumb.id === activeId"
          @click="navigateTo(crumb.id, crumb.routeName)"
        >
          <Icon :name="crumb.icon" tone="secondary" v-if="crumb.icon" />
          <span>{{ crumb.label }}</span>
        </button>
        <span v-if="index < crumbs.length - 1" class="divider">/</span>
      </template>
      <Spinner v-if="loading" />
    </Inline>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Inline } from '@/components/common/foundation'
import { Icon } from '@/components/common/utils'
import { Spinner } from '@/components/common/feedback'
import { webFlowService, type WebflowHierarchyItem } from '@/services/webflow'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const crumbs = ref<Array<{ id: number | null; label: string; icon?: string; key: string, routeName: string }>>([])

const activeId = computed(() => {
  const param = route.query.id
  if (param === undefined || param === null) return null
  const value = Array.isArray(param) ? param[0] : param
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
})

const buildCrumbs = (items: WebflowHierarchyItem[]) => {
  const list: Array<{ id: number | null; label: string; icon?: string; key: string, routeName: string }> = [
    { id: null, label: 'Home', key: 'root', icon: 'home', routeName: 'webflows' }
  ]
  items.forEach((item) => {
    list.push({
      id: item.id,
      label: item.name,
      icon: item.icon?.replace('pi-', '') || (item.isFolder ? 'folder' : 'sitemap'),
      key: `crumb-${item.id}`,
      routeName: item.isFolder ? 'webflows' : 'webflow'
    })
  })
  crumbs.value = list
}

const fetchHierarchy = async () => {
  if (!activeId.value) {
    buildCrumbs([])
    return
  }
  loading.value = true
  try {
    const data = await webFlowService.getHierarchy(activeId.value)
    buildCrumbs(data.hierarchy || [])
  } catch (err) {
    console.error('Failed to load hierarchy', err)
  } finally {
    loading.value = false
  }
}

const navigateTo = (id: number | null, routeName: string) => {
  const query = { ...route.query }
  if (id === null) {
    delete query.id
  } else {
    query.id = String(id)
  }
  router.push({ name: routeName || 'webflows', query })
}

watch(activeId, () => {
  fetchHierarchy()
})

onMounted(() => {
  fetchHierarchy()
})
</script>

<style scoped>
.webflow-breadcrumbs {
  padding: var(--space-2) 0;
}

.webflow-breadcrumbs :deep(.af-inline) {
  flex-wrap: wrap;
}

.crumb {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.crumb:hover:not(.is-active) {
  color: var(--text-primary);
  background: color-mix(in srgb, var(--accent-blue) 15%, transparent);
}

.crumb.is-active {
  color: var(--text-primary);
  cursor: default;
}

.crumb:disabled {
  opacity: 0.7;
}

.divider {
  color: var(--text-muted);
}
</style>
