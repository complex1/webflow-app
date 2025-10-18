<!-- Demo component to test dropdown z-index fix in WebflowPlayground -->
<template>
    <div class="dropdown-test-demo">
        <h2>Dropdown Z-Index Test</h2>
        <p>This component demonstrates the dropdown z-index fix for VueFlow.</p>
        
        <!-- Test the webflow playground header component -->
        <div class="test-section">
            <h3>Webflow Playground Header with VueFlow Background</h3>
            <div class="vueflow-simulator">
                <div class="mock-vueflow-canvas">
                    <p>Mock VueFlow Canvas (z-index: 1)</p>
                </div>
                
                <!-- Include the actual playground header -->
                <webflow-playground-header 
                    :webflow-details="{
                        name: 'Test Webflow',
                        description: 'Testing dropdown z-index',
                        hasOpenApiConfig: true,
                        hasPostmanCollection: true
                    }"
                    @play="handlePlay"
                    @add-node="handleAddNode"
                />
            </div>
        </div>
        
        <div class="test-results">
            <h3>Test Results</h3>
            <div v-if="testResults.length > 0">
                <ul>
                    <li v-for="result in testResults" :key="result">{{ result }}</li>
                </ul>
            </div>
            <div v-else>
                <p>Click the "Add" button in the header above to test the dropdown.</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WebflowPlaygroundHeader from '@/components/features/webflow/playground/webflowPlaygroundHeader.vue'

const testResults = ref<string[]>([])

const handlePlay = () => {
    testResults.value.push(`Play button clicked at ${new Date().toLocaleTimeString()}`)
}

const handleAddNode = (nodeType: string) => {
    testResults.value.push(`Node added: ${nodeType} at ${new Date().toLocaleTimeString()}`)
}
</script>

<style scoped>
.dropdown-test-demo {
    padding: var(--spacing-xl);
    max-width: 1200px;
    margin: 0 auto;
}

.test-section {
    margin: var(--spacing-xl) 0;
    border: 2px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    background: var(--color-background-secondary);
}

.vueflow-simulator {
    position: relative;
    min-height: 400px;
    background: var(--color-background-primary);
    border-radius: var(--radius-md);
    overflow: hidden;
}

.mock-vueflow-canvas {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
        var(--color-background-tertiary) 25%, 
        transparent 25%), 
        linear-gradient(-45deg, 
        var(--color-background-tertiary) 25%, 
        transparent 25%),
        linear-gradient(45deg, 
        transparent 75%, 
        var(--color-background-tertiary) 75%), 
        linear-gradient(-45deg, 
        transparent 75%, 
        var(--color-background-tertiary) 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    border: 1px solid var(--color-border);
}

.mock-vueflow-canvas p {
    background: var(--color-background-elevated);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    color: var(--color-text-primary);
    font-weight: var(--font-weight-medium);
}

.test-results {
    margin-top: var(--spacing-xl);
    padding: var(--spacing-lg);
    background: var(--color-background-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
}

.test-results ul {
    list-style: none;
    padding: 0;
}

.test-results li {
    padding: var(--spacing-sm) 0;
    border-bottom: 1px solid var(--color-border);
    color: var(--color-success);
    font-family: var(--font-family-mono);
    font-size: var(--font-size-sm);
}

.test-results li:last-child {
    border-bottom: none;
}

h2, h3 {
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-md);
}

h2 {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
}

h3 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
}

p {
    color: var(--color-text-secondary);
    line-height: var(--line-height-relaxed);
}
</style>
