import type { AuthState } from "./index";

/**
 * Auth module mutations for updating the state.
 * @module authMutations
 */
export default {
  changeUserAuthenticationStatus(state: AuthState, value: boolean): void {
    state.isAuthenticated = value;
  },

  changeLoadingAuthStatus(state: AuthState, value: boolean): void {
    state.isLoadingAuthStatus = value;
  },
};
