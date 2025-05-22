<template>
  <div 
    class="webflow-card"
    @click="navigateToWorkflow(webflow.id)"
  >
    <div class="webflow-header">
      <div class="webflow-title">
        <i :class="webflow.icon || 'pi pi-sitemap'" class="webflow-icon"></i>
        <h3>{{ webflow.name }}</h3>
      </div>
      <div class="webflow-actions">
        <button
          class="btn btn-icon"
          data-tooltip="Edit"
          @click.stop="editWebflow"
        >
          <i class="pi pi-pencil"></i>
        </button>
        <button
          class="btn btn-icon text-danger"
          data-tooltip="Delete"
          @click.stop="confirmDelete"
        >
          <i class="pi pi-trash"></i>
        </button>
      </div>
    </div>
    <div class="webflow-content">
      <p class="description">
        {{ webflow.description || "No description" }}
      </p>
      <div class="webflow-meta">
        <div class="created-date">
          <i class="pi pi-calendar"></i>
          <span>{{ formatDate(webflow.createdAt) }}</span>
        </div>
        <div class="tag-list">
          <span v-for="tag in webflow.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WebflowCard",
  props: {
    webflow: {
      type: Object,
      required: true
    }
  },
  methods: {
    navigateToWorkflow(id) {
      // Navigate to the workflow editor page with the selected webflow
      this.$router.push(`/playground?id=${id}`);
    },
    editWebflow() {
      // Emit event to parent component to handle editing
      this.$emit('edit', this.webflow);
    },
    confirmDelete() {
      // Emit event to parent component to handle deletion confirmation
      this.$emit('delete', this.webflow);
    },
    formatDate(dateString) {
      if (!dateString) return 'No date';
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      // Format: May 22, 2025
      return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }).format(date);
    }
  }
};
</script>

<style lang="scss" scoped>
.webflow-card {
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);
  border-radius: 8pt;
  box-shadow: var(--shadow-drop);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  position: relative;
  padding: var(--spacing-large);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);

    .webflow-actions {
      opacity: 1;
      visibility: visible;
    }
  }

  .webflow-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-medium);
    
    .webflow-title {
      display: flex;
      align-items: center;
      gap: var(--spacing-small);
      
      .webflow-icon {
        color: var(--color-primary);
        font-size: var(--font-size-large);
      }
      
      h3 {
        font-size: var(--font-size-large);
        color: var(--color-text-primary);
        margin: 0;
      }
    }
  }
  
  .webflow-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    .description {
      color: var(--color-text-secondary);
      font-size: var(--font-size-medium);
      margin-bottom: var(--spacing-medium);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .webflow-meta {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-small);
      
      .created-date {
        display: flex;
        align-items: center;
        gap: var(--spacing-small);
        color: var(--color-text-tertiary, #6c757d);
        font-size: var(--font-size-small);
        
        i {
          font-size: var(--font-size-small);
        }
      }
      
      .tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-small);
        margin-top: var(--spacing-small);
      }
      
      .tag {
        font-size: var(--font-size-small);
        padding: calc(var(--spacing-small) / 2) var(--spacing-small);
        background-color: var(--color-light);
        color: var(--color-text-secondary);
        border-radius: 4pt;
      }
    }
  }

  .webflow-actions {
    display: flex;
    gap: var(--spacing-small);
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    background-color: var(--color-white);
    border-radius: 4pt;
    padding: calc(var(--spacing-small) / 2);
    box-shadow: var(--shadow-drop);
    
    .btn-icon {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4pt;
      
      &:hover {
        background-color: var(--color-light);
      }
    }
    
    .text-danger {
      color: var(--color-danger);
      
      &:hover {
        background-color: rgba(var(--color-danger-rgb, 220, 53, 69), 0.1);
      }
    }
  }
}
</style>
