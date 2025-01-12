import authMutations from "../auth/mutations.js";
import authActions from "../auth/actions.js";
import authGetters from "../auth/getters.js";

/**
 * User authentication module Vuex store.
 * @module authStore
 */
export default {
  namespaced: true,

  /**
   * State object representing the user authentication.
   * @function state
   * @returns {Object} The initial state object.
   */
  state() {
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
