<template>
    <AppLayout>
        <div class="envfile-container">
            <EnvfileHeader @add="handleAdd" @search="handleSearch" @searchClear="handleSearchClear" />
            <div class="envfile-list">
                <EnvfileCard v-for="envFile in filteredEnvFileList" :key="envFile.id" :envFile="envFile"
                    @edit="handleEdit(envFile)" @delete="handleDelete(envFile)" @duplicate="handleDuplicate(envFile)" />
            </div>
        </div>
    </AppLayout>
    <UiDrawer v-model:visible="openAddEnvFileDrawer" title="Add Env File" position="right" size="lg" closable
        closeLabel="Close" persistent overlay @close="openAddEnvFileDrawer = false">
        <EnvfileForm :visible="openAddEnvFileDrawer" @submit="handleSubmit" @close="openAddEnvFileDrawer = false" />
    </UiDrawer>
    <UiDrawer v-model:visible="openEditEnvFileDrawer" title="Edit Env File" position="right" size="lg" closable
        closeLabel="Close" persistent overlay @close="openEditEnvFileDrawer = false">
        <EnvfileForm :visible="openEditEnvFileDrawer" @submit="handleSubmit" @close="openEditEnvFileDrawer = false"
            :editData="editEnvFile" />
    </UiDrawer>
    <UiModal v-model:visible="openDuplicateEnvFileModal" title="Duplicate Env File" position="right" size="lg" closable
        closeLabel="Close" @close="openDuplicateEnvFileModal = false">
        <div class="duplicate-envfile-modal">
            <UiInput v-model="duplicateEnvFile.name" label="Name" placeholder="Enter name" />
            <UiButton variant="primary" @click="handleDuplicateEnvFile">Duplicate</UiButton>
        </div>
    </UiModal>
</template>

<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import EnvfileHeader from '@/components/features/envfile/envfileHeader.vue'
import { onMounted, ref } from 'vue'
import { UiDrawer, UiInput, UiButton, UiModal } from '@/components'
import EnvfileForm, { type EnvFileFormData } from '@/components/features/envfile/envfileForm.vue'
import { envFileService, type EnvFile } from '@/services'
import type { Pagination } from '@/types/index'
import EnvfileCard from '@/components/features/envfile/envfileCard.vue'
import { alert, toast } from '@/utils'
const openAddEnvFileDrawer = ref(false)
const openEditEnvFileDrawer = ref(false)
const editEnvFile = ref<EnvFileFormData | null>(null)
const envFileList = ref<EnvFile[]>([])
const envFilePagination = ref<Pagination>({
    page: 1,
    limit: 1000,
    total: 0,
    totalPages: 0
})
const getEnvFiles = async () => {
    const response = await envFileService.getAll(envFilePagination.value.page, envFilePagination.value.limit)
    envFileList.value = response.envFiles
    envFilePagination.value = response.pagination
    filteredEnvFileList.value = envFileList.value
}
const filteredEnvFileList = ref<EnvFile[]>([])
const openDuplicateEnvFileModal = ref(false)
const duplicateEnvFile = ref<EnvFileFormData>({
    id: '',
    name: '',
    description: '',
    configs: []
})
const searchQuery = ref('')
onMounted(() => {
    getEnvFiles()
})
const handleAdd = () => {
    openAddEnvFileDrawer.value = true
}
const handleSearch = (query: string) => {
    filteredEnvFileList.value = envFileList.value.filter(envFile => envFile.name.toLowerCase().includes(query.toLowerCase()))
}
const handleSearchClear = () => {
    filteredEnvFileList.value = envFileList.value
}
const handleSubmit = () => {
    openAddEnvFileDrawer.value = false
    openEditEnvFileDrawer.value = false
    openDuplicateEnvFileModal.value = false
    getEnvFiles()
}
const handleEdit = (envFile: EnvFile) => {
    editEnvFile.value = {
        id: envFile.id,
        name: envFile.name,
        description: envFile.description,
        configs: envFile.configs.map((config, index) => ({
            id: config.id,
            key: config.key,
            value: config.value,
            description: config.description
        }))
    } as unknown as EnvFileFormData
    openEditEnvFileDrawer.value = true
}
const handleDelete = async (envFile: EnvFile) => {
    alert.confirm('Are you sure you want to delete this environment file?', {
        onConfirm: async () => {
            try {
                const response = await envFileService.delete(envFile.id)
                toast.success(response.message)
                getEnvFiles()
            } catch (error) {
                toast.error('Failed to delete environment file')
            }
        }
    })
}
const handleDuplicate = (envFile: EnvFile) => {
    // open modal for asking the name of the new environment file
    openDuplicateEnvFileModal.value = true
    duplicateEnvFile.value = {
        id: String(envFile.id),
        name: envFile.name,
        description: envFile.description,
        configs: envFile.configs.map((config, index) => ({
            id: config.id || Date.now(),
            key: config.key,
            value: config.value,
            description: config.description
        }))
    }
}
const handleDuplicateEnvFile = async () => {
    openDuplicateEnvFileModal.value = false
    try {
        const response = await envFileService.create(duplicateEnvFile.value)
        toast.success(response.message)
        getEnvFiles()
    } catch (error) {
        toast.error('Failed to duplicate environment file')
    }
}
</script>
<style scoped>
.envfile-list {
    padding-top: var(--spacing-lg);
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    align-content: start;
    gap: var(--spacing-md);
}

.duplicate-envfile-modal {
    display: flex;
    gap: var(--spacing-md);
    align-items: end;
    justify-content: center;
}
</style>