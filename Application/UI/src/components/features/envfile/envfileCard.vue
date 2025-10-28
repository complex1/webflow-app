<template>
  <div class="envfile-card">
    <!-- Card Header -->
    <div class="card-header">
      <div class="card-title-section">
        <h3 class="card-title">{{ envFile.name }}</h3>
        <p class="card-description">{{ envFile.description || 'No description' }}</p>
      </div>
      
      <div class="card-actions" ref="menuRef">
        <button 
          class="menu-trigger"
          @click="toggleMenu"
          :class="{ active: showMenu }"
        >
          <i class="fas fa-ellipsis-v"></i>
        </button>
        
        <!-- Dropdown Menu -->
        <div v-if="showMenu" class="dropdown-menu" >
          <button class="menu-item" @click="handleView">
            <i class="fas fa-eye"></i>
            <span>View Details</span>
          </button>
          <button class="menu-item" @click="handleEdit">
            <i class="fas fa-edit"></i>
            <span>Edit</span>
          </button>
          <button class="menu-item" @click="handleDuplicate">
            <i class="fas fa-copy"></i>
            <span>Duplicate</span>
          </button>
          <div class="menu-divider"></div>
          <button class="menu-item menu-item-danger" @click="handleDelete">
            <i class="fas fa-trash"></i>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Card Content -->
    <div class="card-content">
      <div class="configs-summary">
        <div class="config-count">
          <i class="fas fa-cog"></i>
          <span>{{ envFile.configs?.length || 0 }} environment variables</span>
        </div>
      </div>
    </div>

    <!-- Card Footer -->
    <div class="card-footer">
      <div class="card-meta">
        <span class="last-updated">
          <i class="fas fa-clock"></i>
          {{ formatDate(envFile.updatedAt) }}
        </span>
      </div>
    </div>

    <!-- Detail Modal -->
    <UiModal
      :visible="showDetailModal"
      :title="`${envFile.name} - Details`"
      size="lg"
      @close="closeDetailModal"
    >
      <div class="detail-content">
        <!-- Basic Info -->
        <div class="detail-section">
          <h4 class="section-title">Basic Information</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <label>Name:</label>
              <span>{{ envFile.name }}</span>
            </div>
            <div class="detail-item">
              <label>Description:</label>
              <span>{{ envFile.description || 'No description provided' }}</span>
            </div>
            <div class="detail-item">
              <label>Created:</label>
              <span>{{ formatDate(envFile.createdAt) }}</span>
            </div>
            <div class="detail-item">
              <label>Last Updated:</label>
              <span>{{ formatDate(envFile.updatedAt) }}</span>
            </div>
          </div>
        </div>

        <!-- Environment Variables -->
        <div class="detail-section">
          <h4 class="section-title">
            Environment Variables ({{ envFile.configs?.length || 0 }})
          </h4>
          <div v-if="envFile.configs && envFile.configs.length > 0" class="configs-detail">
            <div 
              v-for="(config, index) in envFile.configs" 
              :key="config.id || index"
              class="config-detail-item"
            >
              <div class="config-header">
                <span class="config-key">{{ config.key }}</span>
                <button 
                  class="copy-value-btn"
                  @click="copyToClipboard(config.value)"
                  title="Copy value"
                >
                  <i class="fas fa-copy"></i>
                </button>
              </div>
              <div class="config-value">{{ config.value }}</div>
              <div v-if="config.description" class="config-description">
                {{ config.description }}
              </div>
            </div>
          </div>
          <div v-else class="no-configs-detail">
            <i class="fas fa-key"></i>
            <p>No environment variables configured</p>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="modal-actions">
          <UiButton variant="secondary" @click="closeDetailModal">
            Close
          </UiButton>
          <UiButton variant="primary" @click="handleEditFromModal">
            Edit Environment File
          </UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { UiModal, UiButton } from '@/components/base'
import { toast } from '@/utils'
import type { EnvFile } from '@/services'

interface Props {
  envFile: EnvFile
}

const props = defineProps<Props>()

const emit = defineEmits<{
  view: [envFile: EnvFile]
  edit: [envFile: EnvFile]
  duplicate: [envFile: EnvFile]
  delete: [envFile: EnvFile]
}>()

const showMenu = ref(false)
const showDetailModal = ref(false)
const menuRef = ref<HTMLElement>()

