import type {
  ResultsForm,
  ResultsDistillation,
  ResultsPlant,
} from "@/types/forms/resultsForm";

/**
 * Results module getters for getting the results form state.
 * @module resultsGetters
 */

/**
 * Represents the state for the results module.
 * @interface
 * @property {ResultsForm} resultsForm - The results form state.
 */
interface State {
  resultsForm: ResultsForm;
}

export default {
  /**
   * Gets the results form data from the state.
   * @param {State} state - The Vuex state.
   * @returns {ResultsForm} The results form data.
   */
  resultsForm(state: State): ResultsForm {
    return state.resultsForm;
  },

  /**
   * Gets the distillation data from the results form data.
   * @param {State} state - The Vuex state.
   * @returns {ResultsDistillation} The distillation data.
   */
  distillationData(state: State): ResultsDistillation {
    return state.resultsForm.distillationData;
  },

  /**
   * Gets the distilled plant from the results form data.
   * @param {State} state - The Vuex state.
   * @returns {ResultsPlant} The distilled plant data.
   */
  distilledPlant(state: State): ResultsPlant {
    return state.resultsForm.distilledPlant;
  },

  /**
   * Gets the distillation date from the distillation data.
   * @param {State} state - The Vuex state.
   * @returns {string} The distillation date.
   */
  distillationDate(state: State): string {
    return state.resultsForm.distillationData.distillationDate;
  },
};
