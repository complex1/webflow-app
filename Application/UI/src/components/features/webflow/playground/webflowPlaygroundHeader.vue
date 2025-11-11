<template>
    <header class="playground-header">
        <div class="header-content">
            <!-- Left side - Enhanced Title with Flow Lab branding -->
            <div class="title-section">
                <div class="title-container">
                    <div class="flow-lab-brand">
                        <i class="fas fa-project-diagram flow-brand-icon"></i>
                        <span class="flow-brand-text">Flow Lab</span>
                    </div>
                    <div class="title-divider"></div>
                    <div class="playground-title">
                        <i :class="props.webflowDetails?.icon || 'fas fa-play'" class="title-icon"></i>
                        <h1 class="title">
                            {{ props.webflowDetails?.name || 'Webflow Playground' }}
                        </h1>
                    </div>
                </div>
                <ui-webflow-breadcrumb
                    :is-last-item-active="true"
                    class="neo-breadcrumb"
                />
            </div>

            <!-- Right side - Enhanced Action buttons -->
            <div class="actions-section">
                <!-- Enhanced Environment File Selector -->
                <div class="env-selector" v-if="envFiles.length > 0">
                    <div class="env-selector-container">
                        <i class="fas fa-layer-group env-icon"></i>
                        <select 
                            v-model="selectedEnvFile"
                            @change="handleEnvFileChange"
                            class="env-select"
                        >
                            <option value="">Default Environment</option>
                            <option 
                                v-for="envFile in envFiles"
                                :key="envFile.id"
                                :value="envFile.id"
                            >
                                {{ envFile.name }}
                            </option>
                        </select>
                        <i class="fas fa-chevron-down env-chevron"></i>
                    </div>
                </div>

                <!-- Enhanced Play button -->
                <button 
                    @click="handlePlay"
                    class="btn btn-play"
                    :disabled="isExecuting"
                >
                    <i :class="isExecuting ? 'fas fa-spinner fa-spin' : 'fas fa-play'"></i>
                    <span>{{ isExecuting ? 'Running' : 'Execute' }}</span>
                </button>

                <!-- Enhanced Save button -->
                <button 
                    @click="handleSave"
                    class="btn btn-save"
                    :disabled="!props?.hasUnsavedChanges"
                >
                    <i class="fas fa-save"></i>
                    <span>Save</span>
                </button>

                <!-- Enhanced Export button -->
                <button 
                    @click="handleExport"
                    class="btn btn-export"
                >
                    <i class="fas fa-download"></i>
                    <span>Export</span>
                </button>

                <!-- Enhanced Add button with UiFixedPopover -->
                <div class="add-node-container">
                    <button 
                        ref="addButtonRef"
                        @click="showDropdown = !showDropdown"
                        class="btn btn-add"
                    >
                        <i class="fas fa-plus"></i>
                        <span>Add Node</span>
                        <i class="fas fa-chevron-down dropdown-chevron" :class="{ 'rotated': showDropdown }"></i>
                    </button>

                    <!-- UiFixedPopover for Add Node Menu -->
                    <UiFixedPopover
                        v-model:visible="showDropdown"
                        :target-element="addButtonRef"
                        placement="bottom-start"
                        class="add-node-popover"
                    >
                        <div class="dropdown-content">
                            <div class="dropdown-header">
                                <i class="fas fa-plus-circle"></i>
                                <span>Add New Node</span>
                            </div>
                            
                            <!-- API Node -->
                            <button 
                                @click="addNode('API')"
                                class="dropdown-item api-item"
                            >
                                <div class="item-icon">
                                    <i class="fas fa-globe"></i>
                                </div>
                                <div class="item-content">
                                    <span class="item-title">API Node</span>
                                    <span class="item-description">Make HTTP requests</span>
                                </div>
                                <div class="item-badge api-badge">API</div>
                            </button>

                            <!-- Open API Node (conditional) -->
                            <button 
                                v-if="props.webflowDetails?.hasOpenApiConfig"
                                @click="addNode('OPENAPI')"
                                class="dropdown-item openapi-item"
                            >
                                <div class="item-icon">
                                    <i class="fas fa-file-code"></i>
                                </div>
                                <div class="item-content">
                                    <span class="item-title">OpenAPI Node</span>
                                    <span class="item-description">From OpenAPI spec</span>
                                </div>
                                <div class="item-badge openapi-badge">SPEC</div>
                            </button>

                            <!-- Postman Node (conditional) -->
                            <button 
                                v-if="props.webflowDetails?.hasPostmanCollection"
                                @click="addNode('POSTMAN')"
                                class="dropdown-item postman-item"
                            >
                                <div class="item-icon">
                                    <i class="fas fa-rocket"></i>
                                </div>
                                <div class="item-content">
                                    <span class="item-title">Postman Node</span>
                                    <span class="item-description">From collection</span>
                                </div>
                                <div class="item-badge postman-badge">POST</div>
                            </button>

                            <!-- Functional Node -->
                            <button 
                                @click="addNode('FUNCTIONAL')"
                                class="dropdown-item functional-item"
                            >
                                <div class="item-icon">
                                    <i class="fas fa-code"></i>
                                </div>
                                <div class="item-content">
                                    <span class="item-title">Transform Node</span>
                                    <span class="item-description">Process & transform data</span>
                                </div>
                                <div class="item-badge functional-badge">FUNC</div>
                            </button>

                            <!-- CURL Node -->
                            <button 
                                @click="addNode('CURL')"
                                class="dropdown-item curl-item"
                            >
                                <div class="item-icon">
                                    <i class="fas fa-terminal"></i>
                                </div>
                                <div class="item-content">
                                    <span class="item-title">CURL Node</span>
                                    <span class="item-description">Import from cURL command</span>
                                </div>
                                <div class="item-badge curl-badge">CURL</div>
                            </button>
                        </div>
                    </UiFixedPopover>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { UiWebflowBreadcrumb, UiFixedPopover } from '@/components/base'
