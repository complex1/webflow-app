<template>
  <div class="dashboard-page">
    <navbar></navbar>
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>My Webflows</h1>
        <button class="btn btn-primary" @click="openCreateDrawer">
          <i class="pi pi-plus"></i> Create New Webflow
        </button>
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
            <option v-for="tag in uniqueTags" :key="tag" :value="tag">{{ tag }}</option>
          </wfa-input>
        </div>
      </div>

      <div v-if="loading" class="loading-state">
        <i class="pi pi-spin pi-spinner"></i>
        <p>Loading webflows...</p>
      </div>

      <div v-else-if="filteredWebflows.length === 0" class="empty-state">
        <i class="pi pi-exclamation-circle"></i>
        <h3>No webflows found</h3>
        <p v-if="searchQuery || selectedTag">Try adjusting your filters or create a new webflow.</p>
        <p v-else>Get started by creating your first webflow!</p>
        <button class="btn btn-primary" @click="openCreateDrawer">Create New Webflow</button>
      </div>

      <div v-else class="webflow-grid">
        <div 
          v-for="webflow in filteredWebflows" 
          :key="webflow.id" 
          class="webflow-card"
          @click="navigateToWorkflow(webflow.id)"
        >
          <div class="webflow-icon">
            <i :class="webflow.icon || 'pi pi-sitemap'"></i>
          </div>
          <div class="webflow-info">
            <h3>{{ webflow.name }}</h3>
            <p class="description">{{ webflow.description || 'No description' }}</p>
            <div class="tag-list">
              <span v-for="tag in webflow.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
          <div class="webflow-actions">
            <button 
              class="btn btn-icon" 
              data-tooltip="Edit" 
              data-tooltip-position="left"
              @click.stop="editWebflow(webflow)"
            >
              <i class="pi pi-pencil"></i>
            </button>
            <button 
              class="btn btn-icon text-danger" 
              data-tooltip="Delete" 
              data-tooltip-position="left"
              @click.stop="confirmDelete(webflow)"
            >
              <i class="pi pi-trash"></i>
            </button>
          </div>
        </div>
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
                <span v-for="(tag, index) in webflowForm.tags" :key="index" class="tag">
                  {{ tag }}
                  <button type="button" class="tag-remove" @click="removeTag(index)">&times;</button>
                </span>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" @click="closeDrawer">Cancel</button>
            <button type="submit" class="btn btn-primary">
              {{ isEditing ? 'Update' : 'Create' }} Webflow
            </button>
          </div>
        </form>
      </drawer>

      <!-- Delete Confirmation Modal -->
      <div class="mask" :class="{ show: showDeleteConfirm }" @click="showDeleteConfirm = false"></div>
      <div class="delete-confirm" :class="{ 'show-modal': showDeleteConfirm }">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete the webflow <strong>{{ webflowToDelete?.name }}</strong>?</p>
        <p class="text-danger">This action cannot be undone.</p>
        <div class="form-actions">
          <button class="btn btn-outline" @click="showDeleteConfirm = false">Cancel</button>
          <button class="btn btn-danger" @click="deleteWebflow">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { WebflowService } from "../services/webflow.service";
import drawer from "../components/common/drawer.vue";
import navbar from "../components/common/navbar.vue";
import wfaInput from "../components/common/wfa-input.vue";

