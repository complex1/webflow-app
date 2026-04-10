<template>
  <div class="auth">
    <Box
      class="auth__panel"
      padding="xl"
      radius="lg"
      background="secondary"
      display="flex"
      direction="column"
      gap="lg"
    >
      <Stack gap="xs">
        <Text class="auth__eyebrow" tone="muted" variant="xs" weight="medium"
          >Apiflux Flow Dark</Text
        >
        <Heading :level="2">Welcome back</Heading>
        <Text tone="secondary" variant="sm">
          Sign in with your workspace credentials to continue orchestrating
          flows.
        </Text>
      </Stack>

      <form class="auth__form" @submit.prevent="handleSubmit">
        <Stack gap="md">
          <TextInput
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="dev@company.com"
            required
          />
          <PasswordInput
            v-model="form.password"
            label="Password"
            placeholder="••••••••"
            required
          />

          <Button type="submit" :loading="loading">Sign in</Button>

          <InlineMessage v-if="error" tone="error" icon="exclamation-triangle">
            {{ error }}
          </InlineMessage>
        </Stack>
      </form>

      <Inline gap="xs" align="center" class="auth__meta">
        <Text tone="secondary" variant="sm">Need an account?</Text>
        <RouterLink to="/register">Create one instead</RouterLink>
      </Inline>
    </Box>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { authService } from "@/services/auth";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const error = ref("");

const form = reactive({
  email: "",
  password: "",
});

const handleSubmit = async () => {
  error.value = "";
  loading.value = true;
  try {
    const response = await authService.login({ ...form });
    userStore.setSession(response.user, response.token);
    const redirect = router.currentRoute.value.query.redirect as string;
    if (redirect) {
      router.push(redirect);
      return;
    }
    router.push("/webflows");
  } catch (err: any) {
    error.value = err?.response?.data?.error || "Login failed";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth {
  min-height: 100vh;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
}

.auth__panel {
  width: 100%;
  max-width: 440px;
}

.auth__form {
  width: 100%;
}

.auth__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.auth__meta {
  font-size: var(--text-sm);
}

.auth__meta a {
  color: var(--accent-blue);
  text-decoration: none;
  font-weight: 500;
}
</style>
