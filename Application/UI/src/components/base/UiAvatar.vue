<template>
  <div class="ui-avatar-container" ref="avatarContainer">
    <button 
      class="ui-avatar"
      :class="avatarClasses"
      @click="toggleDropdown"
      :disabled="disabled"
    >
      <img 
        v-if="user?.avatar && !imageError" 
        :src="user.avatar" 
        :alt="user.username"
        @error="handleImageError"
        class="avatar-image"
      />
      <i v-else :class="avatarIconClass" class="avatar-icon"></i>
    </button>

    <!-- Dropdown Menu -->
    <div 
      v-if="showDropdown" 
      class="ui-avatar-dropdown"
      :class="dropdownClasses"
    >
      <!-- User Info Section -->
      <div class="dropdown-user-info">
        <div class="user-avatar-large">
          <img 
            v-if="user?.avatar && !imageError" 
            :src="user.avatar" 
            :alt="user.username"
            class="avatar-image-large"
          />
          <i v-else :class="avatarIconClass" class="avatar-icon-large"></i>
        </div>
        <div class="user-details">
          <div class="user-name">{{ user?.username || 'User' }}</div>
          <div class="user-email">{{ user?.email || 'user@example.com' }}</div>
          <div class="user-role">{{ formatUserRole(user?.userRole) }}</div>
        </div>
      </div>

      <!-- Menu Items -->
      <div class="dropdown-menu">
        <button 
          class="menu-item"
          @click="navigateToProfile"
        >
          <i class="fas fa-user-edit"></i>
          <span>Profile</span>
        </button>

        <button 
          class="menu-item"
          @click="toggleTheme"
        >
          <i :class="themeIconClass"></i>
          <span>{{ themeText }}</span>
        </button>

        <div class="menu-divider"></div>

        <button 
          class="menu-item menu-item-danger"
          @click="handleLogout"
        >
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { alert } from '@/utils'
import router from '@/router'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  disabled: false
})

const emit = defineEmits<{
  profile: []
  logout: []
  themeChange: [theme: string]
}>()

const userStore = useUserStore()
const avatarContainer = ref<HTMLElement>()
const showDropdown = ref(false)
const imageError = ref(false)
const currentTheme = ref(localStorage.getItem('theme') || 'light')

const user = computed(() => userStore.currentUser)

const avatarClasses = computed(() => [
  'ui-avatar',
  `ui-avatar--${props.size}`,
  {
    'ui-avatar--disabled': props.disabled,
    'ui-avatar--has-image': user.value?.avatar && !imageError.value
  }
])

const dropdownClasses = computed(() => [
  'ui-avatar-dropdown',
  `ui-avatar-dropdown--${props.size}`
])

const avatarIconClass = computed(() => {
  if (user.value?.avatar && !imageError.value) return ''
  return 'fas fa-user'
})

const themeIconClass = computed(() => {
  return currentTheme.value === 'dark' ? 'fas fa-sun' : 'fas fa-moon'
})

const themeText = computed(() => {
  return currentTheme.value === 'dark' ? 'Light Mode' : 'Dark Mode'
})

const formatUserRole = (role?: string) => {
  if (!role) return 'User'
  return role.charAt(0).toUpperCase() + role.slice(1)
}

const toggleDropdown = () => {
  if (props.disabled) return
  showDropdown.value = !showDropdown.value
}

const handleImageError = () => {
  imageError.value = true
}

const navigateToProfile = () => {
  showDropdown.value = false
  emit('profile')
  router.push('/profile')
}

const toggleTheme = () => {
  const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
  currentTheme.value = newTheme
  localStorage.setItem('theme', newTheme)
  
  // Apply theme to document
  document.documentElement.setAttribute('data-theme', newTheme)
  
  emit('themeChange', newTheme)
  showDropdown.value = false
}

const handleLogout = async () => {
  showDropdown.value = false
  
  try {
    // Clear user data
    userStore.logout()
    
    // Show success message
    alert.success('Logged out successfully')
    
    // Navigate to login
    router.push('/login')
    
    emit('logout')
  } catch (error) {
    console.error('Logout error:', error)
    alert.error('Logout failed. Please try again.')
  }
}

