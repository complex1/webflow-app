<template>
  <div class="dashboard-page">
    <navbar></navbar>
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div class="flex-v-center">
          <h1 class="pr-l" >My Webflows</h1>
          <!-- Hierarchy Breadcrumb -->
          <hierarchyBreadcrum />
        </div>
        <div class="dashboard-filters">
          <div class="search-box">
            <i class="pi pi-search"></i>
            <wfa-input
              v-model="searchQuery"
              placeholder="Search webflows..."
              @update:modelValue="filterWebflows"
            />
          </div>
          <div class="tag-filter">
            <wfa-input
              type="select"
              v-model="selectedTag"
              placeholder="All Tags"
              @update:modelValue="filterWebflows"
            >
              <option value="">All Tags</option>
              <option v-for="tag in uniqueTags" :key="tag" :value="tag">
                {{ tag }}
              </option>
            </wfa-input>
          </div>
          <button class="btn btn-primary" @click="openCreateDrawer">
            <i class="pi pi-plus mx-s"></i> New
          </button>
          <button class="btn btn-secondary fh" style="height: 38px;" @click="askToImportWebflow">
            <i class="pi pi-upload mx-s"></i> Import
          </button>
          <input type="file" style="display: none;" id="ImportWebflow" @change="importWebflow">
        </div>
      </div>

      <div v-if="loading" class="loading-state">
        <i class="pi pi-spin pi-spinner"></i>
        <p>Loading webflows...</p>
      </div>

      <div v-else-if="filteredWebflows.length === 0" class="empty-state">
        <i class="pi pi-exclamation-circle"></i>
        <h3>No webflows found</h3>
        <p v-if="searchQuery || selectedTag">
          Try adjusting your filters or create a new webflow.
        </p>
        <p v-else>Get started by creating your first webflow!</p>
        <button class="btn btn-primary" @click="openCreateDrawer">
          Create New Webflow
        </button>
      </div>

      <div v-else class="webflow-grid">
        <webflow-card
          v-for="webflow in filteredWebflows"
          :key="webflow.id"
          :webflow="webflow"
          @edit="editWebflow"
          @delete="confirmDelete"
        />
      </div>

      <!-- Create/Edit Webflow Drawer -->
      <drawer
        :is-open="drawerOpen"
        :title="isEditing ? 'Edit Webflow' : 'Create New Webflow'"
        @close="closeDrawer"
      >
        <form @submit.prevent="saveWebflow" class="webflow-form">
          
          <wfa-input
            id="name"
            label="Name"
            v-model="webflowForm.name"
            required
            placeholder="Enter webflow name"
            :error="nameError"
          />

          <!-- Type Selection -->
          <div class="form-group mb-m">
            <label class="form-label">Type</label>
            <div class="type-toggle">
              <label class="radio-group">
                <input 
                  type="radio" 
                  name="itemType" 
                  value="file" 
                  v-model="webflowForm.itemType"
                  @change="onItemTypeChange"
                />
                <span class="radio-label">
                  <i class="pi pi-file"></i>
                  File
                </span>
              </label>
              <label class="radio-group">
                <input 
                  type="radio" 
                  name="itemType" 
                  value="folder" 
                  v-model="webflowForm.itemType"
                  @change="onItemTypeChange"
                />
                <span class="radio-label">
                  <i class="pi pi-folder"></i>
                  Folder
                </span>
              </label>
            </div>
          </div>

          <wfa-input
            id="description"
            label="Description"
            type="textarea"
            rows="3"
            v-model="webflowForm.description"
            placeholder="Enter webflow description"
          />

          <wfa-input
            id="icon"
            label="Icon"
            type="select"
            v-model="webflowForm.icon"
          >
            <option value="pi pi-sitemap">Sitemap</option>
            <option value="pi pi-cog">Cog</option>
            <option value="pi pi-bolt">Bolt</option>
            <option value="pi pi-database">Database</option>
            <option value="pi pi-server">Server</option>
            <option value="pi pi-cloud">Cloud</option>
          </wfa-input>

          <div class="form-group">
            <label for="tags">Tags</label>
            <div class="tag-input">
              <wfa-input
                id="tag-input"
                v-model="tagInput"
                placeholder="Add a tag and press Enter"
                @keyup.enter="addTag"
              />
              <div class="tag-chips">
                <span
                  v-for="(tag, index) in webflowForm.tags"
                  :key="index"
                  class="tag"
                >
                  {{ tag }}
                  <button
                    type="button"
                    class="tag-remove"
                    @click="removeTag(index)"
                  >
                    &times;
                  </button>
                </span>
              </div>
            </div>
          </div>

          <div v-if="!webflowForm.isFolder">
            <div class="form-group mb-l">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  v-model="webflowForm.openApiDocConfig.enabled"
                  class="checkbox-input"
                />
                <span class="checkbox-text">Enable OpenAPI Documentation</span>
              </label>
            </div>

            <div v-if="webflowForm.openApiDocConfig.enabled" class="openapi-config">
              <div class="form-group mb-m">
                <label class="radio-group-label">Documentation Source:</label>
                <div class="radio-group">
                  <label class="radio-label">
                    <input
                      type="radio"
                      :value="false"
                      v-model="webflowForm.openApiDocConfig.fromFile"
                      class="radio-input"
                    />
                    <span class="radio-text">URL</span>
                  </label>
                  <label class="radio-label">
                    <input
                      type="radio"
                      :value="true"
                      v-model="webflowForm.openApiDocConfig.fromFile"
                      class="radio-input"
                    />
                    <span class="radio-text">File Upload</span>
                  </label>
                </div>
              </div>

              <div v-if="!webflowForm.openApiDocConfig.fromFile">
                <wfa-input
                  id="openapi-url"
                  label="OpenAPI Documentation URL"
                  v-model="webflowForm.openApiDocConfig.url"
                  placeholder="https://example.com/api-docs"
                  type="url"
                />
                <wfa-input
                  id="openapi-base-url"
                  label="Server Base URL"
                  v-model="webflowForm.openApiDocConfig.baseUrl"
                  placeholder="https://example.com/api"
                  type="url"
                />
              </div>
              
              <div v-else>
                <div class="form-group mb-m">
                  <label class="wfa-label">OpenAPI Documentation File</label>
                  <file-upload
                    v-model="webflowForm.openApiDocConfig.fileData"
                    @error="handleFileError"
                  />
                </div>
                <wfa-input
                  id="openapi-base-url-file"
                  label="Server Base URL"
                  v-model="webflowForm.openApiDocConfig.baseUrl"
                  placeholder="https://example.com/api"
                  type="url"
                />
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" @click="closeDrawer">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              {{ isEditing ? "Update" : "Create" }} Webflow
            </button>
          </div>
        </form>
      </drawer>

      <!-- Delete Confirmation Modal -->
      <div
        class="mask"
        :class="{ show: showDeleteConfirm }"
        @click="showDeleteConfirm = false"
      ></div>
      <div class="delete-confirm" :class="{ 'show-modal': showDeleteConfirm }">
        <h3>Confirm Delete</h3>
        <p>
          Are you sure you want to delete the webflow
          <strong>{{ webflowToDelete?.name }}</strong
          >?
        </p>
        <p class="text-danger">This action cannot be undone.</p>
        <div class="form-actions">
          <button class="btn btn-outline" @click="showDeleteConfirm = false">
            Cancel
          </button>
          <button class="btn btn-danger" @click="deleteWebflow">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { WebflowService } from '../services/webflow.service';