const formatDate = (dateString: string) => {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const closeMenu = () => {
  showMenu.value = false
}

const handleView = () => {
  closeMenu()
  showDetailModal.value = true
  emit('view', props.envFile)
}

const handleEdit = () => {
  closeMenu()
  emit('edit', props.envFile)
}

const handleDuplicate = () => {
  closeMenu()
  emit('duplicate', props.envFile)
}

const handleDelete = () => {
  closeMenu()
  emit('delete', props.envFile)
}

const handleEditFromModal = () => {
  showDetailModal.value = false
  emit('edit', props.envFile)
}

const closeDetailModal = () => {
  showDetailModal.value = false
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Value copied to clipboard')
  } catch (error) {
    console.error('Failed to copy:', error)
    toast.error('Failed to copy to clipboard')
  }
}

const handleClickOutside = (event: Event) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.envfile-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  transition: all var(--transition-fast);
  cursor: pointer;
  position: relative;
  max-width: 300px;
}

.envfile-card:hover {
  border-color: var(--color-gray-300);
  box-shadow: var(--shadow-md);
  /* transform: translateY(-1px); */
}

/* Card Header */
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.card-title-section {
  flex: 1;
  min-width: 0;
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

.card-actions {
  position: relative;
  flex-shrink: 0;
}

.menu-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: var(--color-gray-100);
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.menu-trigger:hover {
  background: var(--color-gray-200);
  color: var(--color-text-primary);
}

.menu-trigger.active {
  background: var(--color-primary-dark);
  color: var(--color-text-inverse);
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--spacing-sm);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-dropdown);
  min-width: 180px;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  background: none;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: background-color var(--transition-fast);
  gap: var(--spacing-sm);
}

.menu-item:hover {
  background: var(--color-gray-100);
}

.menu-item i {
  width: 16px;
  text-align: center;
  color: var(--color-text-secondary);
}

.menu-item-danger {
  color: var(--color-error);
}

.menu-item-danger:hover {
  background: var(--color-error-light);
}

.menu-item-danger i {
  color: var(--color-error);
}

.menu-divider {
  height: 1px;
  background: var(--color-border);
  margin: var(--spacing-xs) 0;
}

/* Card Content */
.card-content {
  margin-bottom: var(--spacing-sm);
}

.configs-summary {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm);
  background: var(--color-background-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.config-count {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.config-count i {
  color: var(--color-gray-400);
}

/* Card Footer */
.card-footer {
  border-top: 1px solid var(--color-gray-100);
  padding-top: var(--spacing-sm);
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.last-updated {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

/* Detail Modal */
.detail-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-dark);
  margin: 0;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.detail-item label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.detail-item span {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.configs-detail {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.config-detail-item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  background: var(--color-background-secondary);
}

.config-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.config-key {
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-dark);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: var(--font-size-sm);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.copy-value-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: var(--color-gray-200);
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--font-size-xs);
}

.copy-value-btn:hover {
  background: var(--color-gray-300);
  color: var(--color-text-primary);
}

.config-value {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  background: var(--color-background);
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  word-break: break-all;
  margin-bottom: var(--spacing-sm);
}

.config-description {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  font-style: italic;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.no-configs-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl) var(--spacing-xl);
  color: var(--color-gray-400);
  text-align: center;
}

.no-configs-detail i {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.modal-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-md);
}

/* Dark theme support */
[data-theme="dark"] .envfile-card {
  background: var(--color-gray-800);
  border-color: var(--color-gray-700);
}

[data-theme="dark"] .card-title {
  color: var(--color-text-inverse);
}

[data-theme="dark"] .card-description {
  color: var(--color-gray-400);
}

[data-theme="dark"] .menu-trigger {
  background: var(--color-gray-700);
  color: var(--color-gray-400);
}

[data-theme="dark"] .menu-trigger:hover {
  background: var(--color-gray-600);
  color: var(--color-gray-300);
}

[data-theme="dark"] .dropdown-menu {
  background: var(--color-gray-800);
  border-color: var(--color-gray-700);
}

[data-theme="dark"] .menu-item {
  color: var(--color-gray-300);
}

[data-theme="dark"] .menu-item:hover {
  background: var(--color-gray-700);
}

[data-theme="dark"] .config-item {
  background: var(--color-gray-900);
  border-color: var(--color-gray-700);
}

[data-theme="dark"] .config-key {
  color: var(--color-primary);
}

[data-theme="dark"] .config-value {
  color: var(--color-gray-400);
}

[data-theme="dark"] .card-footer {
  border-color: var(--color-gray-700);
}

[data-theme="dark"] .config-detail-item {
  background: var(--color-gray-900);
  border-color: var(--color-gray-700);
}

[data-theme="dark"] .config-value {
  background: var(--color-gray-800);
  border-color: var(--color-gray-700);
  color: var(--color-gray-300);
}

/* Responsive Design */
@media (max-width: 768px) {
  .envfile-card {
    padding: var(--spacing-md);
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
  
  .card-actions {
    align-self: flex-end;
  }
  
  .card-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-actions .ui-button {
    width: 100%;
  }
}
</style>
