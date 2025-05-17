import { createApp } from "vue";
import "./assets/style/index.scss";
import "primeicons/primeicons.css";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import { UserService } from "./services/user.service";

const userService = new UserService();

const path = window.location.pathname;
const isLoginPage = path === "/login" || path === "/register";
const renderApp = () => {
  const app = createApp(App);
  app.use(store);
  app.use(router);
  app.mount("#app");
}

if (!isLoginPage) {
  userService
    .getUser()
    .then((user) => {
      if (!user) {
        window.location.href = "/login";
      } else {
        renderApp();
      }
    })
    .catch((error) => {
      console.error(error);
      window.location.href = "/login";
    });
} else {
  renderApp();
}
