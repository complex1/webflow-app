<template>
  <popover>
    <template #target>
      <div class="user-avatar">
        <div class="user-info">
          {{ userName }}
        </div>
        <img
          v-if="avatarUrl && !errorInAvatar"
          :src="avatarUrl"
          alt="User Avatar"
          class="avatar-image"
          @error="errorInAvatar = true"
        />
        <span v-else class="user-initials">{{ userInitials }}</span>
      </div>
    </template>
    <template #content>
      <div class="user-detail">
        <h4>Current User</h4>
        <p class="flex">
          <b>Name:</b>
          <span class="block flex-grow text-truncate ml-s">{{ userName }}</span>
        </p>
        <p class="flex">
          <b>Email:</b>
          <span class="block flex-grow text-truncate ml-s">{{ user.email }}</span>
        </p>
        <button class="btn btn-primary fw mt-m" @click="logout">
          Logout
          <i class="pi pi-sign-out mx-l"></i>
        </button>
      </div>
    </template>
  </popover>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import popover from './popover.vue';

export default defineComponent({
  components: { popover },
  setup() {
    const store = useStore();
    const errorInAvatar = ref<boolean>(false);

    const user = computed(() => {
      const user = store.state.user;
      return user;
    });

    const avatarUrl = computed(() => {
      return user.value.avatar;
    });
    const userName = computed(() => {
      return user.value.name || user.value.email || 'User';
    });
    const userInitials = computed(() => {
      if (user.value.name) {
        return user.value.name
          .split(' ')
          .map((part) => part.charAt(0).toUpperCase())
          .join('');
      }
      return user.value.email ? user.value.email.charAt(0).toUpperCase() : 'U';
    });

    const logout = () => {
      window.location.href = '/login';
    };

    return {
      user,
      avatarUrl,
      userName,
      userInitials,
      errorInAvatar,
      logout,
    };
  },
});
</script>
<style lang="scss" scoped>
.user-avatar {
  display: flex;
  align-items: center;
  gap: 10px;

  .avatar-image {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--primary-color);
    cursor: pointer;
  }
  .user-initials {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: var(--color-black);
    color: var(--color-white);
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
  }
  .user-info {
    font-size: 14px;
    color: var(--color-text-secondary);
  }
}
</style>
<style scoped>
.user-detail {
  padding: 10px;
  background-color: var(--color-white);
  border-radius: 6pt;
  box-shadow: var(--shadow-drop);
  min-width: 200px;
  max-width: 200px;
}
.user-detail h4 {
  margin: 0 0 4px;
  font-size: var(--font-size-medium);
  color: var(--color-text-primary);
}
.user-detail p {
  margin: 5px 0;
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
}
</style>
