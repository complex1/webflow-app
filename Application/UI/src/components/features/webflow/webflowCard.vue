<template>
  <!-- Card with horizontal layout -->
  <div class="webflow-card" :class="{ 'folder-card': webFlow.isFolder, 'webflow-card-item': !webFlow.isFolder }" @click="handleOpen">
    <div class="card-content">
      <!-- Icon and Name Section -->
      <div class="card-main">
        <div class="card-icon">
          <i v-if="!webFlow.isFolder" :class="webFlow.icon"></i>
          <i v-else class="fas fa-folder"></i>
        </div>
        <span>:</span>
        <div class="card-info">
          <h3 class="card-title">{{ webFlow.name }}</h3>
        </div>
      </div>

      <!-- Tag Section -->
      <div v-if="!webFlow.isFolder && webFlow.tags  && webFlow.tags.length > 0" class="card-tag-section">
        <div class="tag-icon">
          <i class="fas fa-tag"></i>
        </div>
        <div class="tag-content">
          <span class="tag-label">:</span>
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

      <!-- Date Section -->
      <div class="card-date-section" v-if="!webFlow.isFolder">
        <div class="date-icon">
          <i class="fas fa-calendar"></i>
        </div>
        <div class="date-content">
          <span class="date-label">:</span>
          <span class="date-value">{{ formatDate(webFlow.updatedAt) }}</span>
        </div>
      </div>

      <!-- Actions Menu -->
      <div class="card-actions" ref="menuRef">
        <button class="menu-trigger" @click.stop="toggleMenu" aria-label="More options">
          <i class="fas fa-ellipsis-v"></i>
        </button>
        <div v-if="showMenu" class="dropdown-menu">
          <button v-if="!webFlow.isFolder" class="menu-item" @click.stop="handleOpen">
            <i class="fas fa-eye"></i> View Details
          </button>
          <button v-if="!webFlow.isFolder" class="menu-item" @click.stop="linkEnvFileDialogVisible = true">
            <i class="fas fa-link"></i> Link to Env File
          </button>
          <button class="menu-item" @click.stop="handleEdit">
            <i class="fas fa-edit"></i> Edit Details
          </button>
          <button class="menu-item menu-item--danger" @click.stop="handleDelete">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>
  </div>
  <ui-drawer v-model:visible="linkEnvFileDialogVisible" title="Link Environment File" size="lg"  :width="600">
    <webflow-env-file-manager :webFlowId="webFlow.id" @close="linkEnvFileDialogVisible = false" />
  </ui-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { toast } from '@/utils'
import type { WebFlow } from '@/services/webflow'
import router from '@/router';
import WebflowEnvFileManager from './webflowEnvFileManager.vue'
import { UiDrawer } from '@/components/base'

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
    router.push({ name: 'Dashboard', query: { wfid: props.webFlow.id } })
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
    day: 'numeric'
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
.webflow-card {
    background: var(--color-background-elevated);
    border: 1px solid var(--color-border);
    border-top: 3px solid var(--gradient-primary);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    cursor: pointer;
    transition: all 0.3s ease;
    width: 300px;
    height: 140px;
    position: relative;
    backdrop-filter: var(--blur-md);
    box-shadow: var(--shadow-lg);
}

.webflow-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--gradient-primary);
    z-index: 1;
}

.folder-card {
    height: 80px;
    background: var(--color-background-subtle);
    border-top-color: var(--color-accent);
}

.folder-card::before {
    background: var(--gradient-accent);
}

.webflow-card-item {
    height: 140px;
}

.webflow-card:hover {
    border-color: var(--color-primary);
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
}

.webflow-card:active {
    border-color: var(--color-primary);
    transform: translateY(-2px);
}

.card-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    position: relative;
    z-index: 2;
}

.card-main {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.card-icon {
    font-size: var(--font-size-xl);
    color: var(--color-primary);
    transition: all 0.2s ease;
}

.folder-card .card-icon {
    color: var(--color-accent);
}

.card-icon:hover {
    transform: scale(1.1);
}

.card-info {
    width: 180px;
}

.card-title {
    width: 200px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
}

.card-tag-section {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-xs) 0;
}

.tag-icon {
    font-size: var(--font-size-sm);
    color: var(--color-primary);
}

.tag-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.tags-list {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
}

.tags-list .tag {
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
    color: var(--color-text-inverse);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-full);
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: var(--shadow-sm);
    transition: all 0.2s ease;
}

.tags-list .tag:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-md);
}

.tags-list .tag-more {
    color: var(--color-text-secondary);
    font-size: var(--font-size-xs);
    font-weight: 500;
    background: var(--color-background-subtle);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-full);
    border: 1px solid var(--color-border);
}

.tags-list .tag-more:hover {
    color: var(--color-primary);
    border-color: var(--color-primary);
    background: var(--color-primary-subtle);
}

.card-date-section {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.date-icon {
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
}

.date-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.date-label {
    color: var(--color-text-secondary);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
}

.date-value {
    color: var(--color-text-primary);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
}

.card-actions {
    position: absolute;
    top: 4px;
    right: var(--spacing-sm);
}

.card-actions .menu-trigger {
    border: none;
    background: none;
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
    cursor: pointer;
}

.card-actions .menu-trigger:hover {
    color: var(--color-text-primary);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
}

.card-actions .dropdown-menu {
    position: absolute;
    width: 200px;
    top: 100%;
    right: 0;
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-sm);
    box-shadow: var(--shadow-md);
    z-index: var(--z-dropdown);
}

.card-actions .dropdown-menu .menu-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    cursor: pointer;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
    background: var(--color-background);
    border-radius: var(--radius-md);
    padding: var(--spacing-sm);
    border: none;
}

.card-actions .dropdown-menu .menu-item:hover {
    color: var(--color-text-primary);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
}

.card-actions .dropdown-menu .menu-item--danger {
    color: var(--color-error);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
}
</style>
