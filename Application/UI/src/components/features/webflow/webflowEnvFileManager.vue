<template>
  <div class="webflow-envfile-manager">
    <!-- Header with Add Button -->
    <div class="manager-header">
      <div class="header-content">
        <h3 class="manager-title">
          <div class="title-icon">
            <i class="fas fa-link"></i>
          </div>
          <div class="header-badge" v-if="linkedEnvFiles.length > 0">
            {{ linkedEnvFiles.length }} linked
          </div>
        </h3>
      </div>
      <UiButton
        variant="primary"
        size="sm"
        @click="openAddDialog"
        :loading="loading"
        class="add-btn"
      >
        <i class="fas fa-plus"></i>
        Link Env File
      </UiButton>
    </div>

    <!-- Loading State -->
    <div v-if="loading && linkedEnvFiles.length === 0" class="loading-state">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
      </div>
      <div class="loading-content">
        <h4>Loading Environment Files</h4>
        <p>Please wait while we fetch your linked files...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="linkedEnvFiles.length === 0" class="empty-state">
      <div class="empty-illustration">
        <div class="empty-icon">
          <i class="fas fa-file-code"></i>
        </div>
        <div class="empty-glow"></div>
      </div>
      <div class="empty-content">
        <h4>No Environment Files Linked</h4>
        <p>
          Link environment files to this webflow to manage your API
          configurations seamlessly across different environments.
        </p>
        <UiButton variant="primary" @click="openAddDialog" class="empty-cta">
          <i class="fas fa-plus"></i>
          Link Your First Env File
        </UiButton>
      </div>
    </div>

    <!-- Linked Environment Files List -->
    <div v-else class="envfile-list">
      <div
        v-for="envFile in linkedEnvFiles"
        :key="envFile.id"
        class="envfile-item glass-button"
        :class="{ expanded: expandedFiles.includes(envFile.id) }"
      >
        <!-- Environment File Header -->
        <div class="envfile-header" @click="toggleExpand(envFile.id)">
          <div class="envfile-info">
            <div class="envfile-name">
              <div class="file-icon">
                <i class="fas fa-file-code"></i>
              </div>
              <div class="name-content">
                <span class="file-name">{{ envFile.name }}</span>
                <span class="file-type-badge">ENV</span>
              </div>
            </div>
            <div class="envfile-meta">
              <div class="meta-item">
                <i class="fas fa-cog"></i>
                <span>{{ getVariableCount(envFile) }} configs</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-clock"></i>
                <span>{{ formatDate(envFile.updatedAt) }}</span>
              </div>
            </div>
          </div>
          <div class="envfile-actions">
            <button
              class="action-btn expand-btn glass-button"
              :class="{ expanded: expandedFiles.includes(envFile.id) }"
              title="Toggle details"
            >
              <i class="fas fa-chevron-down"></i>
            </button>
            <button
              class="action-btn unlink-btn glass-button"
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
            <div class="variables-header">
              <h5 class="variables-title">
                <i class="fas fa-list-ul"></i>
                Environment Configurations
              </h5>
              <div class="config-count">
                {{ getVariableCount(envFile) }} items
              </div>
            </div>
            <div
              v-if="envFile.configs && envFile.configs.length > 0"
              class="variables-list"
            >
              <div
                v-for="config in envFile.configs"
                :key="config.id"
                class="variable-item glass-button"
              >
                <div class="variable-key">
                  <i class="fas fa-key"></i>
                  <span>{{ config.key }}</span>
                </div>
                <div class="variable-value">
                  <span class="value-content">{{ config.value }}</span>
                </div>
                <div class="variable-description">
                  <span class="description-text">{{
                    config.description || "No description"
                  }}</span>
                </div>
              </div>
            </div>
            <div v-else class="no-variables glass-button">
              <div class="no-vars-icon">
                <i class="fas fa-info-circle"></i>
              </div>
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
      size="lg"
      @close="closeAddDialog"
    >
      <div class="add-envfile-content">
        <div class="search-section glass-panel">
          <div class="search-header">
            <h4 class="search-title">
              <i class="fas fa-search"></i>
              Find Environment Files
            </h4>
            <p class="search-subtitle">
              Search and link available environment files to this webflow
            </p>
          </div>
          <UiInput
            v-model="searchQuery"
            placeholder="Search by name or description..."
            @input="handleSearch"
            class="search-input"
          >
            <template #prefix>
              <i class="fas fa-search"></i>
            </template>
          </UiInput>
        </div>

        <div class="available-files">
          <div v-if="searchLoading" class="search-loading">
            <div class="loading-spinner">
              <i class="fas fa-spinner fa-spin"></i>
            </div>
            <div class="loading-content">
              <h5>Searching Files</h5>
              <p>Looking for environment files...</p>
            </div>
          </div>

          <div v-else-if="availableEnvFiles.length === 0" class="no-results">
            <div class="no-results-icon">
              <i class="fas fa-search"></i>
            </div>
            <div class="no-results-content">
              <h5>
                {{ searchQuery ? "No matches found" : "No available files" }}
              </h5>
              <p>
                {{
                  searchQuery
                    ? "Try adjusting your search terms"
                    : "All environment files are already linked or none exist"
                }}
              </p>
            </div>
          </div>

          <div v-else class="files-list">
            <div
              v-for="envFile in availableEnvFiles"
              :key="envFile.id"
              class="available-file-item glass-button"
              @click="selectEnvFile(envFile)"
            >
              <div class="file-info">
                <div class="file-header">
                  <div class="file-icon">
                    <i class="fas fa-file-code"></i>
                  </div>
                  <div class="file-name-section">
                    <span class="file-name">{{ envFile.name }}</span>
                    <span class="file-type-badge">ENV</span>
                  </div>
                </div>
                <div class="file-description">
                  {{ envFile.description || "No description provided" }}
                </div>
                <div class="file-meta">
                  <div class="meta-item">
                    <i class="fas fa-cog"></i>
                    <span>{{ getVariableCount(envFile) }} configs</span>
                  </div>
                </div>
              </div>
              <div class="file-actions">
                <UiButton variant="primary" size="sm" class="link-btn">
                  <i class="fas fa-link"></i>
                  Link File
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
import { UiButton, UiModal, UiInput } from "@/components/base";
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
      await webFlowService.unlinkFromEnvFile(webFlowIdNumber.value, envFile.id);
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
/* ===== Webflow Environment File Manager - Neo-Systemic Design ===== */

