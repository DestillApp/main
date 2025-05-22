import type { DistillationForm } from "@/types/forms/distillationForm";

/**
 * Destillation module getters for getting the destillation form state.
 * @module distillationGetters
 */

interface State {
  distillationForm: DistillationForm;
}

export default {
  /**
   * @function distillationForm
   * @description Gets the distillation form data from the state.
   * @param {State} state - The Vuex state.
   * @returns {DistillationForm} The distillation form data.
   */
  distillationForm(state: State): DistillationForm {
    return state.distillationForm;
  },

  /**
   * @function isPlantShredded
   * @description Gets the shredded status of the plant from the distillation form data.
   * @param {State} state - The Vuex state.
   * @returns {boolean} Whether the plant is shredded.
   */
  isPlantShredded(state: State): boolean {
    return state.distillationForm.isPlantShredded;
  },

  /**
   * @function isPlantSoaked
   * @description Gets the soaked status of the plant from the distillation form data.
   * @param {State} state - The Vuex state.
   * @returns {boolean} Whether the plant is soaked.
   */
  isPlantSoaked(state: State): boolean {
    return state.distillationForm.isPlantSoaked;
  },

  /**
   * @function distillationDate
   * @description Gets the distillation date from the distillation form data.
   * @param {State} state - The Vuex state.
   * @returns {string} Distillation date.
   */
  distillationDate(state: State): string {
    return state.distillationForm.distillationDate;
  },
};
