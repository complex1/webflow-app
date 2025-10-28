<template>
    <header class="playground-header">
        <div class="header-content">
            <!-- Left side - Title -->
            <div class="title-section">
                <div class="title-container">
                    <i :class="props.webflowDetails?.icon || 'fas fa-play'" class="title-icon"></i>
                    <h1 class="title">
                        {{ props.webflowDetails?.name || 'Webflow Playground' }}
                    </h1>
                </div>
                <ui-webflow-breadcrumb
                    :is-last-item-active="true"
                />
            </div>

            <!-- Right side - Action buttons -->
            <div class="actions-section">
                <!-- Environment File Selector -->
                <div class="env-selector" v-if="envFiles.length > 0">
                    <select 
                        v-model="selectedEnvFile"
                        @change="handleEnvFileChange"
                        class="env-select"
                    >
                        <option >Default Environment</option>
                        <option 
                            v-for="envFile in envFiles"
                            :key="envFile.id"
                            :value="envFile.id"
                        >
                            {{ envFile.name }}
                        </option>
                    </select>
                </div>

                <!-- Play button -->
                <button 
                    @click="handlePlay"
                    class="btn btn-play"
                >
                    <i class="fas fa-play"></i>
                    <span>Play</span>
                </button>

                <!-- Add button with dropdown -->
                <div class="dropdown-container" ref="dropdownRef">
                    <button 
                        @click="toggleDropdown"
                        class="btn btn-add"
                        ref="addButtonRef"
                    >
                        <i class="fas fa-plus"></i>
                        <span>Add</span>
                        <i class="fas fa-chevron-down dropdown-chevron"></i>
                    </button>

                    <!-- Dropdown menu -->
                    <Teleport to="body">
                        <div 
                            v-if="showDropdown"
                            class="dropdown-menu"
                            :style="dropdownStyle"
                        >
                            <div class="dropdown-content">
                                <!-- API Node -->
                                <button 
                                    @click="addNode('API')"
                                    class="dropdown-item"
                                >
                                    <i class="fas fa-globe node-icon node-icon-blue"></i>
                                    <span>API Node</span>
                                </button>

                                <!-- Open API Node (conditional) -->
                                <button 
                                    v-if="props.webflowDetails?.hasOpenApiConfig"
                                    @click="addNode('OPENAPI')"
                                    class="dropdown-item"
                                >
                                    <i class="fas fa-file-code node-icon node-icon-green"></i>
                                    <span>Open API Node</span>
                                </button>

                                <!-- Postman Node (conditional) -->
                                <button 
                                    v-if="props.webflowDetails?.hasPostmanCollection"
                                    @click="addNode('POSTMAN')"
                                    class="dropdown-item"
                                >
                                    <i class="fas fa-rocket node-icon node-icon-orange"></i>
                                    <span>Postman Node</span>
                                </button>

                                <!-- Functional Node -->
                                <button 
                                    @click="addNode('FUNCTIONAL')"
                                    class="dropdown-item"
                                >
                                    <i class="fas fa-code node-icon node-icon-purple"></i>
                                    <span>Functional Node</span>
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
/* Playground Header Styles using Design System */

.playground-header {
  background: var(--color-background-secondary);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-lg) var(--spacing-xl);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(10px);
  position: relative;
}

.playground-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-function-node), var(--color-database-node), var(--color-logic-node));
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Title Section */
.title-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.title-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.title-icon {
  color: var(--color-primary);
  font-size: var(--font-size-lg);
}

.title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* Actions Section */
.actions-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

/* Environment Selector */
.env-selector {
  position: relative;
}

.env-select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background-color: var(--color-background-elevated);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
  min-width: 180px;
}

.env-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
  background-color: var(--color-background-secondary);
}

.env-select:hover {
  border-color: var(--color-border-hover);
  background-color: var(--color-background-hover);
}

.env-select option {
  background-color: var(--color-background-elevated);
  color: var(--color-text-primary);
  padding: var(--spacing-sm);
}

/* Button Styles */
.btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
}

.btn:focus {
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.btn-play {
  background-color: var(--color-success);
  color: var(--color-text-inverse);
}

.btn-play:hover {
  background-color: var(--color-success);
  filter: brightness(0.9);
  /* transform: translateY(-1px); */
  box-shadow: var(--shadow-md);
}

.btn-add {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.btn-add:hover {
  background-color: var(--color-primary-hover);
  /* transform: translateY(-1px); */
  box-shadow: var(--shadow-md);
}

.dropdown-chevron {
  font-size: var(--font-size-xs);
  margin-left: var(--spacing-xs);
  transition: transform var(--transition-fast);
}

.btn-add:hover .dropdown-chevron {
  transform: rotate(180deg);
}

/* Dropdown Styles */
.dropdown-container {
  position: relative;
  z-index: var(--z-dropdown);
}

/* Teleported dropdown menu styles */
.dropdown-menu {
  background-color: var(--color-background-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  backdrop-filter: var(--blur-md);
  opacity: 1;
  transform: translateY(0);
  /* transition: all var(--transition-fast); */
  /* Force above VueFlow elements */
  z-index: 10001 !important;
  /* Prevent any transform issues */
  transform-style: preserve-3d;
  /* Ensure backdrop doesn't interfere */
  isolation: isolate;
}

.dropdown-content {
  padding: var(--spacing-sm);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  background: none;
  text-align: left;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.dropdown-item:hover {
  background-color: var(--color-background-hover);
  /* transform: translateX(2px); */
}

.dropdown-item:focus {
  outline: none;
  background-color: var(--color-primary-subtle);
  border-left: 3px solid var(--color-primary);
}

/* Node Icon Colors - Updated for better contrast */
.node-icon {
  width: 1rem;
  text-align: center;
}

.node-icon-blue {
  color: var(--color-primary);
}

.node-icon-green {
  color: var(--color-success);
}

.node-icon-orange {
  color: var(--color-warning);
}

.node-icon-purple {
  color: var(--color-accent);
}

.node-icon-gray {
  color: var(--color-text-secondary);
}

.node-icon-yellow {
  color: var(--color-warning-bright);
}

.node-icon-indigo {
  color: var(--color-primary-bright);
}

/* Animation for dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all var(--transition-fast);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}

/* Responsive Design */
@media (max-width: 768px) {
  .playground-header {
    padding: var(--spacing-md) var(--spacing-lg);
  }
  
  .header-content {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;
  }
  
  .title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .actions-section {
    align-self: flex-end;
    flex-wrap: wrap;
  }
  
  .env-select {
    min-width: 150px;
    font-size: var(--font-size-xs);
  }
  
  .dropdown-menu {
    right: auto;
    left: 0;
    /* Ensure mobile dropdown is also above VueFlow */
    z-index: 10001 !important;
  }
}

@media (max-width: 480px) {
  .btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-xs);
  }
  
  .env-select {
    min-width: 120px;
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-xs);
  }
  
  .dropdown-menu {
    width: 12rem;
  }
}
</style>
