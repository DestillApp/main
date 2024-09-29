import distillationMutations from "./mutations.js";
import distillationActions from "./actions.js";
import distillationGetters from "./getters.js";

/**
 * Plant module Vuex store.
 * @module distillationStore
 */
export default {
  namespaced: true,

  /**
   * State object representing the destillation form data.
   * @function state
   * @returns {Object} The initial state object.
   */
  state() {
    return {
      distillationForm: {
        choosedPlant: {
          id: null,
          name: "",
          part: "",
          availableWeight: null,
          harvestDate: "",
          buyDate: "",
        },
        weightForDistillation: null,
        isPlantSoaked: false,
        soakingTime: null,
        weightAfterSoaking: null,
        isPlantShredded: false,
        distillationType: "",
        distillationDate: "",
      },
    };
  },

  // Mutations for updating the state.
  mutations: distillationMutations,
  // Actions for performing asynchronous tasks.
  actions: distillationActions,
  // Getters for accessing state data.
  getters: distillationGetters,
};
