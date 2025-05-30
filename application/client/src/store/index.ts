import { createStore } from 'vuex';
import workflowModule from './workflowModule';
import workflowLoggerModule from './workflowLoggerModule';
interface State {
  user: {
    id: string | null;
    name: string;
    email: string;
    avatar: string;
    token: string;
  };
  isAuthenticated?: boolean;
  isLoading?: boolean;
}

const store = createStore<State>({
  state: {
    user: {
      id: null,
      name: '',
      email: '',
      avatar: '',
      token: '',
    },
    isAuthenticated: false,
    isLoading: false,
  } as State,
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    clearUser(state) {
      state.user = {
        id: null,
        name: '',
        email: '',
        avatar: '',
        token: '',
      };
    },
    setAuthentication(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated;
    },
    setLoading(state, isLoading) {
      state.isLoading = isLoading;
    }
  },
  actions: {},
  getters: {},
  modules: {
    workflowModule,
    workflowLoggerModule
  },
});

export default store;