import drawer from '../components/common/drawer.vue';
import navbar from '../components/common/navbar.vue';
import wfaInput from '../components/common/wfa-input.vue';
import webflowCard from '../components/dashboard/webflow-card.vue';
import FileUpload from '../components/common/FileUpload.vue';
import hierarchyBreadcrum from '../components/common/hierarchyBreadcrum.vue';
import type { WebflowCardProps } from '../components/dashboard/types';
import type { WebflowForm } from './types';
import { success, error } from '../lib/toast';
import { importWorkflowService } from '../services/importExport.service';

export default defineComponent({
  name: 'DashboardPage',
  components: {
    drawer,
    navbar,
    wfaInput,
    webflowCard,
    FileUpload,
    hierarchyBreadcrum,
  },
  setup() {
    const router = useRouter();
    const webflowService = new WebflowService();
    
    // State
    const webflows = ref<WebflowCardProps[]>([]);
    const filteredWebflows = ref<WebflowCardProps[]>([]);
    const loading = ref(true);
    const searchQuery = ref('');
    const selectedTag = ref('');
    const drawerOpen = ref(false);
    const isEditing = ref(false);
    const webflowForm = ref<WebflowForm>({
      name: '',
      description: '',
      icon: 'pi pi-sitemap',
      tags: [],
      itemType: 'file', // Default to file
      isFolder: false,
      parentId: null,
      openApiDocConfig: {
        enabled: false,
        url: '',
        baseUrl: '', // Optional base URL for OpenAPI
        fromFile: false,
        fileData: null,
      },
    });
    const nameError = ref('');
    const tagInput = ref('');
    const showDeleteConfirm = ref(false);
    const webflowToDelete = ref<WebflowCardProps | null>(null);
    
    // Computed properties
    const uniqueTags = computed(() => {
      // Extract all unique tags from webflows
      // Using reduce instead of flatMap for better compatibility
      const allTags: string[] = webflows.value
        .filter((webflow) => webflow.tags && webflow.tags.length > 0)
        .reduce((acc: string[], webflow) => {
          return acc.concat(webflow.tags || []);
        }, []);
      return [...new Set(allTags)];
    });
    
    // Methods
    const askToImportWebflow = () => {
      const fileInput = document.getElementById('ImportWebflow') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    };

    const importWebflow = async (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const newWorkflow = await importWorkflowService(file);
          // Validate and cast the imported workflow to the correct type
          if (
            newWorkflow &&
            typeof newWorkflow === 'object' &&
            'id' in newWorkflow &&
            'name' in newWorkflow
          ) {
            fetchWebflows();
            success('Webflow imported successfully!');
          } else {
            error('Imported file is not a valid webflow.');
          }
        } catch {
          error('Error importing webflow. Please try again.');
        }
      }
    };

    const fetchWebflows = async () => {
      try {
        loading.value = true;
        const folderId = router.currentRoute.value.query.id as string | undefined;
        const result = await webflowService.getMyWebflows(folderId);
        webflows.value = Array.isArray(result) ? result : [];
        filteredWebflows.value = [...webflows.value];
      } catch (error: any) {
        console.error('Error fetching webflows:', error);
        webflows.value = [];
        filteredWebflows.value = [];

        // Check if unauthorized (likely token expired)
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          // Redirect to login
          router.push('/login');
        }
      } finally {
        loading.value = false;
      }
    };
    
    const filterWebflows = () => {
      // Filter webflows based on search query and selected tag
      filteredWebflows.value = webflows.value.filter((webflow) => {
        const matchesSearch =
          !searchQuery.value ||
          webflow.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          (webflow.description &&
            webflow.description
              .toLowerCase()
              .includes(searchQuery.value.toLowerCase()));

        const matchesTag =
          !selectedTag.value ||
          (webflow.tags && webflow.tags.includes(selectedTag.value));

        return matchesSearch && matchesTag;
      });
    };
    
    const onItemTypeChange = () => {
      console.log('Item type changed to:', webflowForm.value.itemType);
      // Update isFolder based on selection
      webflowForm.value.isFolder = webflowForm.value.itemType === 'folder';
      
      // You can add additional logic here based on the type
      if (webflowForm.value.itemType === 'folder') {
        // Folder-specific logic
        // Maybe change default icon for folders
        if (webflowForm.value.icon === 'pi pi-sitemap') {
          webflowForm.value.icon = 'pi pi-folder';
        }
      } else {
        // File-specific logic
        // Maybe change default icon for files
        if (webflowForm.value.icon === 'pi pi-folder') {
          webflowForm.value.icon = 'pi pi-sitemap';
        }
      }
    };
    
    const openCreateDrawer = () => {
      isEditing.value = false;
      webflowForm.value = {
        name: '',
        description: '',
        icon: 'pi pi-sitemap',
        tags: [],
        itemType: 'file', // Default to file
        isFolder: false,
        parentId: null,
        openApiDocConfig: {
          enabled: false,
          url: '',
          baseUrl: '',
          fromFile: false,
          fileData: null,
        },
      };
      nameError.value = '';
      drawerOpen.value = true;
    };
    
    const editWebflow = (webflow: WebflowCardProps) => {
      isEditing.value = true;
      webflowForm.value = {
        id: webflow.id,
        name: webflow.name,
        description: webflow.description || '',
        icon: webflow.icon || 'pi pi-sitemap',
        tags: webflow.tags ? [...webflow.tags] : [],
        itemType: webflow.isFolder ? 'folder' : 'file', // Set based on existing isFolder
        isFolder: webflow.isFolder || false,
        parentId: webflow.parentId || null,
        openApiDocConfig: {
          enabled: webflow.openApiDocConfig?.enabled || false,
          url: webflow.openApiDocConfig?.url || '',
          baseUrl: webflow.openApiDocConfig?.baseUrl || '', // Optional base URL for OpenAPI
          fromFile: webflow.openApiDocConfig?.fromFile || false,
          fileData: webflow.openApiDocConfig?.fileData || null,
        },
      };
      nameError.value = '';
      drawerOpen.value = true;
    };
    
    const closeDrawer = () => {
      drawerOpen.value = false;
      nameError.value = '';
    };
    
    const addTag = () => {
      if (
        tagInput.value.trim() &&
        !webflowForm.value.tags.includes(tagInput.value.trim())
      ) {
        webflowForm.value.tags.push(tagInput.value.trim());
        tagInput.value = '';
      }
    };
    
    const removeTag = (index: number) => {
      webflowForm.value.tags.splice(index, 1);
    };
    
    const saveWebflow = async () => {
      try {
        // Reset error message
        nameError.value = '';

        // Validate name
        if (!webflowForm.value.name) {
          nameError.value = 'Name is required';
          return;
        }

        if (webflowForm.value.name.length < 3) {
          nameError.value = 'Name must be at least 3 characters long';
          return;
        }

        if (isEditing.value && webflowForm.value.id) {
          // Update existing webflow
          await webflowService.updateWebflow(webflowForm.value.id, {
            name: webflowForm.value.name,
            description: webflowForm.value.description,
            icon: webflowForm.value.icon,
            tags: webflowForm.value.tags,
            isFolder: webflowForm.value.isFolder,
            parentId: router.currentRoute.value.query.folderId as string || null,
            openApiDocConfig: webflowForm.value.openApiDocConfig,
          });

          // Show success message
          success('Webflow updated successfully!');
        } else {
          // Create new webflow
          await webflowService.createWebflow({
            name: webflowForm.value.name,
            description: webflowForm.value.description,
            icon: webflowForm.value.icon,
            tags: webflowForm.value.tags,
            isFolder: webflowForm.value.isFolder,
            parentId: router.currentRoute.value.query.id as string || null,
            openApiDocConfig: webflowForm.value.openApiDocConfig,
          });

          // Show success message
          success('Webflow created successfully!');
        }

        closeDrawer();
        await fetchWebflows();
      } catch (e: any) {
        console.error('Error saving webflow:', e);

        // Display appropriate error message
        if (e.response) {
          if (e.response.status === 401 || e.response.status === 403) {
            error('Session expired. Please log in again.');
            router.push('/login');
          } else if (e.response.data && e.response.data.message) {
            error(`Error: ${e.response.data.message}`);
          } else {
            error('Error saving webflow. Please try again.');
          }
        } else {
          error('Network error. Please check your connection and try again.');
        }
      }
    };
    
    const confirmDelete = (webflow: WebflowCardProps) => {
      webflowToDelete.value = webflow;
      showDeleteConfirm.value = true;
    };
    
    const deleteWebflow = async () => {
      if (!webflowToDelete.value) return;

      try {
        await webflowService.deleteWebflow(webflowToDelete.value.id);

        // Show success message
        success('Webflow deleted successfully!');

        showDeleteConfirm.value = false;
        webflowToDelete.value = null;
        await fetchWebflows();
      } catch (e: any) {
        console.error('Error deleting webflow:', e);

        // Display appropriate error message
        if (e.response) {
          if (e.response.status === 401 || e.response.status === 403) {
            error('Session expired. Please log in again.');
            router.push('/login');
          } else if (e.response.data && e.response.data.message) {
            error(`Error: ${e.response.data.message}`);
          } else {
            error('Error deleting webflow. Please try again.');
          }
        } else {
          error('Network error. Please check your connection and try again.');
        }
      }
    };
    
    const navigateToWorkflow = (id: string) => {
      // Navigate to the workflow editor page with the selected webflow
      router.push(`/playground?id=${id}`);
    };

    const handleFileError = (errorMessage: string) => {
      error(errorMessage);
    };
    
    // Initialize on component creation
    onMounted(async () => {
      await fetchWebflows();
    });

    // Watch for parentId changes and refetch the list
    watch(
      () => router.currentRoute.value.query.id,
      async (newId, oldId) => {
        if (newId !== oldId) {
          await fetchWebflows();
        }
      }
    );
    
    return {
      webflows,
      filteredWebflows,
      loading,
      searchQuery,
      selectedTag,
      drawerOpen,
      isEditing,
      webflowForm,
      nameError,
      tagInput,
      showDeleteConfirm,
      webflowToDelete,
      uniqueTags,
      fetchWebflows,
      filterWebflows,
      onItemTypeChange,
      openCreateDrawer,
      editWebflow,
      closeDrawer,
      addTag,
      removeTag,
      saveWebflow,
      confirmDelete,
      deleteWebflow,
      navigateToWorkflow,
      askToImportWebflow,
      importWebflow,
      handleFileError,
    };
  }
});
</script>

