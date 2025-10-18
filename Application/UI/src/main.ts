import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// Import directives
import { tooltipDirective, clickOutsideDirective } from './directives'

// Import utilities
import { toast, alert } from './utils'

// Import services and store
import { userService } from './services'
import { useUserStore } from './stores/user'

const renderApp = () => {
  const app = createApp(App)

  // Use Pinia and Router
  app.use(createPinia())
  app.use(router)

  // Register directives
  app.directive('tooltip', tooltipDirective)
  app.directive('clickOutside', clickOutsideDirective)

  // Make utilities available globally
  app.config.globalProperties.$toast = toast
  app.config.globalProperties.$alert = alert

  // Also make them available on window for non-Vue usage
  if (typeof window !== 'undefined') {
    (window as any).$toast = toast;
    (window as any).$alert = alert;
  }

  app.mount('#app')
}

const NON_AUTH_PAGES = ['/login', '/register']

// Authentication check function
const checkAuthentication = async () => {
  const currentPath = window.location.pathname
  
  // If on login or register page, render app directly
  if (NON_AUTH_PAGES.includes(currentPath)) {
    renderApp()
    return
  }

  // Check for token in localStorage
  const token = localStorage.getItem('auth_token')
  
  if (!token) {
    // No token, redirect to login
    window.location.href = '/login'
    return
  }

  try {
    // Create Pinia instance to access store
    const pinia = createPinia()
    const tempApp = createApp({})
    tempApp.use(pinia)
    
    const userStore = useUserStore()
    userStore.setToken(token)
    userStore.setLoading(true)

    // Fetch user profile
    const response = await userService.getProfile()
    
    if (response.user) {
      userStore.setUser(response.user)
      userStore.setLoading(false)
      renderApp()
    } else {
      throw new Error('No user data received')
    }
    
  } catch (error) {
    console.error('Authentication check failed:', error)
    
    // Clear invalid token and redirect to login
    localStorage.removeItem('auth_token')
    window.location.href = '/login'
  }
}

// Initialize app with authentication check
checkAuthentication()