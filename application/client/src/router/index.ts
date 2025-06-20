import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

// Import your pages
import Playground from '../pages/playground.vue';
import PlaygroundExample from '../pages/examplePage/playgroundExample.vue';
import Register from '../pages/register.vue';
import Login from '../pages/login.vue';
import Dashboard from '../pages/dashboard.vue';
import ProxyTest from '../pages/proxy-test.vue';

// Define your routes
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Dashboard
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/playground',
    name: 'Playground',
    component: Playground
  },
  {
    path: '/playground-example',
    name: 'PlaygroundExample',
    component: PlaygroundExample
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/proxy-test',
    name: 'ProxyTest',
    component: ProxyTest
  },
  // Add more routes as needed
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    // You can create a NotFound page or redirect to home
    redirect: { name: 'Home' }
  }
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;