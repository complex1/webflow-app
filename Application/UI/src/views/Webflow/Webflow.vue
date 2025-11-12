<template>
  <AppLayout>
    <div class="webflow-page">
      <!-- Header -->
      <WebflowHeader
        @search="handleSearch"
        @search-clear="handleSearchClear"
        @add="handleAdd"
        @import="handleImport"
      />

      <!-- Content -->
      <div class="webflow-content">
        <div v-if="webFlowList.length === 0" class="content-placeholder">
          <div class="placeholder-icon">
            <i class="fas fa-project-diagram"></i>
          </div>
          <h2>Web Flows</h2>
          <p>Create and manage your API collections and workflows</p>
          <UiButton variant="primary" @click="handleAdd">
            <i class="fas fa-plus"></i>
            Create Your First Web Flow
          </UiButton>
        </div>

        <div v-else class="webflow-list">
          <div class="webflow-list-folder">
            <h3>Folders:</h3>
            <div class="webflow-list-group">
              <div v-for="webFlow in filteredWebFlowList" :key="webFlow.id">
                <WebflowCard
                  v-if="webFlow.isFolder"
                  :key="webFlow.id"
                  :webFlow="webFlow"
                  @edit="handleEdit(webFlow)"
                  @delete="handleDelete(webFlow)"
                />
              </div>
            </div>
          </div>
          <div class="webflow-list-item">
            <h3>Items:</h3>
            <div class="webflow-list-group">
              <div v-for="webFlow in filteredWebFlowList" :key="webFlow.id">
                <WebflowCard
                  v-if="!webFlow.isFolder"
                  :key="webFlow.id"
                  :webFlow="webFlow"
                  @edit="handleEdit(webFlow)"
                  @delete="handleDelete(webFlow)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
  <UiDrawer
    v-model:visible="openAddWebFlowDrawer"
    title="Add Web Flow"
    position="right"
    size="lg"
    closable
    closeLabel="Close"
    @close="openAddWebFlowDrawer = false"
  >
    <WebflowForm
      :visible="openAddWebFlowDrawer"
      @submit="handleSubmit"
      @close="openAddWebFlowDrawer = false"
    />
  </UiDrawer>

  <UiDrawer
    v-model:visible="openEditWebFlowDrawer"
    title="Edit Web Flow"
    position="right"
    size="lg"
    closable
    closeLabel="Close"
    @close="openEditWebFlowDrawer = false"
  >
    <WebflowForm
      :visible="openEditWebFlowDrawer"
      @submit="handleSubmit"
      @close="openEditWebFlowDrawer = false"
      :editData="editWebFlow"
    />
  </UiDrawer>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import AppLayout from "@/components/layout/AppLayout.vue";
import WebflowHeader from "@/components/features/webflow/webflowHeader.vue";
import WebflowForm from "@/components/features/webflow/webflowForm.vue";
import WebflowCard from "@/components/features/webflow/webflowCard.vue";
import { UiButton, UiDrawer } from "@/components/base";
import { toast, alert } from "@/utils";
import { webFlowService, type WebFlow } from "@/services/webflow";
import type { Pagination } from "@/types/index";

// Router
const route = useRoute();

// State management
const openAddWebFlowDrawer = ref(false);
const openEditWebFlowDrawer = ref(false);
const editWebFlow = ref<any>(null);
const webFlowList = ref<WebFlow[]>([]);
const filteredWebFlowList = ref<WebFlow[]>([]);
const webFlowPagination = ref<Pagination>({
  page: 1,
  limit: 1000,
  total: 0,
  totalPages: 0,
});
const searchQuery = ref("");
const parentId = ref<string | null>(null);

// Fetch web flows from API
const getWebFlows = async () => {
  try {
    const parentIdNumber = parentId.value ? Number(parentId.value) : null;
    const response = await webFlowService.getByParentId(
      parentIdNumber,
      webFlowPagination.value.page,
      webFlowPagination.value.limit
    );
    webFlowList.value = response.webFlows;
    webFlowPagination.value = response.pagination;
    filteredWebFlowList.value = webFlowList.value;
  } catch (error) {
    console.error("Failed to fetch web flows:", error);
    toast.error("Failed to load web flows");
  }
};

// Search functionality
const handleSearch = (query: string) => {
  searchQuery.value = query;
  filteredWebFlowList.value = webFlowList.value.filter((webFlow) =>
    webFlow.name.toLowerCase().includes(query.toLowerCase())
  );
};