const handleClickOutside = (event: Event) => {
  if (avatarContainer.value && !avatarContainer.value.contains(event.target as Node)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  // Apply saved theme
  document.documentElement.setAttribute('data-theme', currentTheme.value)
  
  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.ui-avatar-container {
  position: relative;
  display: inline-block;
}

.ui-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, var(--color-background-elevated) 0%, var(--color-background-subtle) 100%);
  color: var(--color-text-primary);
  overflow: hidden;
  backdrop-filter: var(--blur-sm);
  box-shadow: var(--shadow-md);
}

.ui-avatar:hover:not(.ui-avatar--disabled) {
  background: linear-gradient(135deg, var(--color-primary-subtle) 0%, var(--color-accent-subtle) 100%);
  border-color: var(--color-primary);
  /* transform: scale(1.1); */
  box-shadow: var(--shadow-lg);
}

.ui-avatar:focus {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-primary-subtle);
}

.ui-avatar--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Avatar sizes */
.ui-avatar--sm {
  width: 32px;
  height: 32px;
  font-size: var(--font-size-sm);
}

.ui-avatar--md {
  width: 40px;
  height: 40px;
  font-size: var(--font-size-base);
}

.ui-avatar--lg {
  width: 48px;
  height: 48px;
  font-size: var(--font-size-lg);
}

.ui-avatar--xl {
  width: 56px;
  height: 56px;
  font-size: var(--font-size-xl);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-full);
}

.avatar-icon {
  font-size: inherit;
}

/* Dropdown */
.ui-avatar-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--spacing-sm);
  background: var(--color-background);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border);
  overflow: hidden;
  z-index: var(--z-dropdown);
  min-width: 280px;
  animation: dropdownFadeIn var(--transition-fast) ease;
}

.ui-avatar-dropdown--sm {
  min-width: 240px;
}

.ui-avatar-dropdown--lg {
  min-width: 320px;
}

.ui-avatar-dropdown--xl {
  min-width: 360px;
}

/* User Info Section */
.dropdown-user-info {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--color-background-secondary);
  border-bottom: 1px solid var(--color-border);
  gap: var(--spacing-md);
}

.user-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  overflow: hidden;
  background: var(--color-gray-200);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-image-large {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-icon-large {
  font-size: var(--font-size-xl);
  color: var(--color-text-secondary);
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: var(--font-size-xs);
  color: var(--color-gray-400);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Menu Items */
.dropdown-menu {
  padding: var(--spacing-sm) 0;
}

.menu-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--spacing-md);
  border: none;
  background: none;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: background-color var(--transition-fast);
  gap: var(--spacing-md);
}

.menu-item:hover {
  background: var(--color-gray-100);
}

.menu-item i {
  width: 16px;
  text-align: center;
  color: var(--color-text-secondary);
}

.menu-item-danger {
  color: var(--color-error);
}

.menu-item-danger:hover {
  background: var(--color-error-light);
}

.menu-item-danger i {
  color: var(--color-error);
}

.menu-divider {
  height: 1px;
  background: var(--color-border);
  margin: var(--spacing-sm) 0;
}

/* Animations */
@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark theme support */
[data-theme="dark"] .ui-avatar-dropdown {
  background: var(--color-gray-800);
  border-color: var(--color-gray-700);
}

[data-theme="dark"] .dropdown-user-info {
  background: var(--color-gray-900);
  border-color: var(--color-gray-700);
}

[data-theme="dark"] .user-name {
  color: var(--color-text-inverse);
}

[data-theme="dark"] .user-email {
  color: var(--color-gray-400);
}

[data-theme="dark"] .user-role {
  color: var(--color-gray-500);
}

[data-theme="dark"] .menu-item {
  color: var(--color-gray-300);
}

[data-theme="dark"] .menu-item:hover {
  background: var(--color-gray-700);
}

[data-theme="dark"] .menu-item i {
  color: var(--color-gray-400);
}

[data-theme="dark"] .menu-divider {
  background: var(--color-gray-700);
}
</style>
