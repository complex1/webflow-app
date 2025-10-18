import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  userType: 'individual' | 'organization' | 'enterprise'
  userRole: 'admin' | 'user' | 'moderator'
}

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const loading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const currentUser = computed(() => user.value)

  // Actions
  const setUser = (userData: User | null) => {
    user.value = userData
  }

  const setToken = (newToken: string | null) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('auth_token', newToken)
    } else {
      localStorage.removeItem('auth_token')
    }
  }

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const login = (userData: User, authToken: string) => {
    setUser(userData)
    setToken(authToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  const updateUser = (userData: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
    }
  }

  return {
    // State
    user,
    token,
    loading,
    
    // Getters
    isAuthenticated,
    currentUser,
    
    // Actions
    setUser,
    setToken,
    setLoading,
    login,
    logout,
    updateUser
  }
})