const handleSearchClear = () => {
  searchQuery.value = "";
  filteredWebFlowList.value = webFlowList.value;
};

// CRUD operations
const handleAdd = () => {
  openAddWebFlowDrawer.value = true;
};

const handleImport = async (importData: any) => {
  try {
    console.log('Importing webflow data:', importData);
    
    // Validate the import data structure
    if (!importData.name || !importData.playgroundConfig) {
      toast.error('Invalid import file: missing required fields (name, playgroundConfig)');
      return;
    }

    if (!Array.isArray(importData.playgroundConfig.nodes) || !Array.isArray(importData.playgroundConfig.edges)) {
      toast.error('Invalid import file: playgroundConfig must contain nodes and edges arrays');
      return;
    }

    // Call the import API
    const result = await webFlowService.createFromImport(importData);
    
    toast.success(result.message || 'Web flow imported successfully');
    
    // Refresh the list to show the new imported webflow
    getWebFlows();
  } catch (error: any) {
    console.error('Import error:', error);
    toast.error(error.response?.data?.error || 'Failed to import web flow');
  }
};

const handleSubmit = () => {
  openAddWebFlowDrawer.value = false;
  openEditWebFlowDrawer.value = false;
  getWebFlows(); // Refresh the list
};

const handleEdit = (webFlow: WebFlow) => {
  editWebFlow.value = {
    id: webFlow.id,
    name: webFlow.name,
    description: webFlow.description,
    icon: webFlow.icon,
    tags: webFlow.tags,
    isFolder: webFlow.isFolder,
    hasOpenApiConfig: webFlow.hasOpenApiConfig,
    openApiConfigType: webFlow.openApiConfigType,
    openApiServerUrl: webFlow.openApiServerUrl,
    openApiFileId: webFlow.openApiFileId,
    hasPostmanCollection: webFlow.hasPostmanCollection,
    postmanFileId: webFlow.postmanFileId,
    basePath: webFlow.basePath,
  };
  openEditWebFlowDrawer.value = true;
};

const handleDelete = async (webFlow: WebFlow) => {
  alert.confirm("Are you sure you want to delete this web flow?", {
    onConfirm: async () => {
      try {
        const response = await webFlowService.delete(webFlow.id);
        toast.success(response.message);
        getWebFlows();
      } catch (error) {
        toast.error("Failed to delete web flow");
      }
    },
  });
};

// Initialize on mount
onMounted(() => {
  // Set initial parentId from route query
  parentId.value = route.query.wfid ? String(route.query.wfid) : null;
  getWebFlows();
});

// Watch for changes in wfid query parameter
watch(
  () => route.query.wfid,
  (newWfid) => {
    // Set parentId to wfid if it exists, otherwise null
    parentId.value = newWfid ? String(newWfid) : null;
    // Fetch web flows with new parentId
    getWebFlows();
  },
  { immediate: true }
);
</script>

<style scoped>
.webflow-content {
  height: calc(100vh - 260px);
}

.webflow-list {
  height: 100%;
}

.webflow-list-folder h3,
.webflow-list-item h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin: var(--spacing-sm) 0;
}

.webflow-list-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.content-placeholder {
  text-align: center;
  max-width: 500px;
  margin: var(--spacing-3xl) auto;
  padding: var(--spacing-3xl) var(--spacing-xl);
  background: var(--color-background);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
}

.placeholder-icon {
  font-size: var(--font-size-5xl);
  color: var(--color-gray-400);
  margin-bottom: var(--spacing-lg);
}

.content-placeholder h2 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-dark);
  margin: 0 0 var(--spacing-sm) 0;
}

.content-placeholder p {
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-xl) 0;
  line-height: 1.5;
}

/* Dark theme support */
[data-theme="dark"] .webflow-page {
  background: var(--color-gray-900);
}

[data-theme="dark"] .content-placeholder {
  background: var(--color-gray-800);
  border-color: var(--color-gray-700);
}

[data-theme="dark"] .content-placeholder h2 {
  color: var(--color-text-inverse);
}

[data-theme="dark"] .content-placeholder p {
  color: var(--color-gray-400);
}

[data-theme="dark"] .placeholder-icon {
  color: var(--color-gray-600);
}

@media (max-width: 768px) {
  .webflow-content {
    padding: var(--spacing-md);
  }

  .content-placeholder {
    padding: var(--spacing-xl) var(--spacing-md);
  }

  .placeholder-icon {
    font-size: var(--font-size-4xl);
  }
}
</style>