<template>
  <header class="app-header">
    <div class="header-brand">
      <div class="brand-icon">
        <i class="fas fa-bolt"></i>
      </div>
      <h1>API Flux</h1>
    </div>
    <div class="header-actions">
      <UiAvatar 
        size="md"
        @profile="handleProfile"
        @logout="handleLogout"
        @theme-change="handleThemeChange"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { UiAvatar } from '@/components/base'
import { useUserStore } from '@/stores/user'
import { alert } from '@/utils'
import router from '@/router'

const userStore = useUserStore()

const handleProfile = () => {
  console.log('Navigate to profile')
}

const handleLogout = () => {
  console.log('User logged out')
}

const handleThemeChange = (theme: string) => {
  console.log('Theme changed to:', theme)
  alert.success(`Switched to ${theme} mode`)
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--color-background-secondary);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(10px);
  position: relative;
}

.app-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-function-node), var(--color-database-node));
}

.header-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.brand-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-inverse);
  font-size: var(--font-size-lg);
  box-shadow: var(--shadow-glow);
}

.header-brand h1 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
  background: linear-gradient(135deg, var(--color-primary), var(--color-function-node));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}
</style>
