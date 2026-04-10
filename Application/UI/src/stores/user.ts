import type { User } from '@/services/user'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'


export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isLoggedIn = computed(() => !!user.value && !!token.value)
  const setSession = (newUser: User, newToken: string) => {
    localStorage.setItem('auth_token', newToken)
    user.value = newUser
    token.value = newToken
  }
  const clearSession = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
  }
  const updateUser = (partial: Partial<User>) => {
    if (!user.value) return
    user.value = { ...user.value, ...partial }
  }

  return {
    user,
    token,
    isLoggedIn,
    setSession,
    clearSession,
    updateUser
  }
})
