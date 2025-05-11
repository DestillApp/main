import { DistillationForm } from "@/types/forms/distillationForm.js";
import distillationMutations from "./mutations";
import distillationActions from "./actions.js";
import distillationGetters from "./getters.js";

/**distillationLength
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
  state(): { distillationForm: DistillationForm } {
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
        initialWeightForDistillation: null,
        isPlantSoaked: false,
        soakingTime: null,
        weightAfterSoaking: null,
        isPlantShredded: false,
        distillationType: "",
        distillationDate: "",
        distillationApparatus: "",
        waterForDistillation: null,
        distillationTime: {
          distillationHours: null,
          distillationMinutes: null,
        },
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