import { useWebflowPlaygroundStore } from '@/stores/webflowPlayground'
import type { WebFlowEnvLink } from '@/stores/webflowPlayground'

// Props
interface WebflowDetails {
    name?: string
    description?: string
    icon?: string
    hasOpenApiConfig?: boolean
    hasPostmanCollection?: boolean
}

const props = defineProps<{
    webflowDetails?: WebflowDetails | null,
    hasUnsavedChanges?: boolean
}>()

// Emits
const emit = defineEmits<{
    play: []
    save: []
    export: []
    addNode: [nodeType: string]
    envFileChanged: [envFileId: number | null]
}>()

// Store
const webflowStore = useWebflowPlaygroundStore()

// Reactive data
const showDropdown = ref(false)
const addButtonRef = ref<HTMLElement>()
const selectedEnvFile = ref<number | null>(null)
const isExecuting = ref(false)

// Computed properties
const envFiles = computed(() => webflowStore.webflowEnvLinks || [])

// Methods
const handlePlay = () => {
    emit('play')
}

const handleSave = () => {
    emit('save')
}

const handleExport = () => {
    emit('export')
}

// Environment select change handler
const handleEnvFileChange = () => {
    emit('envFileChanged', selectedEnvFile.value)
}

// Add node handler
const addNode = (nodeType: string) => {
    emit('addNode', nodeType)
    showDropdown.value = false
}

onMounted(() => {
    if (envFiles.value.length > 0) {
        selectedEnvFile.value = envFiles.value[0]?.id ?? null
        emit('envFileChanged', selectedEnvFile.value)
    }
})
</script>

<style scoped>
/* Webflow Playground Header - Neo-Systemic Design */

.playground-header {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border-bottom: 1px solid var(--glass-border);
  padding: var(--spacing-md) var(--spacing-xl);
  position: relative;
  font-family: var(--font-family-base);
}

