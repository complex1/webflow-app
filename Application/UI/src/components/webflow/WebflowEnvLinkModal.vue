<template>
  <Modal :open="open" title="Link environment files" @close="$emit('close')">
    <Stack gap="lg">
      <Text tone="secondary" variant="sm">Find and link environment files to this web flow.</Text>

      <div class="columns">
        <div class="surface column">
          <Inline justify="space-between" align="center" class="column__header">
            <Text variant="sm">Available</Text>
            <Pagination v-if="totalPages > 1" :page="page" :total-pages="totalPages" @update:page="setPage" compact />
          </Inline>
          <SearchInput v-model="search" placeholder="Search environment files" @update:modelValue="onSearch" />

          <div class="env-list" v-if="displayAvailable.length">
            <div v-for="env in displayAvailable" :key="env.id" class="env-item">
              <div class="env-item__body">
                <Text>{{ env.name }}</Text>
                <Text variant="xs" tone="muted">{{ env.description || 'No description' }}</Text>
              </div>
              <Button size="sm" :disabled="linking" @click="linkEnv(env.id)">Link</Button>
            </div>
          </div>
          <EmptyStateText v-else>No environment files found.</EmptyStateText>
        </div>

        <div class="surface column">
          <Inline justify="space-between" align="center" class="column__header">
            <Text variant="sm">Linked files</Text>
            <Text variant="xs" tone="muted">{{ linked.length }} total</Text>
          </Inline>
          <div v-if="linked.length" class="linked__cards">
            <div v-for="env in linked" :key="env.id" class="linked-card">
              <div class="linked-card__text">
                <Text>{{ env.name }}</Text>
                <Text variant="xs" tone="muted">{{ env.description || 'No description' }}</Text>
              </div>
              <Button size="sm" variant="ghost" :disabled="linking" @click="unlinkEnv(env.id)">Remove</Button>
            </div>
          </div>
          <EmptyStateText v-else>No linked files yet.</EmptyStateText>
        </div>
      </div>

      <Inline justify="flex-end" gap="sm">
        <Button variant="ghost" type="button" @click="$emit('close')">Close</Button>
      </Inline>
    </Stack>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { Modal } from '@/components/common/overlay'
import { Stack, Inline } from '@/components/common/foundation'
import { Text, EmptyStateText } from '@/components/common/typography'
import { Button } from '@/components/common/buttons'
import { SearchInput } from '@/components/common/forms'
import { Pagination } from '@/components/common/data'
import { environmentService } from '@/services/environment'
import { webFlowService } from '@/services/webflow'

const props = defineProps<{ open: boolean; webflowId: number | null }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'linked'): void }>()

const available = ref<Array<{ id: number; name: string; description?: string }>>([])
const linked = ref<Array<{ id: number; name: string; description?: string }>>([])
const search = ref('')
const page = ref(1)
const totalPages = ref(1)
const linking = ref(false)

const loadAvailable = async () => {
  const data = await environmentService.search(search.value, page.value, 8)
  available.value = data.envFiles
  totalPages.value = data.pagination.totalPages
}

const loadLinked = async () => {
  if (!props.webflowId) {
    linked.value = []
    return
  }
  const data = await webFlowService.getLinkedEnvFiles(props.webflowId, 1, 50)
  linked.value = data.envFiles
}

watch(
  () => props.open,
  (val) => {
    if (val) {
      page.value = 1
      loadAvailable()
      loadLinked()
    }
  }
)

const displayAvailable = computed(() =>
  available.value.filter((env) => !linked.value.some((item) => item.id === env.id))
)

const setPage = (val: number) => {
  page.value = val
  loadAvailable()
}

const onSearch = () => {
  page.value = 1
  loadAvailable()
}

const linkEnv = async (envId: number) => {
  if (!props.webflowId) return
  linking.value = true
  try {
    await webFlowService.linkEnvFile(props.webflowId, envId)
    await Promise.all([loadAvailable(), loadLinked()])
    emit('linked')
  } finally {
    linking.value = false
  }
}

const unlinkEnv = async (envId: number) => {
  if (!props.webflowId) return
  linking.value = true
  try {
    await webFlowService.unlinkEnvFile(props.webflowId, envId)
    await Promise.all([loadAvailable(), loadLinked()])
    emit('linked')
  } finally {
    linking.value = false
  }
}

onMounted(() => {
  if (props.open) {
    loadAvailable()
    loadLinked()
  }
})
</script>

<style scoped>
.env-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  max-height: 320px;
  overflow-y: auto;
}

.surface {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  background: var(--bg-elevated);
}

.columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--space-3);
}

.column {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.column__header {
  margin-bottom: var(--space-1);
}

.env-item {
  display: flex;
  justify-content: space-between;
  gap: var(--space-2);
  padding: var(--space-2);
  align-items: center;
  border-bottom: 1px solid var(--border-subtle);
}

.env-item__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.linked {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.linked__cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-2);
}

.linked-card {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-2);
  display: flex;
  justify-content: space-between;
  gap: var(--space-2);
  align-items: center;
}

.linked-card__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>
