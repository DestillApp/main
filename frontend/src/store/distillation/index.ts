import { DistillationForm } from "@/types/forms/distillationForm";
import distillationMutations from "./mutations";
import distillationActions from "./actions";
import distillationGetters from "./getters";

/**
 * Distillation module Vuex store.
 * @module distillationStore
 */
export default {
  namespaced: true,

  /**
   * State object representing the distillation form data.
   * @function
   * @returns {{ distillationForm: DistillationForm }} The initial state object.
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

  /**
   * Mutations for updating the distillation state.
   */
  mutations: distillationMutations,

  /**
   * Actions for performing asynchronous tasks in the distillation module.
   */
  actions: distillationActions,

  /**
   * Getters for accessing distillation state data.
   */
  getters: distillationGetters,
};
