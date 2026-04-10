<template>
  <AppLayout>
    <div class="profile">
      <section class="profile__header">
        <div class="profile__avatar">
          <span>{{ initials }}</span>
        </div>
        <div>
          <h1>{{ user?.username || "Unknown user" }}</h1>
          <p class="muted">{{ user?.email }}</p>
        </div>
      </section>

      <section class="profile__card">
        <h3>Account</h3>
        <div class="grid">
          <div class="field">
            <label>Username</label>
            <TextInput v-model="form.username" placeholder="username" />
          </div>
          <div class="field">
            <label>Email</label>
            <TextInput v-model="form.email" placeholder="email" disabled />
          </div>
        </div>
        <div class="actions">
          <Button variant="ghost" @click="reset">Cancel</Button>
          <Button variant="primary" @click="save">Save changes</Button>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import { useUserStore } from "@/stores/user";
import { Button } from "@/components/common/buttons";
import { TextInput } from "@/components/common/forms";
import AppLayout from "@/components/layout/AppLayout.vue";

const userStore = useUserStore();
const user = computed(() => userStore.user);

const form = reactive({
  username: user.value?.username || "",
  email: user.value?.email || "",
});

const initials = computed(() => {
  const name = user.value?.username || "";
  return name.slice(0, 2).toUpperCase() || "AF";
});

const reset = () => {
  form.username = user.value?.username || "";
  form.email = user.value?.email || "";
};

const save = () => {
  // Hook up to userService.updateProfile when available
  userStore.updateUser({
    username: form.username,
    email: form.email,
  });
};
</script>

<style scoped>
.profile {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
}

.profile__header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--border-default);
  border-radius: 12px;
  background: var(--bg-secondary);
}

.profile__avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--bg-elevated);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--text-primary);
  border: 1px solid var(--border-default);
}

.profile__card {
  padding: 16px;
  border: 1px solid var(--border-default);
  border-radius: 12px;
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 12px;
  color: var(--text-secondary);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
