<template>
  <div class="webflow-envfile-manager">
    <!-- Header with Add Button -->
    <div class="manager-header">
      <h3 class="manager-title">
        <i class="fas fa-link"></i>
        Linked Environment Files
      </h3>
      <UiButton
        variant="primary"
        size="sm"
        @click="openAddDialog"
        :disabled="loading"
      >
        <i class="fas fa-plus"></i>
        Link Env File
      </UiButton>
    </div>

    <!-- Loading State -->
    <div v-if="loading && linkedEnvFiles.length === 0" class="loading-state">
      <i class="fas fa-spinner fa-spin"></i>
      <span>Loading environment files...</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="linkedEnvFiles.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-file-code"></i>
      </div>
      <h4>No Environment Files Linked</h4>
      <p>
        Link environment files to this webflow to manage your API
        configurations.
      </p>
      <UiButton variant="primary" @click="openAddDialog">
        <i class="fas fa-plus"></i>
        Link Your First Env File
      </UiButton>
    </div>

    <!-- Linked Environment Files List -->
    <div v-else class="envfile-list">
      <div
        v-for="envFile in linkedEnvFiles"
        :key="envFile.id"
        class="envfile-item"
        :class="{ expanded: expandedFiles.includes(envFile.id) }"
      >
        <!-- Environment File Header -->
        <div class="envfile-header" @click="toggleExpand(envFile.id)">
          <div class="envfile-info">
            <div class="envfile-name">
              <i class="fas fa-file-code envfile-icon"></i>
              <span>{{ envFile.name }}</span>
              <span class="envfile-type">ENV</span>
            </div>
            <div class="envfile-meta">
              <span class="variable-count"
                >{{ getVariableCount(envFile) }} configs</span
              >
              <span class="updated-date"
                >Updated {{ formatDate(envFile.updatedAt) }}</span
              >
            </div>
          </div>
          <div class="envfile-actions">
            <button
              class="action-btn expand-btn"
              :class="{ expanded: expandedFiles.includes(envFile.id) }"
            >
              <i class="fas fa-chevron-down"></i>
            </button>
            <button
              class="action-btn unlink-btn"
              @click.stop="handleUnlink(envFile)"
              title="Unlink environment file"
            >
              <i class="fas fa-unlink"></i>
            </button>
          </div>
        </div>

        <!-- Environment File Variables (Expanded Content) -->
        <div v-if="expandedFiles.includes(envFile.id)" class="envfile-content">
          <div class="variables-section">
            <h5 class="variables-title">Environment Configurations</h5>
            <div
              v-if="envFile.configs && envFile.configs.length > 0"
              class="variables-list"
            >
              <div
                v-for="config in envFile.configs"
                :key="config.id"
                class="variable-item"
              >
                <div class="variable-key">{{ config.key }}</div>
                <div class="variable-value">
                  <span class="normal-value">{{ config.value }}</span>
                </div>
                <div class="variable-description">
                  <span class="description-text">{{
                    config.description || "No description"
                  }}</span>
                </div>
              </div>
            </div>
            <div v-else class="no-variables">
              <i class="fas fa-info-circle"></i>
              <span>No configurations defined in this environment file</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Environment File Modal -->
    <UiModal
      v-model:visible="showAddModal"
      title="Link Environment File"
      size="md"
      @close="closeAddDialog"
    >
      <div class="add-envfile-content">
        <div class="search-section">
          <UiInput
            v-model="searchQuery"
            placeholder="Search environment files..."
            @input="handleSearch"
          >
            <template #prefix>
              <i class="fas fa-search"></i>
            </template>
          </UiInput>
        </div>

        <div class="available-files">
          <div v-if="searchLoading" class="search-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Searching...</span>
          </div>

          <div v-else-if="availableEnvFiles.length === 0" class="no-results">
            <i class="fas fa-search"></i>
            <span>{{
              searchQuery
                ? "No environment files found"
                : "No available environment files"
            }}</span>
          </div>

          <div v-else class="files-list">
            <div
              v-for="envFile in availableEnvFiles"
              :key="envFile.id"
              class="available-file-item"
              @click="selectEnvFile(envFile)"
            >
              <div class="file-info">
                <div class="file-name">
                  <i class="fas fa-file-code"></i>
                  <span>{{ envFile.name }}</span>
                  <span class="file-type">ENV</span>
                </div>
                <div class="file-description">
                  {{ envFile.description || "No description" }}
                </div>
              </div>
              <div class="file-actions">
                <UiButton variant="primary" size="xs">
                  <i class="fas fa-link"></i>
                  Link
                </UiButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { UiButton, UiModal } from "@/components/base";
