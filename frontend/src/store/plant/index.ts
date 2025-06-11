import { PlantForm } from "@/types/forms/plantForm";
import plantMutations from "../plant/mutations";
import plantActions from "../plant/actions";
import plantGetters from "../plant/getters";

/**
 * Plant module Vuex store.
 * @module plantStore
 */
export default {
  namespaced: true,

  /**
   * State object representing the plant form data.
   * @function state
   * @returns {{ plantForm: PlantForm }} The initial state object.
   */
  state(): { plantForm: PlantForm } {
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
  /**
   * Mutations for updating the plant state.
   */
  mutations: plantMutations,
  /**
   * Actions for performing asynchronous tasks in the plant module.
   */
  actions: plantActions,
  /**
   * Getters for accessing plant state data.
   */
  getters: plantGetters,
};
