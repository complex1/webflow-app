<template>
  <div class="auth">
    <Box class="auth__panel" padding="xl" radius="lg" background="secondary" display="flex" direction="column" gap="lg">
      <Stack gap="xs">
        <Text class="auth__eyebrow" tone="muted" variant="xs" weight="medium">Apiflux Flow Dark</Text>
        <Heading :level="2">Create your account</Heading>
        <Text tone="secondary" variant="sm">
          Purpose-built for backend and workflow engineers. No marketing fluff—just workspace access.
        </Text>
      </Stack>

      <form class="auth__form" @submit.prevent="handleSubmit">
        <Stack gap="md">
          <TextInput
            v-model="form.username"
            label="Username"
            placeholder="workspace engineer"
            required
          />
          <TextInput
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="dev@company.com"
            required
          />
          <Stack gap="xs">
            <PasswordInput v-model="form.password" label="Password" placeholder="••••••••" required />
            <Text variant="xs" tone="muted">Use at least 12 characters with numbers & symbols.</Text>
          </Stack>

          <Button type="submit" :loading="loading">Create account</Button>

          <InlineMessage v-if="error" tone="error" icon="exclamation-triangle">
            {{ error }}
          </InlineMessage>
        </Stack>
      </form>

      <Inline gap="xs" align="center" class="auth__meta">
        <Text tone="secondary" variant="sm">Already have an account?</Text>
        <RouterLink to="/login">Sign in instead</RouterLink>
      </Inline>
    </Box>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { authService } from '@/services/auth'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const error = ref('')

const form = reactive({
  username: '',
  email: '',
  password: ''
})

const handleSubmit = async () => {
  error.value = ''
  loading.value = true
  try {
    const response = await authService.register(form)
    userStore.setSession(response.user, response.token)
    router.push('/')
  } catch (err: any) {
    error.value = err?.response?.data?.error || 'Registration failed'
  } finally {
    loading.value = false
  }
}
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
  max-width: 480px;
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
