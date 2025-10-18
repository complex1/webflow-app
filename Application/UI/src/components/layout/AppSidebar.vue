<template>
  <aside class="app-sidebar">
    <nav class="sidebar-nav">
      <div 
        class="sidebar-nav-item" 
        :class="{ active: $route.path.includes('/dashboard') }"
        v-tooltip="'Web Flow'"
        @click="navigateTo('/dashboard')"
      >
        <i class="fas fa-sitemap"></i>
      </div>
      <div 
        class="sidebar-nav-item" 
        :class="{ active: $route.path.includes('/envfile') }"
        v-tooltip="'EnvFile'"
        @click="navigateTo('/envfile')"
      >
        <i class="fas fa-file-code"></i>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}
</script>
