<template>
  <Box class="webflow-card" background="secondary" radius="lg" padding="lg" @click="goToPlayground">
    <Stack gap="md">
      <Inline justify="space-between" align="flex-start" gap="md">
        <Inline gap="sm" align="flex-start">
          <div class="webflow-card__icon">
            <Icon v-if="iconName" :name="iconName" tone="primary" />
            <span v-else>{{ initials }}</span>
          </div>
          <div class="webflow-card__title">
            <Text class="webflow-card__name" :title="webflow.name">{{ webflow.name }}</Text>
            <Text variant="xs" tone="muted">{{ typeLabel }}</Text>
            <Text v-if="webflow.description" variant="xs" tone="secondary" class="webflow-card__description">
              {{ webflow.description }}
            </Text>
          </div>
        </Inline>
        <Popover v-model:open="menuOpen">
          <IconButton icon="ellipsis-v" label="Webflow actions" variant="ghost" size="sm" />
          <template #content>
            <div class="card-menu">
              <button type="button" @click="handleEdit">
                <Icon name="pencil" class="card-menu__icon" />
                <span>Edit</span>
              </button>
              <button type="button" @click="handleLink">
                <Icon name="link" class="card-menu__icon" />
                <span>Link env file</span>
              </button>
              <button type="button" class="danger" @click="handleDelete">
                <Icon name="trash" class="card-menu__icon" />
                <span>Delete</span>
              </button>
            </div>
          </template>
        </Popover>
      </Inline>

      <div class="webflow-card__meta">
        <div>
          <Text variant="xs" tone="muted">Updated</Text>
          <Text variant="sm">{{ formattedDate }}</Text>
        </div>
        <div>
          <Text variant="xs" tone="muted">Tags</Text>
          <div class="webflow-card__tags" v-if="webflow.tags?.length">
            <span v-for="tag in webflow.tags" :key="tag">{{ tag }}</span>
          </div>
          <Text v-else variant="sm">—</Text>
        </div>
      </div>
    </Stack>
  </Box>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Box, Stack, Inline } from '@/components/common/foundation'
import { Text } from '@/components/common/typography'
import { IconButton } from '@/components/common/buttons'
import { Popover } from '@/components/common/overlay'
import { Icon } from '@/components/common/utils'
import type { WebFlow } from '@/services/webflow'
import { useRouter } from 'vue-router'

const props = defineProps<{ webflow: WebFlow }>()
const router = useRouter()
const emit = defineEmits<{ (e: 'edit'): void; (e: 'delete'): void; (e: 'link'): void }>()
const menuOpen = ref(false)

const typeLabel = computed(() => (props.webflow.isFolder ? 'Folder' : 'Web flow'))

const formattedDate = computed(() => {
  if (!props.webflow.updatedAt) return '—'
  return new Date(props.webflow.updatedAt).toLocaleString()
})

const iconName = computed(() => {
  const icon = props.webflow.icon
  if (!icon) return 'sitemap'
  if (icon.startsWith('pi-')) return icon.replace('pi-', '')
  if (icon.startsWith('pi ')) return icon.replace('pi', '').trim().replace('pi-', '')
  if (/^[a-z-]+$/i.test(icon)) return icon
  return ''
})

const initials = computed(() => props.webflow.name.slice(0, 2).toUpperCase())

const handleEdit = () => {
  emit('edit')
  menuOpen.value = false
}

const handleLink = () => {
  emit('link')
  menuOpen.value = false
}

const handleDelete = () => {
  emit('delete')
  menuOpen.value = false
}

const goToPlayground = () => {
  if (props.webflow.isFolder) return
  router.push({ name: 'webflow-editor', query: { id: props.webflow.id } })
}
</script>

<style scoped>
.webflow-card {
  border: 1px solid var(--border-default);
  max-width: 300px;
}

.webflow-card__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-subtle);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--accent-blue) 15%, transparent);
  font-weight: 600;
}

.webflow-card__title {
  max-width: 320px;
}

.webflow-card__name {
  display: block;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.webflow-card__description {
  margin-top: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.webflow-card__meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--space-3);
}

.webflow-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  margin-top: 2px;
}

.webflow-card__tags span {
  background: color-mix(in srgb, var(--accent-blue) 25%, transparent);
  border-radius: var(--radius-full);
  padding: 2px 8px;
  font-size: var(--text-xs);
  white-space: nowrap;
}
</style>
