<template>
  <div class="dashboard-page">
    <navbar></navbar>
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>My Webflows</h1>
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
            <i class="pi pi-plus mx-s"></i> Create New Webflow
          </button>
          <button class="btn btn-secondary fh" @click="askToImportWebflow">
            <i class="pi pi-upload mx-s"></i> Import Webflow
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
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { WebflowService } from '../services/webflow.service';
import drawer from '../components/common/drawer.vue';
import navbar from '../components/common/navbar.vue';
import wfaInput from '../components/common/wfa-input.vue';
import webflowCard from '../components/dashboard/webflow-card.vue';
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
        const result = await webflowService.getMyWebflows();
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
    
    const openCreateDrawer = () => {
      isEditing.value = false;
      webflowForm.value = {
        name: '',
        description: '',
        icon: 'pi pi-sitemap',
        tags: [],
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
    
    // Initialize on component creation
    onMounted(async () => {
      await fetchWebflows();
    });
    
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
</style>
