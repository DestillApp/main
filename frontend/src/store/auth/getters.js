/**
 * User authentication getters for getting the user authentication state.
 * @module authGetters
 */

export default {
  /**
   * @function isAuthenticated
   * @description Gets the user authentication data from the state.
   * @param {Object} state - The Vuex state.
   * @returns {Object} The user authentication data.
   */
  isAuthenticated(state) {
    return state.isAuthenticated;
  },

  /**
   * @function isLoadingAuthStatus
   * @description Gets the loading status of the user authentication.
   * @param {Object} state - The Vuex state.
   * @returns {boolean} The loading status of the user authentication.
   */
  isLoadingAuthStatus(state) {
    return state.isLoadingAuthStatus;
  },
};
