<template>
  <AppLayout>
    <template #logo>
      <Heading :level="3">Environments</Heading>
    </template>

    <Alert v-if="error" variant="error" dismissible @dismiss="error = ''">
      {{ error }}
    </Alert>

    <EnvironmentList
      :rows="environments"
      :page="page"
      :total-pages="totalPages"
      :loading="loading"
      @create="startCreate"
      @edit="startEdit"
      @delete="promptDelete"
      @view="viewDetails"
      @clone="cloneEnvironment"
      @update:page="setPage"
    />

    <EnvironmentDrawer :open="drawerOpen" :environment="editingEnv" @close="closeDrawer" @save="saveEnvironment" />

    <EnvironmentDetailModal :open="detailOpen" :environment="detailEnv" @close="closeDetail" />

    <EnvironmentDeleteConfirm
      :open="deleteOpen"
      :environment="deleteEnv"
      @close="closeDelete"
      @confirm="confirmDelete"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Heading } from '@/components/common/typography'
import {
  EnvironmentList,
  EnvironmentDrawer,
  EnvironmentDetailModal,
  EnvironmentDeleteConfirm
} from '@/components'
import { Alert } from '@/components/common/feedback'
import { environmentService, type EnvFile, type EnvConfig } from '@/services/environment'

const environments = ref<EnvFile[]>([])
const page = ref(1)
const totalPages = ref(1)
const loading = ref(false)
const error = ref('')

const drawerOpen = ref(false)
const detailOpen = ref(false)
const deleteOpen = ref(false)

const editingEnv = ref<EnvFile | null>(null)
const detailEnv = ref<EnvFile | null>(null)
const deleteEnv = ref<EnvFile | null>(null)

const fetchEnvs = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await environmentService.list(page.value)
    environments.value = data.envFiles
    totalPages.value = data.pagination.totalPages
  } catch (err: any) {
    error.value = err?.response?.data?.error || 'Failed to load environment files'
  } finally {
    loading.value = false
  }
}

onMounted(fetchEnvs)
watch(page, () => fetchEnvs())

const startCreate = () => {
  editingEnv.value = null
  drawerOpen.value = true
}

const startEdit = (env: EnvFile) => {
  editingEnv.value = env
  drawerOpen.value = true
}

const viewDetails = (env: EnvFile) => {
  detailEnv.value = env
  detailOpen.value = true
}

const promptDelete = (env: EnvFile) => {
  deleteEnv.value = env
  deleteOpen.value = true
}

const cloneEnvironment = async (env: EnvFile) => {
  try {
    await environmentService.create({
      name: `${env.name} copy`,
      description: env.description,
      configs: env.configs?.map((config) => ({
        key: config.key,
        value: config.value,
        description: config.description
      })) ?? []
    })
    await fetchEnvs()
  } catch (err: any) {
    error.value = err?.response?.data?.error || 'Failed to clone environment'
  }
}

const closeDrawer = () => {
  drawerOpen.value = false
}

const closeDetail = () => {
  detailOpen.value = false
}

const closeDelete = () => {
  deleteOpen.value = false
}

const saveEnvironment = async (env: { id: number | null; name: string; description?: string; configs: EnvConfig[] }) => {
  try {
    if (env.id) {
      await environmentService.update(env.id, {
        name: env.name,
        description: env.description,
        configs: env.configs
      })
    } else {
      await environmentService.create({
        name: env.name,
        description: env.description,
        configs: env.configs
      })
    }
    drawerOpen.value = false
    await fetchEnvs()
  } catch (err: any) {
    error.value = err?.response?.data?.error || 'Failed to save environment'
  }
}

const confirmDelete = async () => {
  if (!deleteEnv.value) return
  try {
    await environmentService.remove(deleteEnv.value.id)
    deleteOpen.value = false
    await fetchEnvs()
  } catch (err: any) {
    error.value = err?.response?.data?.error || 'Failed to delete environment'
  }
}

const setPage = (value: number) => {
  page.value = value
}
</script>
