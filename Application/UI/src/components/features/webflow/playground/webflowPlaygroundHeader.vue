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
                    :disabled="!hasUnsavedChanges"
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

                <!-- Enhanced Add button with dropdown -->
                <div class="dropdown-container" ref="dropdownRef">
                    <button 
                        @click="toggleDropdown"
                        class="btn btn-add"
                        ref="addButtonRef"
                    >
                        <i class="fas fa-plus"></i>
                        <span>Add Node</span>
                        <i class="fas fa-chevron-down dropdown-chevron" :class="{ 'rotated': showDropdown }"></i>
                    </button>

                    <!-- Enhanced Dropdown menu -->
                    <Teleport to="body">
                        <div 
                            v-if="showDropdown"
                            class="dropdown-menu neo-dropdown"
                            :style="dropdownStyle"
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
                                    class="dropdown-item"
                                >
                                    <i class="fas fa-terminal node-icon node-icon-gray"></i>
                                    <span>CURL Node</span>
                                </button>

                                <!-- Conditional Node -->
                                <!-- <button 
                                    @click="addNode('CONDITIONAL')"
                                    class="dropdown-item"
                                >
                                    <i class="fas fa-code-branch node-icon node-icon-yellow"></i>
                                    <span>Conditional Node</span>
                                </button> -->

                                <!-- Loop Node -->
                                <!-- <button 
                                    @click="addNode('LOOP')"
                                    class="dropdown-item"
                                >
                                    <i class="fas fa-sync-alt node-icon node-icon-indigo"></i>
                                    <span>Loop Node</span>
                                </button> -->
                            </div>
                        </div>
                    </Teleport>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { UiWebflowBreadcrumb } from '@/components/base'
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
    webflowDetails?: WebflowDetails | null
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
const dropdownRef = ref<HTMLElement>()
const addButtonRef = ref<HTMLElement>()
const dropdownPosition = ref({ top: 0, left: 0, width: 0 })
const selectedEnvFile = ref<number | null>(null)
const isExecuting = ref(false)
const hasUnsavedChanges = ref(false)

// Computed properties
const envFiles = computed(() => webflowStore.webflowEnvLinks || [])

// Computed style for teleported dropdown
const dropdownStyle = computed(() => ({
    position: 'fixed' as const,
    top: `${dropdownPosition.value.top}px`,
    left: `${dropdownPosition.value.left}px`,
    minWidth: `${Math.max(dropdownPosition.value.width, 224)}px`, // 14rem = 224px
    zIndex: 10001
}))

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

// Add node dropdown methods
const updateDropdownPosition = () => {
    const buttonElement = addButtonRef.value || dropdownRef.value
    if (buttonElement) {
        const rect = buttonElement.getBoundingClientRect()
        const dropdownWidth = 224 // 14rem in pixels
        
        // Calculate left position to align dropdown right edge with button right edge
        let leftPosition = rect.right - dropdownWidth
        
        // Ensure dropdown doesn't go off-screen on the left
        if (leftPosition < 8) {
            leftPosition = 8
        }
        
        // Ensure dropdown doesn't go off-screen on the right
        const maxLeft = window.innerWidth - dropdownWidth - 8
        if (leftPosition > maxLeft) {
            leftPosition = maxLeft
        }
        
        dropdownPosition.value = {
            top: rect.bottom + 8, // 8px spacing below button
            left: leftPosition,
            width: rect.width
        }
    }
}

const toggleDropdown = async () => {
    showDropdown.value = !showDropdown.value
    if (showDropdown.value) {
        await nextTick()
        updateDropdownPosition()
    }
}

const addNode = (nodeType: string) => {
    emit('addNode', nodeType)
    showDropdown.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element
    const isDropdownContainer = dropdownRef.value?.contains(target)
    const isDropdownMenu = target.closest('.dropdown-menu')
    
    if (!isDropdownContainer && !isDropdownMenu) {
        showDropdown.value = false
    }
}

