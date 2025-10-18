<!-- Example usage of the WebFlow Environment File Manager component -->
<template>
  <div class="example-page">
    <h2>WebFlow Environment File Manager Example</h2>
    
    <!-- Example with a specific webflow ID -->
    <WebflowEnvFileManager :webFlowId="1" />
    
    <!-- You can also pass dynamic webflow ID -->
    <!-- <WebflowEnvFileManager :webFlowId="route.params.id" /> -->
  </div>
</template>

<script setup lang="ts">
import WebflowEnvFileManager from '@/components/features/webflow/webflowEnvFileManager.vue'
// import { useRoute } from 'vue-router'

// const route = useRoute()
</script>

<style scoped>
.example-page {
  padding: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
}

.example-page h2 {
  margin-bottom: var(--spacing-xl);
  color: var(--color-text-primary);
}
</style>
