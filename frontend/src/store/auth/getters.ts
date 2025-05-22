import type { AuthState } from "./index";

/**
 * User authentication getters for getting the user authentication state.
 * @module authGetters
 */
export default {
  /**
   * @function isAuthenticated
   * @description Gets the user authentication data from the state.
   * @param {AuthState} state - The Vuex state.
   * @returns {boolean} The user authentication data.
   */
  isAuthenticated(state: AuthState): boolean {
    return state.isAuthenticated;
  },

  /**
   * @function isLoadingAuthStatus
   * @description Gets the loading status of the user authentication.
   * @param {AuthState} state - The Vuex state.
   * @returns {boolean} The loading status of the user authentication.
   */
  isLoadingAuthStatus(state: AuthState): boolean {
    return state.isLoadingAuthStatus;
  },
};
