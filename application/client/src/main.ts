import { createApp } from 'vue';
import './assets/style/index.scss';
import 'primeicons/primeicons.css';
import App from './App.vue';
import store from './store';
import router from './router';
import { UserService } from './services/user.service';
// Import for TypeScript types
import './types/google.d.ts';

const userService = new UserService();

const path = window.location.pathname;
const isLoginPage = path === '/login' || path === '/register';
const renderApp = () => {
  const app = createApp(App);
  app.use(store);
  app.use(router);
  app.mount('#app');
};

if (!isLoginPage) {
  store.commit('setLoading', true);
  userService
    .getUser()
    .then((user:any) => {
      if (!user) {
        window.location.href = '/login';
      } else {
        store.commit('setUser', user.user);
        store.commit('setAuthentication', true);
        store.commit('setLoading', false);
        renderApp();
      }
    })
    .catch((error) => {
      console.error(error);
      window.location.href = '/login';
    });
} else {
  renderApp();
}
