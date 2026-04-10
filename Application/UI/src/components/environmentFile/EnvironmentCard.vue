<template>
  <Box class="env-card" background="secondary" radius="lg" padding="lg">
    <Stack gap="sm">
      <Inline justify="space-between" align="center">
        <div class="env-card__title">
          <Text class="env-card__name" :title="environment.name">{{ environment.name }}</Text>
          <Text
            variant="xs"
            tone="muted"
            class="env-card__description"
            :title="environment.description || 'No description'"
          >
            {{ environment.description || 'No description' }}
          </Text>
        </div>
        <Popover v-model:open="menuOpen">
          <IconButton icon="ellipsis-v" label="Environment actions" variant="ghost" size="sm" />
          <template #content>
            <div class="card-menu">
              <button type="button" @click="handleView">
                <Icon name="eye" class="card-menu__icon" />
                <span>View</span>
              </button>
              <button type="button" @click="handleEdit">
                <Icon name="pencil" class="card-menu__icon" />
                <span>Edit</span>
              </button>
              <button type="button" @click="handleClone">
                <Icon name="copy" class="card-menu__icon" />
                <span>Clone</span>
              </button>
              <button type="button" class="danger" @click="handleDelete">
                <Icon name="trash" class="card-menu__icon" />
                <span>Delete</span>
              </button>
            </div>
          </template>
        </Popover>
      </Inline>

      <div class="env-card__meta">
        <div>
          <Text variant="xs" tone="muted">Updated</Text>
          <Text variant="sm">{{ formattedDate }}</Text>
        </div>
        <div>
          <Text variant="xs" tone="muted">Variables</Text>
          <Text variant="sm">{{ environment.configs?.length || 0 }}</Text>
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
import type { EnvFile } from '@/services/environment'

const props = defineProps<{ environment: EnvFile }>()
const emit = defineEmits<{ (e: 'view'): void; (e: 'edit'): void; (e: 'delete'): void; (e: 'clone'): void }>()
const menuOpen = ref(false)

const formattedDate = computed(() => {
  if (!props.environment.updatedAt) return '—'
  return new Date(props.environment.updatedAt).toLocaleString()
})

const closeMenu = () => {
  menuOpen.value = false
}

const handleView = () => {
  emit('view')
  closeMenu()
}

const handleEdit = () => {
  emit('edit')
  closeMenu()
}

const handleDelete = () => {
  emit('delete')
  closeMenu()
}

const handleClone = () => {
  emit('clone')
  closeMenu()
}
</script>

<style scoped>
.env-card {
  border: 1px solid var(--border-default);
}

.env-card__title {
  max-width: 65%;
}

.env-card__name,
.env-card__description {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.env-card__meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}
</style>
