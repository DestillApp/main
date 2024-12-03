/**
 * Results module getters for getting the results form state.
 * @module resultsGetters
 */
export default {
  /**
   * @function resultsForm
   * @description Gets the results form data from the state.
   * @param {Object} state - The Vuex state.
   * @returns {Object} The results form data.
   */
  resultsForm(state) {
    return state.resultsForm;
  },

  /**
   * @function distillationData
   * @description Gets the distillation data from the results form data.
   * @param {Object} state - The Vuex state.
   * @returns {Object} The distillation data.
   */
  distillationData(state) {
    return state.resultsForm.distillationData;
  },

  /**
   * @function distilledPlant
   * @description Gets the distilled plant from the results form data.
   * @param {Object} state - The Vuex state.
   * @returns {Object} The distillation data.
   */
  distilledPlant(state) {
    return state.resultsForm.distilledPlant;
  },

  /**
   * @function distillationDate
   * @description Gets the distilled plant from the results form data.
   * @param {Object} state - The Vuex state.
   * @returns {Object} The distillation data.
   */
  distillationDate(state) {
    return state.resultsForm.distillationData.distillationDate;
  },
};