import UiInput from "@/components/base/UiInput.vue";
import { webFlowService } from "@/services/webflow";
import { envFileService, type EnvFile } from "@/services/envfile";
import { linkService } from "@/services/link";
import { toast, alert } from "@/utils";

interface Props {
  webFlowId: number;
}

const props = defineProps<Props>();

// State
const loading = ref(false);
const searchLoading = ref(false);
const linkedEnvFiles = ref<EnvFile[]>([]);
const availableEnvFiles = ref<EnvFile[]>([]);
const expandedFiles = ref<number[]>([]);
const showAddModal = ref(false);
const searchQuery = ref("");
const searchTimeout = ref<number>();

// Computed
const webFlowIdNumber = computed(() => Number(props.webFlowId));

// Methods
const loadLinkedEnvFiles = async () => {
  try {
    loading.value = true;
    // Use the new API endpoint to get linked environment files
    const response = await webFlowService.getLinkedEnvFiles(
      webFlowIdNumber.value,
      1,
      100
    );
    linkedEnvFiles.value = response.envFiles;
  } catch (error) {
    console.error("Failed to load linked environment files:", error);
    toast.error("Failed to load linked environment files");
    linkedEnvFiles.value = [];
  } finally {
    loading.value = false;
  }
};

const loadAvailableEnvFiles = async (query = "") => {
  try {
    searchLoading.value = true;
    const response = await envFileService.getAll(1, 50); // Get more files for search

    // Filter out already linked files
    const linkedIds = linkedEnvFiles.value.map((f) => f.id);
    let available = response.envFiles.filter((f) => !linkedIds.includes(f.id));

    // Apply search filter
    if (query.trim()) {
      available = available.filter(
        (f) =>
          f.name.toLowerCase().includes(query.toLowerCase()) ||
          (f.description &&
            f.description.toLowerCase().includes(query.toLowerCase()))
      );
    }

    availableEnvFiles.value = available;
  } catch (error) {
    console.error("Failed to load available environment files:", error);
    toast.error("Failed to load available environment files");
  } finally {
    searchLoading.value = false;
  }
};

const getVariableCount = (envFile: EnvFile): number => {
  return envFile.configs?.length || 0;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

const toggleExpand = (fileId: number) => {
  const index = expandedFiles.value.indexOf(fileId);
  if (index > -1) {
    expandedFiles.value.splice(index, 1);
  } else {
    expandedFiles.value.push(fileId);
  }
};

const handleUnlink = async (envFile: EnvFile) => {
  const confirmed = await alert.confirm(
    `Are you sure you want to unlink "${envFile.name}" from this webflow?`,
    {
      title: "Confirm Unlink",
      confirmText: "Unlink",
      cancelText: "Cancel",
    }
  );

  if (confirmed) {
    try {
      await webFlowService.unlinkFromEnvFile(
        webFlowIdNumber.value,
        envFile.id
      );
      toast.success(`${envFile.name} has been unlinked successfully`);
      await loadLinkedEnvFiles();
    } catch (error) {
      console.error("Failed to unlink environment file:", error);
      toast.error("Failed to unlink environment file");
    }
  }
};

const openAddDialog = () => {
  showAddModal.value = true;
  searchQuery.value = "";
  loadAvailableEnvFiles();
};

const closeAddDialog = () => {
  showAddModal.value = false;
  searchQuery.value = "";
  availableEnvFiles.value = [];
};

const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  searchTimeout.value = setTimeout(() => {
    loadAvailableEnvFiles(searchQuery.value);
  }, 300);
};

