import type { AuthState } from "./index";

/**
 * Auth module mutations for updating the state.
 * @module authMutations
 */
export default {
  /**
   * Sets the user's authentication status.
   * @param {AuthState} state - The Vuex state object.
   * @param {boolean} value - The authentication status.
   * @returns {void}
   */
  changeUserAuthenticationStatus(state: AuthState, value: boolean): void {
    state.isAuthenticated = value;
  },

  /**
   * Sets the loading status for authentication.
   * @param {AuthState} state - The Vuex state object.
   * @param {boolean} value - The loading status.
   * @returns {void}
   */
  changeLoadingAuthStatus(state: AuthState, value: boolean): void {
    state.isLoadingAuthStatus = value;
  },
};
