<template>
  <header class="app-header">
    <router-link to="/" class="header-brand">
      API Flux
    </router-link>
    <div class="header-actions">
      <div class="header-user">
        <UiAvatar 
          :user="userStore.user"
          size="md"
          @profile="handleProfile"
          @logout="handleLogout"
        />
      </div>
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
  router.push('/profile')
}

const handleLogout = () => {
  userStore.logout()
  router.push('/auth/login')
  alert.success('Successfully logged out')
}

</script>

<style scoped>
.env-select {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--color-text-primary);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.env-select:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: var(--color-border-hover);
}

.env-select:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.environment-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
</style>
