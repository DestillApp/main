import type { DistillationForm } from "@/types/forms/distillationForm";
import * as Sentry from "@sentry/vue";

/**
 * Destillation module actions for handling data fetching, local storage management, and form value setting.
 * @module distillationActions
 */

/**
 * Represents the state for the distillation module.
 * @interface
 * @property {DistillationForm} distillationForm - The distillation form state.
 */
interface State {
  distillationForm: DistillationForm;
}

/**
 * Vuex action context for the distillation module.
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
   * @param {{ key: string; isPlant: boolean }} param1 - The payload with key and isPlant.
   * @returns {void}
   */
  fetchLocalStorageData(
    context: Context,
    { key, isPlant }: { key: string; isPlant: boolean }
  ): void {
    try {
      const rawValue = localStorage.getItem(key);
      if (rawValue === null) {
        return;
      }
      const value = JSON.parse(rawValue);
      if (!isPlant) {
        context.commit("changeValue", { input: key, value });
      }
      if (isPlant) {
        context.commit("changeChoosedPlant", { key: key, value });
      }
    } catch (error) {
      Sentry.captureException(error);
      return;
    }
  },

  /**
   * Fetches time data from local storage and commits it to the state.
   * @param {Context} context - The Vuex context.
   * @param {string} key - The key to fetch from local storage.
   * @returns {void}
   */
  fetchTimeFromLocalStorageData(context: Context, key: string): void {
    try {
      const rawValue = localStorage.getItem(key);
      if (rawValue === null) {
        return;
      }
      const value = JSON.parse(rawValue);
      context.commit("changeDistillationTime", { key: key, value });
    } catch (error) {
      Sentry.captureException(error);
      return;
    }
  },

  /**
   * Sets a value in the state.
   * @param {Context} context - The Vuex context.
   * @param {{ input: string; value: any }} param1 - The payload with input and value.
   * @returns {void}
   */
  setValue(
    context: Context,
    { input, value }: { input: string; value: any }
  ): void {
    context.commit("changeValue", { input, value });
  },

  /**
   * Sets a value in the choosed plant state.
   * @param {Context} context - The Vuex context.
   * @param {{ key: string; value: any }} param1 - The payload containing the key and value.
   * @returns {void}
   */
  setChoosedPlant(
    context: Context,
    { key, value }: { key: string; value: any }
  ): void {
    context.commit("changeChoosedPlant", { key, value });
  },

  /**
   * Sets a value in the distillation time state.
   * @param {Context} context - The Vuex context.
   * @param {{ key: string; value: number | null }} param1 - The payload containing the key and value.
   * @returns {void}
   */
  setDistillationTime(
    context: Context,
    { key, value }: { key: string; value: number | null }
  ): void {
    context.commit("changeDistillationTime", { key, value });
  },

  /**
   * Sets an integer value in the state.
   * @param {Context} context - The Vuex context.
   * @param {{ input: string; value: number }} param1 - The payload containing the input and value.
   * @returns {void}
   */
  setIntegerValue(
    context: Context,
    { input, value }: { input: string; value: number }
  ): void {
    context.commit("changeIntegerNumber", { input, value });
  },

  /**
   * Sets the number format in the state.
   * @param {Context} context - The Vuex context.
   * @param {{ input: string; value: number }} param1 - The payload containing the input and value.
   * @returns {void}
   */
  setNumberFormat(
    context: Context,
    { input, value }: { input: string; value: number }
  ): void {
    context.commit("changeNumberFormat", { input, value });
  },

  /**
   * Sets the distillationForm in the state and localStorage.
   * @param {Context} context - The Vuex context.
   * @returns {void}
   */
  setDistillationForm(context: Context): void {
    context.commit("resetDistillationForm");
  },
};