const selectEnvFile = async (envFile: EnvFile) => {
  try {
    await webFlowService.linkToEnvFile(webFlowIdNumber.value, envFile.id);
    toast.success(`${envFile.name} has been linked successfully`);
    closeAddDialog();
    await loadLinkedEnvFiles();
  } catch (error) {
    console.error("Failed to link environment file:", error);
    toast.error("Failed to link environment file");
  }
};

// Initialize
onMounted(() => {
  loadLinkedEnvFiles();
});
</script>

<style scoped>
.webflow-envfile-manager {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background-secondary);
}

.manager-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.manager-title i {
  color: var(--color-primary);
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl);
  text-align: center;
}

.loading-state {
  gap: var(--spacing-md);
  color: var(--color-text-secondary);
}

.loading-state i {
  font-size: var(--font-size-xl);
  color: var(--color-primary);
}

.empty-state {
  gap: var(--spacing-lg);
}

.empty-icon {
  font-size: var(--font-size-4xl);
  color: var(--color-gray-400);
}

.empty-state h4 {
  margin: 0;
  color: var(--color-text-primary);
}

.empty-state p {
  max-width: 300px;
  color: var(--color-text-secondary);
}

.envfile-list {
  border-top: 1px solid var(--color-border);
}

.envfile-item:not(:last-child) {
  border-bottom: 1px solid var(--color-border);
}

.envfile-item {
  transition: all var(--transition-normal);
}

.envfile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.envfile-header:hover {
  background: var(--color-background-secondary);
}

.envfile-info {
  flex: 1;
}

.envfile-name {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}

.envfile-icon {
  color: var(--color-primary);
}

.envfile-name span:first-of-type {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.envfile-type {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.envfile-meta {
  display: flex;
  gap: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.envfile-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.action-btn {
  background: none;
  border: none;
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.expand-btn {
  color: var(--color-text-secondary);
}

.expand-btn.expanded {
  transform: rotate(180deg);
}

.unlink-btn {
  color: var(--color-error);
}

.action-btn:hover {
  background: var(--color-gray-100);
}

.envfile-content {
  padding: 0 var(--spacing-lg) var(--spacing-lg);
  background: var(--color-background-tertiary);
  border-top: 1px solid var(--color-border);
}

.variables-section {
  margin-top: var(--spacing-md);
}

.variables-title {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.variables-list {
  display: grid;
  gap: var(--spacing-sm);
}

.variable-item {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: var(--spacing-md);
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.variable-key {
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.variable-value {
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  word-break: break-all;
}

.secret-value {
  color: var(--color-text-tertiary);
  font-weight: var(--font-weight-bold);
}

.variable-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  word-break: break-all;
}

.description-text {
  font-style: italic;
}

.no-variables {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  text-align: center;
  color: var(--color-text-secondary);
  font-style: italic;
}

.add-envfile-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.search-section {
  position: sticky;
  top: 0;
  background: var(--color-background);
  z-index: 1;
}

.available-files {
  max-height: 400px;
  overflow-y: auto;
}

.search-loading,
.no-results {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-3xl);
  color: var(--color-text-secondary);
}

.files-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.available-file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.available-file-item:hover {
  background: var(--color-background-secondary);
  border-color: var(--color-primary);
}

.file-info {
  flex: 1;
}

.file-name {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}

.file-name i {
  color: var(--color-primary);
}

.file-name span:first-of-type {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.file-type {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.file-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* Dark theme support */
[data-theme="dark"] .manager-header {
  background: var(--color-gray-800);
  border-color: var(--color-gray-700);
}

[data-theme="dark"] .envfile-header:hover {
  background: var(--color-gray-800);
}

[data-theme="dark"] .envfile-content {
  background: var(--color-gray-900);
}

[data-theme="dark"] .variable-item {
  background: var(--color-gray-800);
  border-color: var(--color-gray-700);
}

[data-theme="dark"] .available-file-item:hover {
  background: var(--color-gray-800);
}

/* Responsive design */
@media (max-width: 768px) {
  .manager-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: stretch;
  }

  .variable-item {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }

  .available-file-item {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
  }
}
</style>
