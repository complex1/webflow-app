<template>
  <AppLayout>
    <template #logo>
      <Heading :level="3">Web Flows</Heading>
    </template>

    <Alert v-if="error" variant="error" dismissible @dismiss="error = ''">
      {{ error }}
    </Alert>

    <WebflowBreadcrumbs />

    <WebflowList
      :rows="webflows"
      :loading="loading"
      :page="page"
      :total-pages="totalPages"
      @create="startCreate"
      @edit="startEdit"
      @link="openLinkModal"
      @delete="promptDelete"
      @import="importWebflow"
      @update:page="setPage"
    />

    <WebflowDrawer :open="drawerOpen" :webflow="editingFlow" @close="closeDrawer" @save="saveWebflow" />

    <WebflowDeleteConfirm :open="deleteOpen" :webflow="deleteFlow" @close="closeDelete" @confirm="confirmDelete" />

    <WebflowEnvLinkModal
      :open="linkOpen"
      :webflow-id="linkFlow?.id || null"
      :linked-ids="linkedEnvIds"
      @close="closeLinkModal"
      @linked="refreshLinks"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Heading } from '@/components/common/typography'
import { Alert } from '@/components/common/feedback'
import { WebflowList, WebflowDrawer, WebflowDeleteConfirm, WebflowBreadcrumbs, WebflowEnvLinkModal } from '@/components'
import { webFlowService, type WebFlow, type UpsertWebFlowPayload } from '@/services/webflow'

const webflows = ref<WebFlow[]>([])
const loading = ref(false)
const error = ref('')
const page = ref(1)
const totalPages = ref(1)

const drawerOpen = ref(false)
const deleteOpen = ref(false)
const editingFlow = ref<WebFlow | null>(null)
const deleteFlow = ref<WebFlow | null>(null)
const linkOpen = ref(false)
const linkFlow = ref<WebFlow | null>(null)
const linkedEnvIds = ref<number[]>([])

const route = useRoute()

const parentId = computed(() => {
  const value = route.query.id
  if (value === undefined || value === null) return null
  const str = Array.isArray(value) ? value[0] : value
  const parsed = Number(str)
  return Number.isFinite(parsed) ? parsed : null
})

const fetchWebflows = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await webFlowService.list(parentId.value, page.value)
    webflows.value = data.webFlows
    totalPages.value = data.pagination.totalPages
  } catch (err: any) {
    error.value = err?.response?.data?.error || 'Failed to load web flows'
  } finally {
    loading.value = false
  }
}

onMounted(fetchWebflows)
watch(page, () => fetchWebflows())
watch(parentId, () => {
  if (page.value !== 1) {
    page.value = 1
  } else {
    fetchWebflows()
  }
})

const startCreate = () => {
  editingFlow.value = null
  drawerOpen.value = true
}

const startEdit = (flow: WebFlow) => {
  editingFlow.value = flow
  drawerOpen.value = true
}

const promptDelete = (flow: WebFlow) => {
  deleteFlow.value = flow
  deleteOpen.value = true
}

const openLinkModal = async (flow: WebFlow) => {
  linkFlow.value = flow
  linkOpen.value = true
  try {
    const linked = await webFlowService.getLinkedEnvFiles(flow.id)
    linkedEnvIds.value = linked.envFiles.map((file) => file.id)
  } catch (err: any) {
    error.value = err?.response?.data?.error || 'Failed to load linked environment files'
    linkedEnvIds.value = []
  }
}

const closeLinkModal = () => {
  linkOpen.value = false
}

const refreshLinks = () => {
  fetchWebflows()
}

const closeDrawer = () => {
  drawerOpen.value = false
}

const closeDelete = () => {
  deleteOpen.value = false
}

const saveWebflow = async (payload: { id: number | null } & UpsertWebFlowPayload) => {
  try {
    if (payload.id) {
      await webFlowService.update(payload.id, payload)
    } else {
      await webFlowService.create(payload)
    }
    drawerOpen.value = false
    await fetchWebflows()
  } catch (err: any) {
    error.value = err?.response?.data?.error || 'Failed to save web flow'
  }
}

const confirmDelete = async () => {
  if (!deleteFlow.value) return
  try {
    await webFlowService.remove(deleteFlow.value.id)
    deleteOpen.value = false
    await fetchWebflows()
  } catch (err: any) {
    error.value = err?.response?.data?.error || 'Failed to delete web flow'
  }
}

const importWebflow = async () => {
  fetchWebflows()
}

const setPage = (value: number) => {
  page.value = value
}
</script>
