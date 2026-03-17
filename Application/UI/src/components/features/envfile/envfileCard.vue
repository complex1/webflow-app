<template>
  <div class="envfile-card" @click="handleView">
    <!-- Row 1: Name and Menu -->
    <div class="card-header">
      <div class="card-title-section">
        <h3 class="card-title">{{ envFile.name }}</h3>
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

    <!-- Row 2: Number of Environment Variables -->
    <div class="card-configs">
      <div class="config-count">
        <i class="fas fa-key"></i>
        <span>{{ envFile.configs?.length || 0 }} environment variable{{ envFile.configs?.length === 1 ? '' : 's' }}</span>
      </div>
    </div>

    <!-- Row 3: Time -->
    <div class="card-footer">
      <div class="card-time">
        <i class="fas fa-clock"></i>
        <span>{{ formatDate(envFile.updatedAt) }}</span>
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
        <button class="menu-item" @click="handleMenuAction(handleView)">
          <i class="fas fa-eye"></i>
          <span>View Details</span>
        </button>
        <button class="menu-item" @click="handleMenuAction(handleEdit)">
          <i class="fas fa-edit"></i>
          <span>Edit</span>
        </button>
        <button class="menu-item" @click="handleMenuAction(handleDuplicate)">
          <i class="fas fa-copy"></i>
          <span>Duplicate</span>
        </button>
        <div class="menu-divider"></div>
        <button class="menu-item menu-item-danger" @click="handleMenuAction(handleDelete)">
          <i class="fas fa-trash"></i>
          <span>Delete</span>
        </button>
      </div>
    </UiFixedPopover>

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
              <span>{{ envFile.description || "No description provided" }}</span>
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
import { UiModal, UiButton, UiFixedPopover } from '@/components/base'
import { toast } from '@/utils'
import type { EnvFile } from '@/services'

interface Props {
  envFile: EnvFile;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  view: [envFile: EnvFile];
  edit: [envFile: EnvFile];
  duplicate: [envFile: EnvFile];
  delete: [envFile: EnvFile];
}>();

const showMenu = ref(false)
const showDetailModal = ref(false)
const menuTrigger = ref<HTMLElement>()

const formatDate = (dateString: string) => {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

// Handle menu action and close popover
const handleMenuAction = (action: () => void) => {
  action()
  showMenu.value = false
}

const handleView = () => {
  showDetailModal.value = true
  emit('view', props.envFile)
}

const handleEdit = () => {
  emit('edit', props.envFile)
}

const handleDuplicate = () => {
  emit('duplicate', props.envFile)
}

const handleDelete = () => {
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
</script>

<style scoped>
/* Glass Card Container */
.envfile-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-md);
  cursor: pointer;
  position: relative;
  max-width: 300px;
  min-height: 140px;
  transition: all var(--transition-spring);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}


.envfile-card:hover {
  box-shadow: var(--shadow-lg);
  border-color: var(--color-border-hover);
}

.envfile-card:active {
  transform: translateY(0);
  box-shadow: var(--shadow-md);
}

/* Row 1: Header with Name and Menu */
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
  flex: 1;
  min-width: 0;
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
  background: var(--gradient-data-green);
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
  background: var(--color-success);
  color: var(--color-text-inverse);
  border-color: var(--color-success);
}

/* Row 2: Config Count */
.card-configs {
  display: flex;
  align-items: center;
  min-height: 24px;
}

.config-count {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-success-subtle);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-full);
  color: var(--color-success);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.config-count i {
  color: var(--color-success);
  width: 12px;
  text-align: center;
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
  color: var(--color-success);
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

/* Detail Modal Styles */
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
  color: var(--color-text-primary);
  margin: 0;
  background: var(--gradient-data-green);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  background: var(--color-background-subtle);
}

.config-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.config-key {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  font-family: var(--font-family-mono);
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
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--font-size-xs);
  transition: all var(--transition-spring);
}

.copy-value-btn:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

.config-value {
  font-family: var(--font-family-mono);
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
  color: var(--color-text-tertiary);
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

/* Responsive adjustments */
@media (max-width: 640px) {
  .envfile-card {
    max-width: 100%;
    min-height: 120px;
  }
  
  .card-title {
    font-size: var(--font-size-md);
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
