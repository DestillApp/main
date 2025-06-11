import type { PlantForm } from "@/types/forms/plantForm";

/**
 * Plant module getters for getting the plant form state.
 * @module plantGetters
 */

/**
 * Represents the state for the plant module.
 * @interface
 * @property {PlantForm} plantForm - The plant form state.
 */
interface State {
  plantForm: PlantForm;
}

export default {
  /**
   * Gets the plant form data from the state.
   * @param {State} state - The Vuex state.
   * @returns {PlantForm} The plant form data.
   */
  plantForm(state: State): PlantForm {
    return state.plantForm;
  },

  /**
   * Gets the harvest range from the plant form data.
   * @param {State} state - The Vuex state.
   * @returns {Array<number>} The harvest range.
   */
  harvestRange(state: State): [number, number] {
    return state.plantForm.harvestRange;
  },

  /**
   * Gets the plant origin from the plant form data.
   * @param {State} state - The Vuex state.
   * @returns {string} The plant origin.
   */
  plantOrigin(state: State): string {
    return state.plantForm.plantOrigin;
  },

  /**
   * Gets the plant state from the plant form data.
   * @param {State} state - The Vuex state.
   * @returns {string} The plant state.
   */
  plantState(state: State): string {
    return state.plantForm.plantState;
  },
};