.webflow-envfile-manager {
  transition: all var(--transition-spring);
  overflow: hidden;
}

/* ===== Header Section ===== */
.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border-bottom: 1px solid var(--color-border-subtle);
  margin-bottom: var(--spacing-lg);
}

.header-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.manager-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  letter-spacing: var(--letter-spacing-tight);
}

.title-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--color-primary-light);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  color: var(--color-primary);
  font-size: var(--font-size-lg);
}

.header-badge {
  background: var(--gradient-data-green);
  color: white;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
  box-shadow: var(--shadow-sm);
}

.add-btn {
  gap: var(--spacing-sm);
  font-weight: var(--font-weight-medium);
}

/* ===== Loading State ===== */
.loading-state {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  padding: var(--spacing-4xl);
  justify-content: center;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--color-primary-light);
  border-radius: var(--radius-full);
  color: var(--color-primary);
  font-size: var(--font-size-xl);
}

.loading-content h4 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.loading-content p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
}

/* ===== Empty State ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-4xl);
  text-align: center;
  gap: var(--spacing-xl);
}

.empty-illustration {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-2xl);
  color: var(--color-text-tertiary);
  font-size: var(--font-size-3xl);
  position: relative;
  z-index: 2;
}

.empty-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: radial-gradient(
    circle,
    var(--color-primary-light) 0%,
    transparent 70%
  );
  border-radius: var(--radius-full);
  animation: pulse-glow 3s ease-in-out infinite;
  z-index: 1;
}

.empty-content h4 {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.empty-content p {
  max-width: 400px;
  margin: 0;
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
}

.empty-cta {
  gap: var(--spacing-sm);
  font-weight: var(--font-weight-medium);
}

/* ===== Environment Files List ===== */
.envfile-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.envfile-item {
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all var(--transition-spring);
}

.envfile-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-border-hover);
}

.envfile-item.expanded {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-xl);
}

/* ===== Environment File Header ===== */
.envfile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.envfile-header:hover {
  background: var(--color-background-hover);
}

.envfile-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.envfile-name {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.file-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--color-success-light);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  color: var(--color-success);
  font-size: var(--font-size-md);
}

.name-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.file-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  letter-spacing: var(--letter-spacing-tight);
}

