import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Auth/Register.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Auth/Login.vue')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Webflow/Webflow.vue')
    },
    {
      path: '/webflow',
      name: 'Webflow',
      component: () => import('@/views/Webflow/Webflow.vue')
    },
    {
      path: '/webflow/playground',
      name: 'WebflowPlayground',
      component: () => import('@/views/Webflow/WebflowPlayground.vue')
    },
    {
      path: '/envfile',
      name: 'EnvFile',
      component: () => import('@/views/EnvFile/EnvFile.vue')
    },
    {
      path: '/uicomponent',
      name: 'UIComponentDocs',
      component: () => import('@/views/UIComponentDocs.vue')
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/Profile.vue')
    },
    {
      path: '/json-editor-demo',
      name: 'JsonEditorDemo',
      component: () => import('@/views/JsonEditorDemo.vue')
    },
    {
      path: '/docs',
      name: 'Documentation',
      component: () => import('@/views/Documentation/DashboardDemo.vue')
    }
  ]
})

export default router