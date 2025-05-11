import { ResultsForm } from "@/types/forms/resultsForm";
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
  state(): { resultsForm: ResultsForm } {
    return {
      resultsForm: {
        oilAmount: null,
        hydrosolAmount: null,
        hydrosolpH: null,
        oilDescription: "",
        hydrosolDescription: "",
        distillationData: {
          weightForDistillation: null,
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
        distilledPlant: {
          plantName: "",
          plantPart: "",
          plantOrigin: "",
          plantBuyDate: "",
          plantProducer: "",
          countryOfOrigin: "",
          harvestDate: "",
          harvestTemperature: null,
          harvestStartTime: "10:00",
          harvestEndTime: "15:00",
          plantState: "",
          dryingTime: null,
          plantAge: null,
        },
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
