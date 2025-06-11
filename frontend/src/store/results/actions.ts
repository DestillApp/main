import type {
  ResultsForm,
  ResultsDistillation,
  ResultsPlant,
} from "@/types/forms/resultsForm";
import * as Sentry from "@sentry/vue";

/**
 * Results module actions for handling data fetching, local storage management, and form value setting.
 * @module resultsActions
 */

/**
 * Represents the state for the results module.
 * @interface
 * @property {ResultsForm} resultsForm - The results form state.
 */
interface State {
  resultsForm: ResultsForm;
}

/**
 * Vuex action context for the results module.
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
   * Fetches distillationData from local storage and commits it to the state.
   * @param {Context} context - The Vuex context.
   * @param {string} key - The key to fetch from local storage.
   * @returns {void}
   */
  fetchDistillationDataFromLocalStorage(context: Context, key: string): void {
    try {
      const rawValue = localStorage.getItem(key);
      if (rawValue === null) {
        return;
      }
      const value = JSON.parse(rawValue);
      context.commit("changeDistillationDataValue", { input: key, value });
    } catch (error) {
      Sentry.captureException(error);
      return;
    }
  },

  /**
   * Fetches distilledPlant data from local storage and commits it to the state.
   * @param {Context} context - The Vuex context.
   * @param {string} key - The key to fetch from local storage.
   * @returns {void}
   */
  fetchDistilledPlantFromLocalStorage(context: Context, key: string): void {
    try {
      const rawValue = localStorage.getItem(key);
      if (rawValue === null) {
        return;
      }
      const value = JSON.parse(rawValue);
      context.commit("changePlantDataValue", { input: key, value });
    } catch (error) {
      Sentry.captureException(error);
      return;
    }
  },

  /**
   * Fetches distillation time data from local storage and commits it to the state.
   * @param {Context} context - The Vuex context.
   * @param {string} key - The key to fetch from local storage.
   * @returns {void}
   */
  fetchDistillationTimeFromLocalStorage(context: Context, key: string): void {
    try {
      const rawValue = localStorage.getItem(key);
      if (rawValue === null) {
        return;
      }
      const value = JSON.parse(rawValue);
      context.commit("changeDistillationTimeValue", { input: key, value });
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
   * @param {{ input: string; value: number; object?: string }} payload - The payload containing the input and value.
   * @returns {void}
   */
  setIntegerValue(
    context: Context,
    { input, value, object }: { input: string; value: number; object?: string }
  ): void {
    context.commit("changeIntegerNumber", { input, value, object });
  },

  /**
   * Sets the number format in the state.
   * @param {Context} context - The Vuex context.
   * @param {{ input: string; value: number; decimals?: number }} payload - The payload containing the input and value.
   * @returns {void}
   */
  setNumberFormat(
    context: Context,
    {
      input,
      value,
      decimals,
    }: { input: string; value: number; decimals?: number }
  ): void {
    context.commit("changeNumberFormat", { input, value, decimals });
  },

  /**
   * Sets a value inside distillationData in the state.
   * @param {Context} context - The Vuex context.
   * @param {{ input: string; value: any }} payload - The payload containing the input and value.
   * @returns {void}
   */
  setDistillationDataValue(
    context: Context,
    { input, value }: { input: string; value: any }
  ): void {
    context.commit("changeDistillationDataValue", { input, value });
  },

  /**
   * Sets a value inside plantData in the state.
   * @param {Context} context - The Vuex context.
   * @param {{ input: string; value: any }} payload - The payload containing the input and value.
   * @returns {void}
   */
  setPlantDataValue(
    context: Context,
    { input, value }: { input: string; value: any }
  ): void {
    context.commit("changePlantDataValue", { input, value });
  },

  /**
   * Sets a value inside distillationTime in the state.
   * @param {Context} context - The Vuex context.
   * @param {{ input: string; value: any }} payload - The payload containing the input and value.
   * @returns {void}
   */
  setDistillationTime(
    context: Context,
    { input, value }: { input: string; value: any }
  ): void {
    context.commit("changeDistillationTimeValue", { input, value });
  },

  /**
   * Sets the resultsForm in the state and localStorage.
   * @param {Context} context - The Vuex context.
   * @returns {void}
   */
  setResultsForm(context: Context): void {
    context.commit("resetResultsForm");
  },
};
