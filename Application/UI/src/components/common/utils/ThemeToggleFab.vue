<template>
  <button class="theme-fab" type="button" @click="toggleTheme" :aria-label="`Switch to ${nextTheme} mode`">
    <i class="pi" :class="theme === 'dark' ? 'pi-sun' : 'pi-moon'"></i>
    <span class="theme-fab__label">{{ theme === 'dark' ? 'Light' : 'Dark' }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.init()
})

const toggleTheme = () => {
  themeStore.toggle()
}

const theme = computed(() => themeStore.mode)
const nextTheme = computed(() => (themeStore.mode === 'dark' ? 'light' : 'dark'))
</script>

<style scoped>
.theme-fab {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: var(--z-overlay);
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 10px 12px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  background: var(--bg-elevated);
  color: var(--text-primary);
  cursor: pointer;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
  transition: border-color var(--transition-default), transform var(--transition-default);
}

.theme-fab:hover {
  border-color: var(--accent-blue);
  transform: translateY(-2px);
}

.theme-fab .pi {
  font-size: 16px;
}

.theme-fab__label {
  font-size: var(--text-sm);
}
</style>
