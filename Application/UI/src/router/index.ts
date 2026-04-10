import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Auth/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/Auth/RegisterView.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/user/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/webflows',
    name: 'webflows',
    component: () => import('@/views/WebflowsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/webflow/editor',
    name: 'webflow-editor',
    component: () => import('@/views/WebflowEditor.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/scheduler',
    name: 'scheduler',
    component: () => import('@/views/SchedulerView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/environments',
    name: 'environments',
    component: () => import('@/views/EnvironmentsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/docs',
    name: 'docs',
    component: () => import('@/views/Docs/Docs.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    name: 'website',
    component: () => import('@/views/Website/Website.vue')
  },
  {
    path: '/docs-open',
    name: 'docs-open',
    component: () => import('@/views/Docs/OpenDoc.vue')
  },
  {
    path: '/example-playground',
    name: 'example-playground',
    component: () => import('@/views/ExamplePlaygroundView.vue')
  },
  {
    path: '/share/:token',
    name: 'webflow-public-share',
    component: () => import('@/views/WebflowPublicView.vue')
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, _from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  if (!requiresAuth) {
    next()
    return
  }
  const token = localStorage.getItem('auth_token')
  if (token) {
    next()
    return
  }
  next(false)
  window.location.href = `/login?redirect=${encodeURIComponent(to.fullPath)}`
})
