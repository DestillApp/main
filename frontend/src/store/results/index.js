import resultsMutations from "./mutations";
import resultsActions from "./actions";
import resultsGetters from "./getters";

/**
 * Results module for managing the state related to distillation results.
 * @module resultsStore
 */
export default {
  namespaced: true,

  /**
   * State object representing the results form data.
   * @function state
   * @returns {Object} The initial state object.
   */
  state() {
    return {
      resultsForm: {
        oilAmount: null,
        hydrosolAmount: null,
        hydrosolpH: null,
        oilDescription: "",
        hydrosolDescription: "",
        distillationDate: "",
        distillationType: "",
        waterForDistillation: null,
        choosedPlantName: "",
        choosedPlantPart: "",
        weightForDistillation: null,
      },
    };
  },

  // Mutations for updating the state.
  mutations: resultsMutations,
  // Actions for performing asynchronous tasks.
  actions: resultsActions,
  // Getters for accessing state data.
  getters: resultsGetters,
};
