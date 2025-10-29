<template>
  <aside class="app-sidebar">
    <nav class="sidebar-nav">
      <router-link 
        to="/webflow"
        class="sidebar-nav-item" 
        :class="{ active: $route.path.includes('/webflow') }"
        v-tooltip="'Webflow Playground'"
      >
        <i class="fas fa-project-diagram"></i>
      </router-link>
      
      <router-link 
        to="/envfile"
        class="sidebar-nav-item" 
        :class="{ active: $route.path.includes('/envfile') }"
        v-tooltip="'Environment Files'"
      >
        <i class="fas fa-file-code"></i>
      </router-link>
      
      <router-link 
        to="/profile"
        class="sidebar-nav-item" 
        :class="{ active: $route.path.includes('/profile') }"
        v-tooltip="'Profile Settings'"
      >
        <i class="fas fa-user-cog"></i>
      </router-link>
      
      <router-link 
        to="/docs"
        class="sidebar-nav-item" 
        :class="{ active: $route.path.includes('/docs') }"
        v-tooltip="'Documentation'"
      >
        <i class="fas fa-book"></i>
      </router-link>
    </nav>
    
    <!-- <div class="sidebar-bottom">
      <div 
        class="sidebar-nav-item theme-toggle" 
        v-tooltip="'Toggle Theme'"
        @click="toggleTheme"
      >
        <i class="fas fa-palette"></i>
      </div>
    </div> -->
  </aside>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// const toggleTheme = () => {
//   // Theme toggle logic would go here
//   const body = document.body
//   body.classList.toggle('dark-theme')
// }
</script>

<style scoped>
.sidebar-bottom {
  margin-top: auto;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--glass-border);
}

.theme-toggle {
  opacity: 0.7;
}

.theme-toggle:hover {
  opacity: 1;
}

/* Router link active state override */
.sidebar-nav-item.router-link-active {
  background: var(--gradient-flow-blue);
  color: white;
  box-shadow: var(--shadow-md);
  transform: scale(1.05);
}
</style>
