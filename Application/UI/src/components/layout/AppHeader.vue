<template>
  <header class="app-header">
    <div class="app-header__left">
      <Heading :level="3">Apiflux</Heading>
    </div>
    <div class="app-header__center">
      <div id="header-option-target"></div>
    </div>
    <div class="app-header__right">
      <slot name="header-actions" />
      <Popover v-model:open="menuOpen" position="bottom-center" :show-arrow="true">
        <button class="avatar-button" type="button">
          <Avatar
            :name="userStore.user?.username || 'Apiflux User'"
            :src="userStore.user?.avatar"
            size="sm"
          />
        </button>
        <template #content>
          <div class="user-menu">
            <div class="user-menu__header">
              <Avatar
                :name="userStore.user?.username || 'Apiflux User'"
                :src="userStore.user?.avatar"
                size="md"
              />
              <div>
                <p class="user-menu__name">{{ userStore.user?.username || 'Apiflux User' }}</p>
                <p class="user-menu__email">{{ userStore.user?.email || 'no-email@apiflux.in' }}</p>
              </div>
            </div>
            <div class="user-menu__actions">
              <button class="user-menu__item" type="button" @click="goToProfile">
                Profile
              </button>
              <button class="user-menu__item user-menu__item--danger" type="button" @click="logout">
                Logout
              </button>
            </div>
          </div>
        </template>
      </Popover>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Popover from '@/components/common/overlay/Popover.vue';
import Avatar from '@/components/common/utils/Avatar.vue';

const userStore = useUserStore();
const router = useRouter();
const menuOpen = ref(false);

const goToProfile = () => {
  menuOpen.value = false;
  router.push('/profile');
};

const logout = () => {
  menuOpen.value = false;
  userStore.clearSession();
  router.push('/login');
};
</script>

<style scoped>
.app-header {
  height: 56px;
  border-bottom: 1px solid var(--border-default);
  background: var(--bg-secondary);
  display: grid;
  grid-template-columns: 200px 1fr auto;
  align-items: center;
  padding: 0 var(--space-4);
  gap: var(--space-4);
}

.app-header__right,
.app-header__left,
.app-header__center {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.app-header__center {
  justify-content: center;
}

.avatar-button {
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
}

.user-menu {
  min-width: 220px;
  padding: 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-menu__header {
  display: flex;
  gap: 12px;
  align-items: center;
}

.user-menu__name {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--text-primary);
  font-weight: 600;
}

.user-menu__email {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.user-menu__actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.user-menu__item {
  border: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
  color: var(--text-primary);
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  text-align: left;
}

.user-menu__item:hover {
  border-color: var(--accent-blue);
}

.user-menu__item--danger {
  color: var(--error-red);
  border-color: color-mix(in srgb, var(--error-red) 40%, transparent);
  background: color-mix(in srgb, var(--error-red) 12%, transparent);
}
</style>
