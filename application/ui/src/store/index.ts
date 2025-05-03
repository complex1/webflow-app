import { createStore } from "vuex";
import workflowModule from "./workflowModule";
interface State {}

const store = createStore<State>({
  state: {},
  mutations: {},
  actions: {},
  getters: {},
  modules: {
    workflowModule,
  },
});

export default store;
