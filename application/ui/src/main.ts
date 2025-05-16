import { createApp } from "vue";
import "./assets/style/index.scss";
import "primeicons/primeicons.css";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import { UserService } from "./services/user.service";

const userService = new UserService();

userService
  .getUser()
  .then((user) => {
    const app = createApp(App);
    app.use(store);
    app.use(router);
    app.mount("#app");
  })
  .catch((error) => {
    console.error(error);
  });
