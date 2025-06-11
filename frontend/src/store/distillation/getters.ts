import type { DistillationForm } from "@/types/forms/distillationForm";

/**
 * Destillation module getters for getting the destillation form state.
 * @module distillationGetters
 */

/**
 * Represents the state for the distillation module.
 * @interface
 * @property {DistillationForm} distillationForm - The distillation form state.
 */
interface State {
  distillationForm: DistillationForm;
}

export default {
  /**
   * Gets the distillation form data from the state.
   * @param {State} state - The Vuex state.
   * @returns {DistillationForm} The distillation form data.
   */
  distillationForm(state: State): DistillationForm {
    return state.distillationForm;
  },

  /**
   * Gets the shredded status of the plant from the distillation form data.
   * @param {State} state - The Vuex state.
   * @returns {boolean} Whether the plant is shredded.
   */
  isPlantShredded(state: State): boolean {
    return state.distillationForm.isPlantShredded;
  },

  /**
   * Gets the soaked status of the plant from the distillation form data.
   * @param {State} state - The Vuex state.
   * @returns {boolean} Whether the plant is soaked.
   */
  isPlantSoaked(state: State): boolean {
    return state.distillationForm.isPlantSoaked;
  },

  /**
   * Gets the distillation date from the distillation form data.
   * @param {State} state - The Vuex state.
   * @returns {string} Distillation date.
   */
  distillationDate(state: State): string {
    return state.distillationForm.distillationDate;
  },
};