export default {
  name: "DashboardPage",
  components: {
    drawer,
    navbar,
    wfaInput
  },
  data() {
    return {
      webflows: [],
      filteredWebflows: [],
      loading: true,
      searchQuery: "",
      selectedTag: "",
      drawerOpen: false,
      isEditing: false,
      webflowForm: {
        name: "",
        description: "",
        icon: "pi pi-sitemap",
        tags: [],
      },
      nameError: "",
      tagInput: "",
      showDeleteConfirm: false,
      webflowToDelete: null,
    };
  },
  computed: {
    uniqueTags() {
      // Extract all unique tags from webflows
      const allTags = this.webflows
        .filter((webflow) => webflow.tags && webflow.tags.length > 0)
        .flatMap((webflow) => webflow.tags);
      return [...new Set(allTags)];
    },
  },
  async created() {
    await this.fetchWebflows();
  },
  methods: {
    async fetchWebflows() {
      try {
        this.loading = true;
        const webflowService = new WebflowService();
        const webflows = await webflowService.getMyWebflows();
        this.webflows = Array.isArray(webflows) ? webflows : [];
        this.filteredWebflows = [...this.webflows];
      } catch (error) {
        console.error("Error fetching webflows:", error);
        this.webflows = [];
        this.filteredWebflows = [];

        // Check if unauthorized (likely token expired)
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          // Redirect to login
          this.$router.push("/login");
        }
      } finally {
        this.loading = false;
      }
    },
    filterWebflows() {
      // Filter webflows based on search query and selected tag
      this.filteredWebflows = this.webflows.filter((webflow) => {
        const matchesSearch =
          !this.searchQuery ||
          webflow.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (webflow.description &&
            webflow.description
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()));

        const matchesTag =
          !this.selectedTag ||
          (webflow.tags && webflow.tags.includes(this.selectedTag));

        return matchesSearch && matchesTag;
      });
    },
    openCreateDrawer() {
      this.isEditing = false;
      this.webflowForm = {
        name: "",
        description: "",
        icon: "pi pi-sitemap",
        tags: [],
      };
      this.drawerOpen = true;
    },
    editWebflow(webflow) {
      this.isEditing = true;
      this.webflowForm = {
        id: webflow.id,
        name: webflow.name,
        description: webflow.description || "",
        icon: webflow.icon || "pi pi-sitemap",
        tags: webflow.tags ? [...webflow.tags] : [],
      };
      this.drawerOpen = true;
    },
    closeDrawer() {
      this.drawerOpen = false;
    },
    addTag() {
      if (
        this.tagInput.trim() &&
        !this.webflowForm.tags.includes(this.tagInput.trim())
      ) {
        this.webflowForm.tags.push(this.tagInput.trim());
        this.tagInput = "";
      }
    },
    removeTag(index) {
      this.webflowForm.tags.splice(index, 1);
    },
    async saveWebflow() {
      try {
        // Reset error message
        this.nameError = "";
        
        // Validate name
        if (!this.webflowForm.name) {
          this.nameError = "Name is required";
          return;
        }
        
        if (this.webflowForm.name.length < 3) {
          this.nameError = "Name must be at least 3 characters long";
          return;
        }

        const webflowService = new WebflowService();

        if (this.isEditing && this.webflowForm.id) {
          await webflowService.updateWebflow(this.webflowForm.id, {
            name: this.webflowForm.name,
            description: this.webflowForm.description,
            icon: this.webflowForm.icon,
            tags: this.webflowForm.tags,
          });

          // Show success message
          alert("Webflow updated successfully!");
        } else {
          await webflowService.createWebflow({
            name: this.webflowForm.name,
            description: this.webflowForm.description,
            icon: this.webflowForm.icon,
            tags: this.webflowForm.tags,
          });

          // Show success message
          alert("Webflow created successfully!");
        }

        this.closeDrawer();
        await this.fetchWebflows();
      } catch (error) {
        console.error("Error saving webflow:", error);

        // Display appropriate error message
        if (error.response) {
          if (error.response.status === 401 || error.response.status === 403) {
            alert("Session expired. Please log in again.");
            this.$router.push("/login");
          } else if (error.response.data && error.response.data.message) {
            alert(`Error: ${error.response.data.message}`);
          } else {
            alert("Error saving webflow. Please try again.");
          }
        } else {
          alert("Network error. Please check your connection and try again.");
        }
      }
    },
    confirmDelete(webflow) {
      this.webflowToDelete = webflow;
      this.showDeleteConfirm = true;
    },
    async deleteWebflow() {
      if (!this.webflowToDelete) return;

      try {
        const webflowService = new WebflowService();
        await webflowService.deleteWebflow(this.webflowToDelete.id);

        // Show success message
        alert("Webflow deleted successfully!");

        this.showDeleteConfirm = false;
        this.webflowToDelete = null;
        await this.fetchWebflows();
      } catch (error) {
        console.error("Error deleting webflow:", error);

        // Display appropriate error message
        if (error.response) {
          if (error.response.status === 401 || error.response.status === 403) {
            alert("Session expired. Please log in again.");
            this.$router.push("/login");
          } else if (error.response.data && error.response.data.message) {
            alert(`Error: ${error.response.data.message}`);
          } else {
            alert("Error deleting webflow. Please try again.");
          }
        } else {
          alert("Network error. Please check your connection and try again.");
        }
      }
    },
    navigateToWorkflow(id) {
      // Navigate to the workflow editor page with the selected webflow
      this.$router.push(`/playground?id=${id}`);
    },
  },
};
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
  gap: var(--spacing-medium);  .search-box {
    position: relative;
    flex: 1;
    
    i {
      position: absolute;
      left: var(--spacing-medium);
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

.webflow-card {
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);
  border-radius: 8pt;
  box-shadow: var(--shadow-drop);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    .webflow-actions {
      opacity: 1;
    }
  }

  .webflow-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    background-color: var(--color-primary);
    color: white;

    i {
      font-size: 40px;
    }
  }

  .webflow-info {
    padding: var(--spacing-large);
    flex: 1;

    h3 {
      font-size: var(--font-size-large);
      margin-bottom: var(--spacing-small);
      color: var(--color-text-primary);
    }

    .description {
      color: var(--color-text-secondary);
      font-size: var(--font-size-medium);
      margin-bottom: var(--spacing-medium);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-small);
    }

    .tag {
      font-size: var(--font-size-small);
      padding: calc(var(--spacing-small) / 2) var(--spacing-small);
      background-color: var(--color-light);
      color: var(--color-text-secondary);
      border-radius: 4pt;
    }
  }

  .webflow-actions {
    position: absolute;
    top: var(--spacing-medium);
    right: var(--spacing-medium);
    display: flex;
    gap: var(--spacing-small);
    opacity: 0;
    transition: opacity 0.2s ease;
    background-color: var(--color-white);
    border-radius: 4pt;
    padding: calc(var(--spacing-small) / 2);
    box-shadow: var(--shadow-drop);

    .text-danger {
      color: var(--color-danger);
    }
  }
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
