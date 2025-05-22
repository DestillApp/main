import authMutations from "./mutations";
import authActions from "./actions";
import authGetters from "./getters";

/**
 * State interface for the auth module.
 */
export interface AuthState {
  isAuthenticated: boolean;
  isLoadingAuthStatus: boolean;
}

/**
 * User authentication module Vuex store.
 * @module authStore
 */
export default {
  namespaced: true,

  /**
   * State object representing the user authentication.
   * @function state
   * @returns {AuthState} The initial state object.
   */
  state(): AuthState {
    return {
      isAuthenticated: false,
      isLoadingAuthStatus: true,
    };
  },

  // Mutations for updating the state.
  mutations: authMutations,
  // Actions for performing asynchronous tasks.
  actions: authActions,
  // Getters for accessing state data.
  getters: authGetters,
};
