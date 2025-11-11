<template>
  <div class="docs-container docs-fade-in">
    <!-- Breadcrumb Navigation -->
    <nav class="docs-breadcrumb" v-if="breadcrumbs?.length">
      <template v-for="(item, index) in breadcrumbs" :key="index">
        <router-link 
          v-if="item.to" 
          :to="item.to" 
          class="docs-breadcrumb-item"
          :class="{ active: index === breadcrumbs.length - 1 }"
        >
          {{ item.label }}
        </router-link>
        <span 
          v-else 
          class="docs-breadcrumb-item"
          :class="{ active: index === breadcrumbs.length - 1 }"
        >
          {{ item.label }}
        </span>
        <span 
          v-if="index < breadcrumbs.length - 1" 
          class="docs-breadcrumb-separator"
        >
          /
        </span>
      </template>
    </nav>

    <!-- Documentation Grid Layout -->
    <div class="docs-grid">
      <!-- Sidebar Navigation -->
      <aside class="docs-sidebar" v-if="showSidebar">
        <slot name="sidebar">
          <DocsNavigation :navigation="navigation" />
        </slot>
      </aside>

      <!-- Main Content -->
      <main class="docs-main">
        <!-- Page Header -->
        <header v-if="title || subtitle || $slots.header">
          <slot name="header">
            <h1 v-if="title" class="docs-title">{{ title }}</h1>
            <h2 v-if="subtitle" class="docs-subtitle">{{ subtitle }}</h2>
          </slot>
        </header>

        <!-- Page Content -->
        <div class="docs-content">
          <slot></slot>
        </div>

        <!-- Page Footer -->
        <footer v-if="$slots.footer" class="docs-footer">
          <slot name="footer"></slot>
        </footer>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import DocsNavigation from './DocsNavigation.vue'

interface BreadcrumbItem {
  label: string
  to?: string
}

interface NavigationItem {
  label: string
  to?: string
  icon?: string
  children?: NavigationItem[]
}

interface NavigationSection {
  title: string
  items: NavigationItem[]
}

interface Props {
  title?: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  navigation?: NavigationSection[]
  showSidebar?: boolean
}

withDefaults(defineProps<Props>(), {
  showSidebar: true
})
</script>

<script lang="ts">
export default {
  name: 'DocsLayout'
}
</script>

<style scoped>
/* Import documentation styles */
@import url('./documentation.css');

.docs-content {
  min-height: 60vh;
  height: auto;
  overflow-y: visible;
}

.docs-footer {
  margin-top: var(--spacing-2xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border-subtle);
}

/* Ensure proper scrolling */
.docs-container {
  height: auto !important;
  overflow-y: auto !important;
}
</style>