<style lang="scss" scoped>
.dashboard-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.dashboard-container {
  padding: var(--spacing-large);
  flex: 1;
  overflow-y: auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-large);

  h1 {
    font-size: var(--font-size-xlarge);
    color: var(--color-text-primary);
  }
}

.dashboard-filters {
  display: flex;
  margin-bottom: var(--spacing-large);
  gap: var(--spacing-medium);
  align-items: stretch;
  
  .search-box {
    position: relative;
    flex: 1;

    i {
      position: absolute;
      right: var(--spacing-medium);
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-text-secondary);
      z-index: 1;
    }

    .wfa-input-container {
      margin-bottom: 0;
    }

    .wfa-input {
      padding-left: calc(var(--spacing-medium) * 2 + 16px);
    }
  }

  .tag-filter {
    width: 200px;

    .wfa-input-container {
      margin-bottom: 0;
    }
  }
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: calc(var(--spacing-xlarge) * 3);
  text-align: center;

  i {
    font-size: 48px;
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-large);
  }

  h3 {
    font-size: var(--font-size-large);
    margin-bottom: var(--spacing-medium);
  }

  p {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-large);
  }
}

.webflow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-large);
}

.webflow-form {
  padding: var(--spacing-large);

  .type-toggle {
    display: flex;
    background: var(--color-light);
    border-radius: 6px;
    padding: 4px;
    gap: 4px;
    
    .radio-group {
      display: flex;
      align-items: center;
      cursor: pointer;
      position: relative;
      flex: 1;
      
      input[type="radio"] {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .radio-label {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: var(--font-size-small);
        font-weight: 500;
        color: var(--color-text-secondary);
        transition: all 0.2s ease;
        width: 100%;
        
        i {
          font-size: 14px;
        }
      }
      
      input[type="radio"]:checked + .radio-label {
        background: var(--color-primary);
        color: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      
      &:hover .radio-label {
        color: var(--color-text-primary);
      }
      
      input[type="radio"]:checked + .radio-label:hover {
        color: white;
      }
    }
  }

  .tag-input {
    .tag-chips {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-small);
      margin-top: var(--spacing-small);
    }

    .tag {
      display: inline-flex;
      align-items: center;
      font-size: var(--font-size-small);
      padding: calc(var(--spacing-small) / 2) var(--spacing-small);
      background-color: var(--color-light);
      color: var(--color-text-secondary);
      border-radius: 4pt;

      .tag-remove {
        margin-left: var(--spacing-small);
        background: none;
        border: none;
        color: var(--color-text-secondary);
        cursor: pointer;
        font-size: 14px;
        line-height: 1;
        padding: 0;

        &:hover {
          color: var(--color-danger);
        }
      }
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-medium);
    margin-top: var(--spacing-large);
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-bottom: var(--spacing-small);

    .checkbox-input {
      margin-right: var(--spacing-small);
      cursor: pointer;
    }

    .checkbox-text {
      color: var(--color-text-primary);
      font-size: var(--font-size-base);
    }
  }
}

.delete-confirm {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  width: 400px;
  background-color: var(--color-white);
  border-radius: 8pt;
  padding: var(--spacing-large);
  box-shadow: var(--shadow-drop);
  z-index: calc(var(--z-100, 100) + 1);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;

  &.show-modal {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, -50%) scale(1);
  }

  h3 {
    margin-bottom: var(--spacing-medium);
    color: var(--color-text-primary);
  }

  p {
    margin-bottom: var(--spacing-medium);
    color: var(--color-text-secondary);

    &.text-danger {
      color: var(--color-danger);
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-medium);

    .btn-danger {
      background-color: var(--color-danger);
      color: white;

      &:hover {
        background-color: var(--color-danger);
      }
    }
  }
}

/* Radio button and OpenAPI configuration styles */
.radio-group-label {
  display: block;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-small);
}

.radio-group {
  display: flex;
  gap: var(--spacing-large);
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: var(--font-size-medium);
}

.radio-input {
  margin-right: var(--spacing-small);
  cursor: pointer;
}

.radio-text {
  color: var(--color-text-primary);
}

.openapi-config {
  border: 1px solid var(--color-border);
  border-radius: 8pt;
  padding: var(--spacing-large);
  background-color: var(--color-light);
  margin-top: var(--spacing-medium);
}

.wfa-label {
  display: block;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-small);
}
</style>
