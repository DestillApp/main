/**
 * Auth module mutations for updating the state.
 * @module authMutations
 */
export default {
  setUserAuthenticationStatus(state, value) {
    state.isAuthenticated = value;
  },
};
