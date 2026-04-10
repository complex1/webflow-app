<template>
  <Box background="transparent" :bordered="false" padding="lg" radius="lg">
    <Stack gap="md">
      <Inline justify="space-between" align="center">
        <div>
          <Heading :level="3">Web flows</Heading>
          <Text variant="sm" tone="secondary">Organize flows and folders for your workspace.</Text>
        </div>
        <Inline gap="sm">
          <WebflowImport @import="$emit('import', $event)" />
          <Button icon="plus" @click="$emit('create')">New web flow</Button>
        </Inline>
      </Inline>

      <div v-if="loading" class="webflow-list__loading">
        <Spinner />
        <Text tone="secondary">Loading web flows…</Text>
      </div>
      <EmptyStateText v-else-if="!rows.length">
        <template #title>No web flows yet</template>
        Start by creating a folder or flow to manage requests.
      </EmptyStateText>
      <template v-else>
        <div v-if="folders.length" class="webflow-section">
          <Heading :level="4">Folders</Heading>
          <div class="folder-grid">
            <div v-for="folder in folders" :key="folder.id" class="folder-card" @click="openFolder(folder.id)">
              <Inline justify="space-between" align="center" gap="sm" full-width>
                <Inline gap="sm" align="center">
                  <Icon :name="folder.icon || 'folder'" tone="primary" />
                  <Text>{{ folder.name }}</Text>
                </Inline>
                <Popover :open="folderMenuOpen === folder.id" @update:open="(value) => handleFolderMenu(folder.id, value)">
                  <IconButton icon="ellipsis-v" label="Folder actions" variant="ghost" size="sm" />
                  <template #content>
                    <div class="card-menu">
                      <button type="button" @click="editFolder(folder)">
                        <Icon name="pencil" class="card-menu__icon" />
                        <span>Edit</span>
                      </button>
                      <button type="button" class="danger" @click="deleteFolder(folder)">
                        <Icon name="trash" class="card-menu__icon" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </template>
                </Popover>
              </Inline>
            </div>
          </div>
        </div>

        <div v-if="flows.length" class="webflow-section">
          <Heading :level="4">Web flows</Heading>
          <div class="webflow-card-grid">
            <WebflowCard
              v-for="flow in flows"
              :key="flow.id"
              :webflow="flow"
              @edit="$emit('edit', flow)"
              @link="$emit('link', flow)"
              @delete="$emit('delete', flow)"
            />
          </div>
        </div>
      </template>

      <Pagination v-if="totalPages > 1" :page="page" :total-pages="totalPages" @update:page="$emit('update:page', $event)" />
    </Stack>
  </Box>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from 'vue'
import { Spinner } from '@/components/common/feedback'
import { Pagination } from '@/components/common/data'
import { WebflowCard } from '@/components/webflow'
import { Icon } from '@/components/common/utils'
import { Popover } from '@/components/common/overlay'
import type { WebFlow } from '@/services/webflow'
import { useRouter } from 'vue-router'
import WebflowImport from './WebflowImport.vue'

const props = defineProps<{
  rows: WebFlow[]
  page: number
  totalPages: number
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'create'): void
  (e: 'edit', flow: WebFlow): void
  (e: 'link', flow: WebFlow): void
  (e: 'delete', flow: WebFlow): void
  (e: 'update:page', page: number): void
  (e: 'import', data: any): void
}>()

const router = useRouter()
const { rows, page, totalPages } = toRefs(props)
const loading = computed(() => props.loading ?? false)
const folders = computed(() => rows.value.filter((item) => item.isFolder))
const flows = computed(() => rows.value.filter((item) => !item.isFolder))
const folderMenuOpen = ref<number | null>(null)

const handleFolderMenu = (id: number, open: boolean) => {
  folderMenuOpen.value = open ? id : folderMenuOpen.value === id ? null : folderMenuOpen.value
}

const closeFolderMenu = () => {
  folderMenuOpen.value = null
}

const editFolder = (folder: WebFlow) => {
  emit('edit', folder)
  closeFolderMenu()
}

const deleteFolder = (folder: WebFlow) => {
  emit('delete', folder)
  closeFolderMenu()
}

const openFolder = (id: number) => {
  router.push(`/webflows?id=${id}`)
}
</script>

<style scoped>
.webflow-list__loading {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.webflow-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.webflow-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 300px));
  gap: var(--space-3);
  justify-content: flex-start;
}

.folder-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-2);
}

.folder-card {
  border: 1px dashed var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-2);
  background: color-mix(in srgb, var(--bg-elevated) 80%, transparent);
  width: 300px;
}

.card-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-menu button {
  width: 100%;
  padding: 6px 8px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.card-menu button:hover {
  background: color-mix(in srgb, var(--accent-blue) 20%, transparent);
}

.card-menu button.danger {
  color: var(--accent-red);
}

.card-menu__icon {
  color: inherit;
}
</style>
