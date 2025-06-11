import type { AuthState } from "./index";

/**
 * User authentication getters for getting the user authentication state.
 * @module authGetters
 */
export default {
  /**
   * Returns the user's authentication status.
   * @param {AuthState} state - The Vuex state object.
   * @returns {boolean} `true` if the user is authenticated, otherwise `false`.
   */
  isAuthenticated(state: AuthState): boolean {
    return state.isAuthenticated;
  },

  /**
   * Returns the loading status of the authentication process.
   * @param {AuthState} state - The Vuex state object.
   * @returns {boolean} `true` if authentication status is loading, otherwise `false`.
   */
  isLoadingAuthStatus(state: AuthState): boolean {
    return state.isLoadingAuthStatus;
  },
};