.playground-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gradient-primary);
  opacity: 0.8;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
  max-width: 100%;
}

/* ===== Title Section ===== */
.title-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  flex: 1;
  min-width: 0;
}

.title-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  min-width: 0;
}

/* Flow Lab Branding */
.flow-lab-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--gradient-flow-blue);
  color: var(--color-text-inverse);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  box-shadow: var(--shadow-md);
  letter-spacing: var(--letter-spacing-normal);
}

.flow-brand-icon {
  font-size: var(--font-size-md);
}

.flow-brand-text {
  letter-spacing: var(--letter-spacing-wide);
  font-weight: var(--font-weight-bold);
}

.title-divider {
  width: 1px;
  height: 24px;
  background: var(--color-border);
  margin: 0 var(--spacing-md);
  opacity: 0.6;
}

/* Playground Title */
.playground-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-width: 0;
}

.title-icon {
  color: var(--color-primary);
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}

.title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: var(--letter-spacing-tight);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Enhanced Breadcrumb */
.neo-breadcrumb {
  margin-left: var(--spacing-md);
  flex-shrink: 0;
}

/* ===== Actions Section ===== */
.actions-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-shrink: 0;
}

/* Environment Selector */
.env-selector {
  position: relative;
}

.env-selector-container {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  padding: 0 var(--spacing-sm);
  min-width: 200px;
  transition: all var(--transition-spring);
  box-shadow: var(--shadow-sm);
}

