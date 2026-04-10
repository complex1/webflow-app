<template>
  <div class="app-layout">
    <AppHeader>
      <template #header-actions>
        <slot name="header-actions"></slot>
      </template>
    </AppHeader>
    <div class="app-layout__body">
      <AppSidebar v-if="showSidebar" :collapsed="collapsed" @toggle="toggleSidebar">
      </AppSidebar>
      <main class="app-layout__content">
        <slot ></slot>
      </main>
    </div>
    <AppFooter>
      <slot name="footer"></slot>
    </AppFooter>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import AppFooter from './AppFooter.vue'

const props = withDefaults(
  defineProps<{
    // Define any props if needed
    showSidebar?: boolean
  }>(),
  {
    showSidebar: true
  }
)

const collapsed = ref(false)
const toggleSidebar = () => {
  collapsed.value = !collapsed.value
  localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed.value))
}
onMounted(() => {
  const storedState = localStorage.getItem('sidebar-collapsed')
  if (storedState !== null) {
    collapsed.value = JSON.parse(storedState)
  }
})
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
}

.app-layout__body {
  flex: 1;
  display: flex;
  min-height: 0;
}

.app-layout__content {
  flex: 1;
  padding: var(--space-4);
  overflow: auto;
  height: calc(100vh - 64px - 48px); /* Adjust based on header and footer height */
}
</style>
