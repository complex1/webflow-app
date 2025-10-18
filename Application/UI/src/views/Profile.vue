<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="profile-header">
        <h1>User Profile</h1>
        <p>Manage your account settings and preferences</p>
      </div>
      
      <div class="profile-content">
        <UiCard class="profile-card">
          <div class="profile-info">
            <div class="profile-avatar-section">
              <UiAvatar size="xl" />
              <button class="change-avatar-btn">
                <i class="fas fa-camera"></i>
                Change Avatar
              </button>
            </div>
            
            <div class="profile-details">
              <div class="detail-group">
                <label>Username</label>
                <div class="detail-value">{{ user?.username || 'N/A' }}</div>
              </div>
              
              <div class="detail-group">
                <label>Email</label>
                <div class="detail-value">{{ user?.email || 'N/A' }}</div>
              </div>
              
              <div class="detail-group">
                <label>User Type</label>
                <div class="detail-value">{{ formatUserType(user?.userType) }}</div>
              </div>
              
              <div class="detail-group">
                <label>Role</label>
                <div class="detail-value">{{ formatUserRole(user?.userRole) }}</div>
              </div>
            </div>
          </div>
        </UiCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { UiCard, UiAvatar } from '@/components/base'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const user = computed(() => userStore.currentUser)

const formatUserType = (type?: string) => {
  if (!type) return 'Individual'
  return type.charAt(0).toUpperCase() + type.slice(1)
}

const formatUserRole = (role?: string) => {
  if (!role) return 'User'
  return role.charAt(0).toUpperCase() + role.slice(1)
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--color-background-secondary);
  padding: var(--spacing-xl);
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  margin-bottom: var(--spacing-xl);
}

.profile-header h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-dark);
  margin: 0 0 var(--spacing-sm) 0;
}

.profile-header p {
  color: var(--color-text-secondary);
  margin: 0;
}

.profile-card {
  padding: var(--spacing-xl);
}

.profile-info {
  display: flex;
  gap: var(--spacing-xl);
  align-items: flex-start;
}

.profile-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.change-avatar-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-gray-100);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.change-avatar-btn:hover {
  background: var(--color-gray-200);
}

.profile-details {
  flex: 1;
  display: grid;
  gap: var(--spacing-lg);
}

.detail-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.detail-group label {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.detail-value {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  padding: var(--spacing-md);
  background: var(--color-background-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

/* Dark theme support */
[data-theme="dark"] .profile-page {
  background: var(--color-gray-900);
}

[data-theme="dark"] .profile-header h1 {
  color: var(--color-text-inverse);
}

[data-theme="dark"] .profile-header p {
  color: var(--color-gray-400);
}

[data-theme="dark"] .change-avatar-btn {
  background: var(--color-gray-700);
  border-color: var(--color-gray-600);
  color: var(--color-gray-300);
}

[data-theme="dark"] .change-avatar-btn:hover {
  background: var(--color-gray-600);
}

[data-theme="dark"] .detail-group label {
  color: var(--color-gray-300);
}

[data-theme="dark"] .detail-value {
  background: var(--color-gray-800);
  border-color: var(--color-gray-700);
  color: var(--color-gray-400);
}

@media (max-width: 768px) {
  .profile-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .profile-details {
    width: 100%;
  }
}
</style>
