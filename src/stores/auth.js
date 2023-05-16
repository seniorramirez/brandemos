import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    user: {}
  }),
  getters: {
    getToken(state) {
      return state.token;
    },
    getUser(state){
      return state.user;
    }
  },
  actions: {
    setToken(new_token) {
      this.token = new_token;
    },
    setUser(new_user){
      this.user = new_user;
    }
  },
});