.env-selector-container:hover {
  border-color: var(--color-border-hover);
  background: var(--color-background-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.env-icon {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-right: var(--spacing-xs);
}

.env-select {
  background: transparent;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  font-family: var(--font-family-base);
  color: var(--color-text-primary);
  cursor: pointer;
  flex: 1;
  appearance: none;
  outline: none;
}

.env-chevron {
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  pointer-events: none;
  margin-left: var(--spacing-xs);
  transition: all var(--transition-fast);
}

/* ===== Enhanced Buttons ===== */
.btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  font-family: var(--font-family-base);
  cursor: pointer;
  transition: all var(--transition-spring);
  position: relative;
  overflow: hidden;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm);
  letter-spacing: var(--letter-spacing-normal);
  min-height: auto;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn:not(:disabled):active {
  transform: translateY(0);
}

/* Play Button */
.btn-play {
  background: var(--gradient-success);
  color: var(--color-text-inverse);
  border-color: var(--color-success);
  box-shadow: var(--shadow-md);
}

.btn-play:not(:disabled):hover {
  box-shadow: var(--shadow-xl), 0 0 20px var(--color-success-light);
  border-color: var(--color-success-hover);
}

/* Save Button */
.btn-save {
  background: var(--glass-bg);
  color: var(--color-text-primary);
  border-color: var(--glass-border);
}

.btn-save:not(:disabled):hover {
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-save:disabled {
  color: var(--color-text-disabled);
}

/* Export Button */
.btn-export {
  background: var(--glass-bg);
  color: var(--color-text-primary);
  border-color: var(--glass-border);
}

.btn-export:hover {
  background: var(--color-info-light);
  color: var(--color-info);
  border-color: var(--color-info);
}

/* Add Button */
.btn-add {
  background: var(--gradient-primary);
  color: var(--color-text-inverse);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.btn-add:hover {
  box-shadow: var(--shadow-xl), 0 0 20px var(--color-primary-light);
  border-color: var(--color-primary-hover);
}

.dropdown-chevron {
  font-size: var(--font-size-xs);
  transition: transform var(--transition-fast);
  margin-left: var(--spacing-xs);
}

.dropdown-chevron.rotated {
  transform: rotate(180deg);
}

/* ===== UiFixedPopover Styles ===== */
.add-node-container {
  position: relative;
}

.add-node-popover {
  min-width: 300px;
}

.add-node-popover .dropdown-content {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-2xl);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  border-bottom: 1px solid var(--color-border-subtle);
  margin-bottom: var(--spacing-sm);
}

.dropdown-header i {
  color: var(--color-primary);
  font-size: var(--font-size-md);
}

/* Enhanced Dropdown Items */
.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  background: transparent;
  cursor: pointer;
  transition: all var(--transition-spring);
  text-align: left;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.dropdown-item:hover {
  background: var(--color-background-hover);
  border-color: var(--color-border-subtle);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.item-icon {
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-md);
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  flex: 1;
  min-width: 0;
}

.item-title {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  letter-spacing: var(--letter-spacing-normal);
}

.item-description {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
}

.item-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  flex-shrink: 0;
}

/* Node Type Specific Styling */
.api-item .item-icon {
  background: var(--color-api-node-light);
  color: var(--color-primary);
}

.api-badge {
  background: var(--color-api-node-light);
  color: var(--color-primary-dark);
}

.functional-item .item-icon {
  background: var(--color-functional-node-light);
  color: var(--color-warning);
}

.functional-badge {
  background: var(--color-functional-node-light);
  color: var(--color-warning-dark);
}

.openapi-item .item-icon {
  background: var(--color-success-light);
  color: var(--color-success);
}

.openapi-badge {
  background: var(--color-success-light);
  color: var(--color-success-dark);
}

.postman-item .item-icon {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.postman-badge {
  background: var(--color-warning-light);
  color: var(--color-warning-dark);
}

.curl-item .item-icon {
  background: var(--color-text-tertiary);
  color: var(--color-text-inverse);
}

.curl-badge {
  background: var(--color-text-tertiary);
  color: var(--color-text-inverse);
}

/* Responsive Design */
@media (max-width: 768px) {
  .playground-header {
    padding: var(--spacing-md) var(--spacing-lg);
  }
  
  .header-content {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: stretch;
  }
  
  .title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .title-container {
    flex-wrap: wrap;
  }
  
  .actions-section {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  
  .env-selector-container {
    min-width: 160px;
  }
  
  .neo-dropdown {
    min-width: 240px;
  }
}

@media (max-width: 480px) {
  .flow-lab-brand .flow-brand-text {
    display: none;
  }
  
  .title {
    font-size: var(--font-size-lg);
  }
  
  .btn span {
    display: none;
  }
  
  .btn {
    padding: var(--spacing-sm);
  }
}

/* ===== Responsive Design ===== */
@media (max-width: 1024px) {
  .playground-header {
    padding: var(--spacing-md) var(--spacing-lg);
  }
  
  .header-content {
    gap: var(--spacing-md);
  }
  
  .env-selector-container {
    min-width: 180px;
  }
  
  .add-node-popover {
    min-width: 280px;
  }
}

@media (max-width: 768px) {
  .playground-header {
    padding: var(--spacing-md);
  }
  
  .header-content {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: stretch;
  }
  
  .title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .title-container {
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }
  
  .title-divider {
    display: none;
  }
  
  .actions-section {
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: var(--spacing-sm);
  }
  
  .env-selector-container {
    min-width: 160px;
  }
  
  .add-node-popover {
    min-width: 260px;
  }
  
  .btn {
    padding: var(--spacing-xs) var(--spacing-sm);
  }
}

@media (max-width: 480px) {
  .flow-lab-brand .flow-brand-text {
    display: none;
  }
  
  .title {
    font-size: var(--font-size-lg);
  }
  
  .btn span {
    display: none;
  }
  
  .btn {
    padding: var(--spacing-xs);
    min-width: 2rem;
    justify-content: center;
  }
  
  .actions-section {
    justify-content: center;
  }
  
  .env-selector-container {
    min-width: 140px;
  }
  
  .add-node-popover {
    min-width: 240px;
  }
  
  .item-content {
    gap: 2px;
  }
  
  .item-description {
    display: none;
  }
}
</style>
