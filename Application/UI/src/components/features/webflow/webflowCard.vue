<template>
  <div class="webflow-card" :class="{ 'folder-card': webFlow.isFolder }" @click="handleOpen">
    <!-- Card Header -->
    <div class="card-header">
      <div class="card-title-section">
        <div class="title-with-icon">
          <div class="card-icon">
            <i v-if="!webFlow.isFolder" :class="webFlow.icon || 'fas fa-code'"></i>
            <i v-else class="fas fa-folder"></i>
          </div>
          <h3 class="card-title">{{ webFlow.name }}</h3>
        </div>
      </div>
      
      <div class="card-actions" ref="menuRef">
        <button 
          class="menu-trigger"
          @click.stop="toggleMenu"
          :class="{ active: showMenu }"
          aria-label="More options"
        >
          <i class="fas fa-ellipsis-v"></i>
        </button>
        
        <!-- Dropdown Menu -->
        <div v-if="showMenu" class="dropdown-menu">
          <button v-if="!webFlow.isFolder" class="menu-item" @click.stop="handleOpen">
            <i class="fas fa-eye"></i>
            <span>View Details</span>
          </button>
          <button v-if="!webFlow.isFolder" class="menu-item" @click.stop="linkEnvFileDialogVisible = true">
            <i class="fas fa-link"></i>
            <span>Link to Env File</span>
          </button>
          <button class="menu-item" @click.stop="handleEdit">
            <i class="fas fa-edit"></i>
            <span>Edit Details</span>
          </button>
          <div class="menu-divider"></div>
          <button class="menu-item menu-item-danger" @click.stop="handleDelete">
            <i class="fas fa-trash"></i>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>

<!-- Card Footer -->
    <div class="card-footer" v-if="!webFlow.isFolder">
      <div class="card-meta">
        <span class="last-updated">
          <i class="fas fa-clock"></i>
          <span>:</span>
          {{ formatDate(webFlow.updatedAt) }}
        </span>
      </div>
    </div>
    <!-- Card Content -->
    <div class="card-content" v-if="!webFlow.isFolder">
      <!-- Tags Section -->
      <i class="fa fa-tag"></i>
      <span>:</span>
      <div v-if="webFlow.tags && webFlow.tags.length > 0" class="tags-summary">
        <div class="tags-list">
          <span v-for="tag in webFlow.tags.slice(0, 2)" :key="tag" class="tag">
            {{ tag }}
          </span>
          <span v-if="webFlow.tags.length > 2" class="tag-more">
            +{{ webFlow.tags.length - 2 }}
          </span>
        </div>
      </div>
    </div>
  </div>
  <ui-drawer v-model:visible="linkEnvFileDialogVisible" title="Link Environment File" size="lg"  :width="600">
    <webflow-env-file-manager :webFlowId="webFlow.id" @close="linkEnvFileDialogVisible = false" />
  </ui-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { toast } from '@/utils'
import type { WebFlow } from '@/services/webflow'
import router from '@/router';
import { UiDrawer } from '@/components/base'

// Dynamic import for the env file manager
const WebflowEnvFileManager = defineAsyncComponent(() => import('./webflowEnvFileManager.vue'))

interface Props {
  webFlow: WebFlow
}

const props = defineProps<Props>()

const emit = defineEmits<{
  open: [webFlow: WebFlow]
  edit: [webFlow: WebFlow]
  delete: [webFlow: WebFlow]
}>()

// Component state
const showMenu = ref(false)
const menuRef = ref<HTMLElement>()
const linkEnvFileDialogVisible = ref(false)

// Menu toggle
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

// Close menu when clicking outside
const handleClickOutside = (event: Event) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    showMenu.value = false
  }
}

// Event handlers
const handleOpen = () => {
  showMenu.value = false
  if (props.webFlow.isFolder) {
    router.push({ name: 'Webflow', query: { wfid: props.webFlow.id } })
    return
  } else {
    router.push({ name: 'WebflowPlayground', query: { wfid: props.webFlow.id } })
  }
}

const handleEdit = () => {
  emit('edit', props.webFlow)
  showMenu.value = false
}

const handleDelete = () => {
  emit('delete', props.webFlow)
  showMenu.value = false
}

// Format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}


// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Glass Card Container */
.webflow-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm);
  cursor: pointer;
  transition: all var(--transition-spring);
  box-shadow: var(--shadow-sm);
  z-index: 1;
}

.webflow-card:hover {
  box-shadow: var(--shadow-lg);
  border-color: var(--glass-border-hover);
}


.folder-card .card-icon {
  color: var(--color-flow-amber);
}

.card-header {
  background: transparent;
  border-bottom: none;
  max-width: 300px;
}

/* Card Header */
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  padding: var(--spacing-sm);
}


.card-title-section {
  flex: 1;
  min-width: 0;
}

.title-with-icon {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.card-icon {
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  flex-shrink: 0;
}

.card-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-dark);
  margin: 0 0 var(--spacing-xs) 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: var(--gradient-flow-blue);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-description {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Card Actions */
.card-actions {
  position: relative;
  flex-shrink: 0;
}

.menu-trigger {
  background: var(--glass-bg);
  border:none;
  border-radius: var(--radius-sm);
  padding: var(--spacing-xs);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all var(--transition-spring);
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--spacing-sm);
  background: var(--color-background);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  z-index: var(--z-dropdown);
  min-width: 200px;
  box-shadow: var(--shadow-xl);
  padding: var(--spacing-sm);
}

.menu-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  background: none;
  border: none;
  background: none;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  gap: var(--spacing-sm);
  transition: all var(--transition-spring);
}

.menu-item:hover {
  background: var(--glass-bg-hover);
  color: var(--text-primary);
  transform: translateX(2px);
}

.menu-item i {
  width: 16px;
  text-align: center;
  color: var(--color-text-secondary);
  transition: color var(--transition-spring);
}

.menu-item:hover i {
  color: var(--color-flow-blue);
}

.menu-item-danger {
  color: var(--color-danger);
}

.menu-item-danger:hover {
  background: var(--glass-bg-subtle);
  color: var(--color-danger);
}

.menu-item-danger i {
  color: var(--color-danger);
}

.menu-divider {
  height: 1px;
  background: var(--glass-border);
  margin: var(--spacing-sm) 0;
}

/* Card Content */
.card-content {
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  grid-gap: var(--spacing-sm);
  padding: var(--spacing-sm);
}

.card-content i {
  color: var(--color-text-secondary);
}

.tags-summary {
  margin-bottom: var(--spacing-sm);
}

.tags-list {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.tag {
  background: var(--color-accent-cyan);
  padding: 0 var(--spacing-md);
  border-radius: var(--radius-full);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  letter-spacing: var(--letter-spacing-wide);
}

.tag-more {
  background: var(--color-bg-light);
  padding: 0 var(--spacing-md);
  border-radius: var(--radius-full);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  letter-spacing: var(--letter-spacing-wide);
  border: 1px solid var(--color-border);
}

/* Card Footer */
.card-footer {
  background: transparent;
  border-top: none;
  padding: var(--spacing-sm);
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: left;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.last-updated {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-weight: var(--font-medium);
}

.last-updated i {
  color: var(--text-tertiary);
}

</style>
