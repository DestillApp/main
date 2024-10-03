import plantMutations from "../plant/mutations.js";
import plantActions from "../plant/actions.js";
import plantGetters from "../plant/getters.js";

/**
 * Plant module Vuex store.
 * @module plantStore
 */
export default {
  namespaced: true,

  /**
   * State object representing the plant form data.
   * @function state
   * @returns {Object} The initial state object.
   */
  state() {
    return {
      plantForm: {
        plantName: "",
        plantPart: "",
        plantOrigin: "",
        plantBuyDate: "",
        plantProducer: "",
        countryOfOrigin: "",
        harvestDate: "",
        harvestTemperature: null,
        harvestRange: [600, 900],
        harvestStartTime: "10:00",
        harvestEndTime: "15:00",
        plantWeight: null,
        availableWeight: null,
        plantState: "",
        dryingTime: null,
        plantAge: null,
      },
    };
  },

  // Mutations for updating the state.
  mutations: plantMutations,
  // Actions for performing asynchronous tasks.
  actions: plantActions,
  // Getters for accessing state data.
  getters: plantGetters,
};
