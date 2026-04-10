<template>
  <div class="openapi-selector">
    <div class="openapi-selector__header">
      <h3>Available APIs</h3>
      <SearchInput
        v-model="search"
        placeholder="Filter by name or URL"
        size="sm"
      />
    </div>

    <div class="openapi-selector__list">
      <div v-for="(apis, group) in groupedApis" :key="group" class="openapi-group">
        <div class="openapi-group__header">
          <p class="group-name">{{ group || 'Ungrouped' }}</p>
          <span class="group-count">{{ apis.length }} APIs</span>
        </div>

        <div class="openapi-group__grid">
          <label
            v-for="api in apis"
            :key="api.id"
            class="api-card"
          >
            <div class="api-card__row">
              <input
                type="checkbox"
                :value="api.id"
                v-model="selectedIds"
              />
              <p class="api-name">{{ api.name }}</p>
            </div>
            <div class="api-card__row api-card__row--meta">
              <span class="api-method" :data-variant="methodVariant(api.method)">{{ api.method }}</span>
              <p class="api-url">{{ api.url }}</p>
            </div>
          </label>
        </div>
      </div>
    </div>

    <div class="openapi-selector__footer">
      <Button variant="ghost" @click="emit('cancel')">Cancel</Button>
      <Button variant="primary" @click="handleAdd">Add</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWebflowEditorStore } from '@/stores/webflowEditor'
import type { ExtractedAPI } from '@/types'
import { SearchInput } from '@/components/common/forms'
import { Button } from '@/components/common/buttons'

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'add', apis: ExtractedAPI[]): void
}>()

const store = useWebflowEditorStore()
const search = ref('')
const selectedIds = ref<string[]>([])

const filteredApis = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return store.openapiApis
  return store.openapiApis.filter((api) => {
    const name = api.name?.toLowerCase() || ''
    const url = api.url?.toLowerCase() || ''
    return name.includes(term) || url.includes(term)
  })
})

const groupedApis = computed(() => {
  return filteredApis.value.reduce<Record<string, ExtractedAPI[]>>((acc, api) => {
    const key = api.groupName || 'Ungrouped'
    if (!acc[key]) acc[key] = []
    acc[key].push(api)
    return acc
  }, {})
})

const handleAdd = () => {
  const selected = store.openapiApis.filter((api) => selectedIds.value.includes(api.id))
  emit('add', selected)
}

const methodVariant = (method: string) => {
  const upper = (method || '').toUpperCase()
  if (upper === 'GET') return 'get'
  if (upper === 'POST') return 'post'
  if (upper === 'PUT') return 'put'
  if (upper === 'PATCH') return 'patch'
  if (upper === 'DELETE') return 'delete'
  return 'default'
}
</script>

<style scoped>
.openapi-selector {
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: var(--text-primary);
}

.openapi-selector__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.openapi-selector__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: calc(100vh - 250px);
  overflow-y: auto;
}

.openapi-group {
  border: 1px solid var(--border-default);
  border-radius: 12px;
  padding: 12px;
  background: var(--bg-secondary);
}

.openapi-group__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.group-name {
  margin: 0;
  font-size: 14px;
  color: var(--text-primary);
}

.group-count {
  font-size: 12px;
  color: var(--text-muted);
}

.openapi-group__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
}

.api-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid var(--border-default);
  border-radius: 10px;
  padding: 12px;
  background: var(--bg-elevated);
  color: var(--text-primary);
  cursor: pointer;
  transition: border var(--transition-default), background var(--transition-default);
}

.api-card__row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.api-card__row--meta {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 10px;
}

.api-method {
  font-size: 12px;
  color: var(--accent-blue);
  font-weight: 600;
  border: 1px solid color-mix(in srgb, var(--accent-blue) 40%, transparent);
  background: color-mix(in srgb, var(--accent-blue) 10%, transparent);
  padding: 4px 8px;
  border-radius: 8px;
  text-transform: uppercase;
}

.api-method[data-variant="get"] {
  color: var(--accent-blue);
  border-color: color-mix(in srgb, var(--accent-blue) 40%, transparent);
  background: color-mix(in srgb, var(--accent-blue) 10%, transparent);
}

.api-method[data-variant="post"] {
  color: var(--success-green);
  border-color: color-mix(in srgb, var(--success-green) 40%, transparent);
  background: color-mix(in srgb, var(--success-green) 10%, transparent);
}

.api-method[data-variant="put"],
.api-method[data-variant="patch"] {
  color: var(--warning-yellow);
  border-color: color-mix(in srgb, var(--warning-yellow) 40%, transparent);
  background: color-mix(in srgb, var(--warning-yellow) 10%, transparent);
}

.api-method[data-variant="delete"] {
  color: var(--error-red);
  border-color: color-mix(in srgb, var(--error-red) 40%, transparent);
  background: color-mix(in srgb, var(--error-red) 10%, transparent);
}

.api-name {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.api-url {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
  word-break: break-all;
}

.api-card:hover {
  border-color: var(--accent-blue);
  background: color-mix(in srgb, var(--accent-blue) 8%, transparent);
}

.openapi-selector__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
