import authMutations from "./mutations";
import authActions from "./actions";
import authGetters from "./getters";

/**
 * Represents the authentication state in Vuex.
 * @interface
 * @property {boolean} isAuthenticated - Indicates whether the user is authenticated.
 * @property {boolean} isLoadingAuthStatus - Determines if authentication status is being loaded.
 */
export interface AuthState {
  isAuthenticated: boolean;
  isLoadingAuthStatus: boolean;
}

/**
 * Vuex auth module for managing authentication state, mutations, actions, and getters.
 * @module authStore
 */
export default {
  namespaced: true,

  /**
   * Returns the initial state for the auth module.
   * @function
   * @returns {AuthState} The initial authentication state.
   */
  state(): AuthState {
    return {
      isAuthenticated: false,
      isLoadingAuthStatus: true,
    };
  },

  /** Mutations for updating the authentication state. */
  mutations: authMutations,

  /** Actions for performing asynchronous authentication tasks. */
  actions: authActions,

  /** Getters for accessing authentication state data. */
  getters: authGetters,
};
