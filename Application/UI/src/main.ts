import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { createPinia } from 'pinia'
import './styles/tokens.css'
import './styles/base.css'
import 'primeicons/primeicons.css'
import { registerCommonComponents } from './plugins/registerCommonComponents'
import { userService } from './services/user'
import { useUserStore } from './stores/user'
import { tooltipDirective } from './directives/tooltip'

const renderApp = (token?: string, user?: any) => {
  const app = createApp(App)
  registerCommonComponents(app)
  const pinia = createPinia()
  app.use(pinia)

  const userStore = useUserStore()
  if (token && user) {
    userStore.setSession(user, token)
  }

  app.use(router)
  app.directive('tooltip', tooltipDirective)

  app.mount('#app')
}

const NON_AUTH_PAGES = ['/login', '/register', '/', '/docs-open', '/example-playground']

function isPublicNoAuthPath(path: string): boolean {
  if (NON_AUTH_PAGES.includes(path)) {
    return true
  }
  if (path.startsWith('/share/')) {
    return true
  }
  return false
}

const checkAuthentication = async () => {
  const currentPath = window.location.pathname

  if (isPublicNoAuthPath(currentPath)) {
    renderApp()
    return
  }

  const token = localStorage.getItem('auth_token')

  if (!token) {
    window.location.href = '/login'
    return
  }

  try {
    const response = await userService.getProfile()

    if (response.user) {
      renderApp(token, response.user)
    } else {
      throw new Error('No user data received')
    }
  } catch (error) {
    console.error('Authentication check failed:', error)

    localStorage.removeItem('auth_token')
    window.location.href = '/login'
  }
}

checkAuthentication()