// Update position on scroll/resize
const handlePositionUpdate = () => {
    if (showDropdown.value) {
        updateDropdownPosition()
    }
}

onMounted(() => {
    if (envFiles.value.length > 0) {
        selectedEnvFile.value = envFiles.value[0]?.id ?? null
        emit('envFileChanged', selectedEnvFile.value)
    }
    document.addEventListener('click', handleClickOutside)
    window.addEventListener('scroll', handlePositionUpdate, true)
    window.addEventListener('resize', handlePositionUpdate)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('scroll', handlePositionUpdate, true)
    window.removeEventListener('resize', handlePositionUpdate)
})
</script>

<style scoped>
/* Neo-Systemic Playground Header */

.playground-header {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border-bottom: 1px solid var(--glass-border);
  padding: var(--spacing-lg) var(--spacing-xl);
  position: relative;
  box-shadow: var(--shadow-sm);
}

.playground-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    var(--color-primary-light) 0%, 
    var(--color-primary) 20%, 
    var(--color-primary-light) 100%);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
}

/* Enhanced Title Section */
.title-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  flex: 1;
}

.title-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

/* Flow Lab Branding */
.flow-lab-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--gradient-flow-blue);
  color: white;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  box-shadow: var(--shadow-sm);
}

.flow-brand-icon {
  font-size: var(--font-size-md);
}

.flow-brand-text {
  letter-spacing: 0.025em;
}

.title-divider {
  width: 1px;
  height: 24px;
  background: var(--color-border);
  margin: 0 var(--spacing-sm);
}

/* Playground Title */
.playground-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.title-icon {
  color: var(--color-primary);
  font-size: var(--font-size-md);
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
}

/* Enhanced Breadcrumb */
.neo-breadcrumb {
  margin-left: var(--spacing-md);
}

/* Actions Section */
.actions-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

/* Enhanced Environment Selector */
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
  transition: all var(--transition-fast);
}

.env-selector-container:hover {
  border-color: var(--color-border-hover);
  background: var(--color-background-hover);
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
}

/* Enhanced Buttons */
.btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-spring);
  position: relative;
  overflow: hidden;
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn:not(:disabled):hover {
  transform: translateY(-1px);
}

.btn:not(:disabled):active {
  transform: translateY(0);
}

/* Play Button */
.btn-play {
  background: var(--gradient-success);
  color: white;
  border-color: var(--color-success);
  box-shadow: var(--shadow-sm);
}

.btn-play:not(:disabled):hover {
  box-shadow: var(--shadow-md), 0 0 20px var(--color-success-light);
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
  color: white;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.btn-add:hover {
  box-shadow: var(--shadow-md), 0 0 20px var(--color-primary-light);
  border-color: var(--color-primary-hover);
}

.dropdown-chevron {
  font-size: var(--font-size-xs);
  transition: transform var(--transition-fast);
}

.dropdown-chevron.rotated {
  transform: rotate(180deg);
}

/* Enhanced Dropdown */
.neo-dropdown {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  padding: var(--spacing-sm);
  min-width: 280px;
  animation: dropdown-appear 0.2s var(--easing-spring);
  z-index: 10001 !important;
}

.dropdown-content {
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
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--color-border-subtle);
  margin-bottom: var(--spacing-xs);
}

.dropdown-header i {
  color: var(--color-primary);
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
  transition: all var(--transition-fast);
  text-align: left;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.dropdown-item:hover {
  background: var(--color-background-hover);
  border-color: var(--color-border-subtle);
  transform: translateY(-1px);
}

.item-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-md);
  flex-shrink: 0;
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.item-title {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.item-description {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.item-badge {
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
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

/* Animation keyframes */
@keyframes dropdown-appear {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Dark theme adjustments */
@media (prefers-color-scheme: dark) {
  .playground-header::before {
    background: linear-gradient(90deg, 
      var(--color-primary-dark) 0%, 
      var(--color-primary) 20%, 
      var(--color-primary-dark) 100%);
  }
}
</style>
