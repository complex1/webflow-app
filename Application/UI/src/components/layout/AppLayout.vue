<template>
  <div class="app-layout">
    <AppHeader />
    <div class="app-main">
      <AppSidebar v-if="showSidebar" />
      <main class="app-content">
        <slot></slot>
      </main>
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import AppFooter from './AppFooter.vue'

const props = defineProps({
  // Define any props if needed
  showSidebar: {
    type: Boolean,
    default: true
  }
})
</script>
