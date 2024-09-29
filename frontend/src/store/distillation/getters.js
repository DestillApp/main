/**
 * Destillation module getters for getting the destillation form state.
 * @module distillationGetters
 */
export default {
  /**
   * @function distillationForm
   * @description Gets the plant form data from the state.
   * @param {Object} state - The Vuex state.
   * @returns {Object} The plant form data.
   */
  distillationForm(state) {
    return state.distillationForm;
  },

  /**
   * @function isPlantShredded
   * @description Gets the shredded status of the plant from the distillation form data.
   * @param {Object} state - The Vuex state.
   * @returns {boolean} Whether the plant is shredded.
   */
  isPlantShredded(state) {
    return state.distillationForm.isPlantShredded;
  },

  /**
   * @function isPlantSoaked
   * @description Gets the soaked status of the plant from the distillation form data.
   * @param {Object} state - The Vuex state.
   * @returns {boolean} Whether the plant is soaked.
   */
  isPlantSoaked(state) {
    return state.distillationForm.isPlantSoaked;
  },

  /**
   * @function distillationDate
   * @description Gets the distillation date from the distillation form data.
   * @param {Object} state - The Vuex state.
   * @returns {boolean} Distillation date.
   */
  distillationDate(state) {
    return state.distillationForm.distillationDate;
  },
};