.file-type-badge {
  background: var(--gradient-data-green);
  color: white;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
}

.envfile-meta {
  display: flex;
  gap: var(--spacing-lg);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.meta-item i {
  color: var(--color-text-tertiary);
  width: 14px;
}

/* ===== Environment File Actions ===== */
.envfile-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-spring);
  font-size: var(--font-size-sm);
}

.expand-btn {
  color: var(--color-text-secondary);
}

.expand-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  transform: scale(1.05);
}

.expand-btn.expanded {
  transform: rotate(180deg);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.unlink-btn {
  color: var(--color-danger);
}

.unlink-btn:hover {
  color: white;
  background: var(--color-danger);
  border-color: var(--color-danger);
  transform: scale(1.05);
}

/* ===== Environment File Content (Expanded) ===== */
.envfile-content {
  padding: 0 var(--spacing-xl) var(--spacing-xl);
  background: var(--color-background-subtle);
  border-top: 1px solid var(--color-border-subtle);
}

.variables-section {
  padding-top: var(--spacing-lg);
}

.variables-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.variables-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.variables-title i {
  color: var(--color-primary);
}

.config-count {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border-subtle);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

/* ===== Variables List ===== */
.variables-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.variable-item {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
}

.variable-item:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.variable-key {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.variable-key i {
  color: var(--color-warning);
  font-size: var(--font-size-xs);
}

.variable-value {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.value-content {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  word-break: break-all;
  padding: var(--spacing-sm);
  background: var(--color-background-code);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-sm);
}

.variable-description {
  grid-column: 1 / -1;
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--color-border-subtle);
}

.description-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  font-style: italic;
}

/* ===== No Variables State ===== */
.no-variables {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  text-align: center;
  color: var(--color-text-secondary);
}

.no-vars-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--color-info-light);
  border-radius: var(--radius-lg);
  color: var(--color-info);
  font-size: var(--font-size-md);
}

/* ===== Modal Content ===== */
.add-envfile-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.search-section {
  padding: var(--spacing-lg);
}

.search-header {
  margin-bottom: var(--spacing-lg);
}

.search-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.search-title i {
  color: var(--color-primary);
}

.search-subtitle {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

/* ===== Available Files ===== */
.available-files {
  max-height: 500px;
  overflow-y: auto;
}

.search-loading,
.no-results {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-4xl);
  justify-content: center;
}

.search-loading .loading-spinner,
.no-results .no-results-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--color-primary-light);
  border-radius: var(--radius-full);
  color: var(--color-primary);
  font-size: var(--font-size-xl);
}

.search-loading .loading-content h5,
.no-results .no-results-content h5 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.search-loading .loading-content p,
.no-results .no-results-content p {
  margin: 0;
  color: var(--color-text-secondary);
}

/* ===== Files List ===== */
.files-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
}

.available-file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-spring);
}

.available-file-item:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.file-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.file-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.file-name-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.file-description {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
}

.file-meta {
  display: flex;
  gap: var(--spacing-md);
}

.file-actions {
  flex-shrink: 0;
}

.link-btn {
  gap: var(--spacing-sm);
  font-weight: var(--font-weight-medium);
}

/* ===== Responsive Design ===== */
@media (max-width: 768px) {
  .manager-header {
    flex-direction: column;
    gap: var(--spacing-lg);
    align-items: stretch;
  }

  .header-content {
    justify-content: center;
  }

  .envfile-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-lg);
  }

  .envfile-actions {
    justify-content: center;
  }

  .variable-item {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .variables-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }

  .available-file-item {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-lg);
  }

  .file-actions {
    align-self: stretch;
  }

  .link-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .webflow-envfile-manager {
    margin: var(--spacing-sm);
    border-radius: var(--radius-lg);
  }

  .manager-header {
    padding: var(--spacing-lg);
  }

  .manager-title {
    font-size: var(--font-size-lg);
  }

  .envfile-list {
    padding: var(--spacing-lg);
  }

  .envfile-header {
    padding: var(--spacing-md);
  }

  .variable-item {
    padding: var(--spacing-md);
  }
}

/* ===== Animation Effects ===== */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.envfile-content {
  animation: slideIn 0.3s ease-out;
}

.variable-item {
  animation: slideIn 0.2s ease-out;
}

.available-file-item {
  animation: slideIn 0.2s ease-out;
}
</style>
