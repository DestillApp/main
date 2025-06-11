import type { PlantForm } from "@/types/forms/plantForm";
import * as Sentry from "@sentry/vue";

/**
 * Plant module actions for handling data fetching, local storage management, and form value setting.
 * @module plantActions
 */

/**
 * Represents the state for the plant module.
 * @interface
 * @property {PlantForm} plantForm - The plant form state.
 */
interface State {
  plantForm: PlantForm;
}

/**
 * Vuex action context for the plant module.
 * @interface
 * @property {State} state - The Vuex state object.
 * @property {(mutation: string, payload?: any) => void} commit - Commits a mutation.
 * @property {(action: string, payload?: any) => void} dispatch - Dispatches an action.
 */
interface Context {
  state: State;
  commit: (mutation: string, payload?: any) => void;
  dispatch: (action: string, payload?: any) => void;
}

export default {
  /**
   * Fetches data from local storage and commits it to the state.
   * @param {Context} context - The Vuex context.
   * @param {string} key - The key to fetch from local storage.
   * @returns {void}
   */
  fetchLocalStorageData(context: Context, key: string): void {
    try {
      const rawValue = localStorage.getItem(key);
      if (rawValue === null) {
        return;
      }
      const value = JSON.parse(rawValue);
      context.commit("changeValue", { input: key, value });
    } catch (error) {
      Sentry.captureException(error);
      return;
    }
  },

  /**
   * Sets a value in the state.
   * @param {Context} context - The Vuex context.
   * @param {{ input: string; value: any }} payload - The payload containing the input and value.
   * @returns {void}
   */
  setValue(
    context: Context,
    { input, value }: { input: string; value: any }
  ): void {
    context.commit("changeValue", { input, value });
  },

  /**
   * Sets an integer value in the state.
   * @param {Context} context - The Vuex context.
   * @param {{ input: string; value: number }} payload - The payload containing the input and value.
   * @returns {void}
   */
  setIntegerValue(
    context: Context,
    { input, value }: { input: string; value: number }
  ): void {
    context.commit("changeIntegerNumber", { input, value });
  },

  /**
   * Commits the start time format change.
   * @param {Context} context - The Vuex context.
   * @returns {void}
   */
  setStartTime(context: Context): void {
    context.commit("changeStartTimeFormat");
  },

  /**
   * Commits the end time format change.
   * @param {Context} context - The Vuex context.
   * @returns {void}
   */
  setEndTime(context: Context): void {
    context.commit("changeEndTimeFormat");
  },

  /**
   * Commits the harvest range change.
   * @param {Context} context - The Vuex context.
   * @returns {void}
   */
  setHarvestRange(context: Context): void {
    context.commit("changeHarvestRange");
  },

  /**
   * Sets the number format in the state.
   * @param {Context} context - The Vuex context.
   * @param {{ input: string; value: number }} payload - The payload containing the input and value.
   * @returns {void}
   */
  setNumberFormat(
    context: Context,
    { input, value }: { input: string; value: number }
  ): void {
    context.commit("changeNumberFormat", { input, value });
  },

  /**
   * Sets the plantForm in the state and localStorage.
   * @param {Context} context - The Vuex context.
   * @returns {void}
   */
  setPlantForm(context: Context): void {
    context.commit("resetPlantForm");
  },
};
