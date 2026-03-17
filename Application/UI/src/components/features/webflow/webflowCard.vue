<template>
  <div class="webflow-card" :class="{ 'folder-card': webFlow.isFolder, 'webflow-item-card': !webFlow.isFolder }" @click="handleOpen">
    <!-- Row 1: Icon, Name and Menu -->
    <div class="card-header">
      <div class="card-title-section">
        <div class="card-icon">
          <i v-if="!webFlow.isFolder" :class="webFlow.icon || 'fas fa-code'"></i>
          <i v-else class="fas fa-folder"></i>
        </div>
        <h3 class="card-title">{{ webFlow.name }}</h3>
      </div>
      
      <div class="card-actions">
        <button 
          ref="menuTrigger"
          class="menu-trigger"
          @click.stop="toggleMenu"
          :class="{ active: showMenu }"
          aria-label="More options"
        >
          <i class="fas fa-ellipsis-v"></i>
        </button>
      </div>
    </div>

    <!-- Row 2: Tags (max 2) -->
    <div v-if="!webFlow.isFolder && webFlow.tags && webFlow.tags.length > 0" class="card-tags">
      <div class="tags-list">
        <span v-for="tag in webFlow.tags.slice(0, 2)" :key="tag" class="tag">
          {{ tag }}
        </span>
        <span v-if="webFlow.tags.length > 2" class="tag-more">
          +{{ webFlow.tags.length - 2 }}
        </span>
      </div>
    </div>

    <!-- Row 3: Time -->
    <div v-if="!webFlow.isFolder" class="card-footer">
      <div class="card-time">
        <i class="fas fa-clock"></i>
        <span>{{ formatDate(webFlow.updatedAt) }}</span>
      </div>
    </div>

    <!-- Actions Popover -->
    <UiFixedPopover
      v-model:visible="showMenu"
      :target-element="menuTrigger"
      placement="bottom-end"
      size="sm"
      :show-arrow="true"
      :closable="false"
    >
      <div class="actions-menu">
        <button v-if="!webFlow.isFolder" class="menu-item" @click="handleMenuAction(handleOpen)">
          <i class="fas fa-eye"></i>
          <span>View Details</span>
        </button>
        <button v-if="!webFlow.isFolder" class="menu-item" @click="handleMenuAction(() => linkEnvFileDialogVisible = true)">
          <i class="fas fa-link"></i>
          <span>Link to Env File</span>
        </button>
        <button class="menu-item" @click="handleMenuAction(handleEdit)">
          <i class="fas fa-edit"></i>
          <span>Edit Details</span>
        </button>
        <div class="menu-divider"></div>
        <button class="menu-item menu-item-danger" @click="handleMenuAction(handleDelete)">
          <i class="fas fa-trash"></i>
          <span>Delete</span>
        </button>
      </div>
    </UiFixedPopover>
  </div>

  <!-- Environment File Manager Drawer -->
  <UiDrawer v-model:visible="linkEnvFileDialogVisible" title="Link Environment File" size="lg" :width="600">
    <WebflowEnvFileManager :webFlowId="webFlow.id" @close="linkEnvFileDialogVisible = false" />
  </UiDrawer>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import { toast } from '@/utils'
import type { WebFlow } from '@/services/webflow'
import router from '@/router';
import { UiDrawer, UiFixedPopover } from '@/components/base'

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
const menuTrigger = ref<HTMLElement>()
const linkEnvFileDialogVisible = ref(false)

// Menu toggle
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

// Handle menu action and close popover
const handleMenuAction = (action: () => void) => {
  action()
  showMenu.value = false
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

</script>

<style scoped>
/* Glass Card Container */
.webflow-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-md);
  cursor: pointer;
  position: relative;
  transition: all var(--transition-spring);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.webflow-item-card {
  min-height: 150px;
  min-width: 200px;
}

.webflow-card:hover {
  box-shadow: var(--shadow-lg);
  border-color: var(--color-border-hover);
}

.webflow-card:active {
  transform: translateY(0);
  box-shadow: var(--shadow-md);
}

/* Folder Card Variant */
.folder-card {
  background: linear-gradient(135deg, 
    rgba(255, 149, 0, 0.05), 
    rgba(255, 149, 0, 0.02)
  );
}

.folder-card .card-icon {
  color: var(--color-accent-amber);
}

/* Row 1: Header with Icon, Name and Menu */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  padding: 0;
  background-color: transparent;
  border-bottom: none;
}

.card-title-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
  min-width: 0;
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--color-primary-subtle);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  flex-shrink: 0;
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
  line-height: var(--line-height-tight);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: var(--gradient-flow-blue);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Card Actions */
.card-actions {
  position: relative;
  flex-shrink: 0;
}

.menu-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid var(--color-border-subtle);
  background: var(--color-background-subtle);
  color: var(--color-text-secondary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-spring);
  font-size: var(--font-size-xs);
}

.menu-trigger:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
  border-color: var(--color-border-hover);
}

.menu-trigger.active {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-color: var(--color-primary);
}

/* Row 2: Tags */
.card-tags {
  display: flex;
  align-items: center;
  min-height: 24px;
}

.tags-list {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.tag {
  background: var(--color-primary-subtle);
  border: 1px solid var(--color-border-subtle);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  color: var(--color-primary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  transition: all var(--transition-spring);
}

.tag:hover {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

.tag-more {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

/* Row 3: Time */
.card-footer {
  margin-top: auto;
  padding: var(--spacing-xs);
  border-top: none;
  border-radius: 0;
}

.card-time {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  font-weight: var(--font-weight-medium);
}

.card-time i {
  color: var(--color-text-tertiary);
  width: 12px;
  text-align: center;
}

/* Actions Menu (inside UiFixedPopover) */
.actions-menu {
  padding: var(--spacing-xs);
}

.actions-menu .menu-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  background: none;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  gap: var(--spacing-sm);
  border-radius: var(--radius-lg);
  transition: all var(--transition-spring);
  text-align: left;
}

.actions-menu .menu-item:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

.actions-menu .menu-item i {
  width: 16px;
  text-align: center;
  color: var(--color-text-secondary);
  transition: color var(--transition-spring);
}

.actions-menu .menu-item:hover i {
  color: var(--color-primary);
}

.actions-menu .menu-item-danger {
  color: var(--color-danger);
}

.actions-menu .menu-item-danger:hover {
  background: var(--color-danger-subtle);
  color: var(--color-danger);
}

.actions-menu .menu-item-danger i {
  color: var(--color-danger);
}

.actions-menu .menu-divider {
  height: 1px;
  background: var(--color-border-subtle);
  margin: var(--spacing-sm) 0;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .webflow-card {
    max-width: 100%;
    min-height: 120px;
  }
  
  .card-title {
    font-size: var(--font-size-md);
  }
  
  .tags-list {
    max-width: 100%;
    overflow: hidden;
  }
}
</style>
