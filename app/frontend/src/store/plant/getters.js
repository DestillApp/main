/**
 * Plant module getters for getting the plant form state.
 * @module plantGetters
 */
export default {
  /**
   * @function plantForm
   * @description Gets the plant form data from the state.
   * @param {Object} state - The Vuex state.
   * @returns {Object} The plant form data.
   */
  plantForm(state) {
    return state.plantForm;
  },

  // Functions used in plant origin
  /**
   * @function harvestRange
   * @description Gets the harvest range from the plant form data.
   * @param {Object} state - The Vuex state.
   * @returns {Array<number>} The harvest range.
   */
  harvestRange(state) {
    return state.plantForm.harvestRange;
  },

  /**
   * @function plantOrigin
   * @description Gets the plant origin from the plant form data.
   * @param {Object} state - The Vuex state.
   * @returns {string} The plant origin.
   */
  plantOrigin(state) {
    return state.plantForm.plantOrigin;
  },

  // Functions used in plant data
  /**
   * @function plantState
   * @description Gets the plant state from the plant form data.
   * @param {Object} state - The Vuex state.
   * @returns {string} The plant state.
   */
  plantState(state) {
    return state.plantForm.plantState;
  },

  /**
   * @function isPlantSoaked
   * @description Gets the soaked status of the plant from the plant form data.
   * @param {Object} state - The Vuex state.
   * @returns {boolean} Whether the plant is soaked.
   */
  isPlantSoaked(state) {
    return state.plantForm.isPlantSoaked;
  },
};
