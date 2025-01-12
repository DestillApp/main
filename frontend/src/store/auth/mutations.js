/**
 * Auth module mutations for updating the state.
 * @module authMutations
 */
export default {
  changeUserAuthenticationStatus(state, value) {
    state.isAuthenticated = value;
  },

  changeLoadingAuthStatus(state, value) {
    state.isLoadingAuthStatus = value;
  }
};
