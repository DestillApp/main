import type { ResultsForm, ResultsDistillation, ResultsPlant } from "@/types/forms/resultsForm";

/**
 * Results module actions for handling data fetching, local storage management, and form value setting.
 * @module resultsActions
 */

interface State {
  resultsForm: ResultsForm;
}

interface Context {
  state: State;
  commit: (mutation: string, payload?: any) => void;
  dispatch: (action: string, payload?: any) => void;
}

export default {
  /**
   * @function fetchLocalStorageData
   * @description Fetches data from local storage and commits it to the state.
   * @param {Context} context - The Vuex context.
   * @param {string} key - The key to fetch from local storage.
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
      console.log("error", error);
      return;
    }
  },

  /**
   * @function fetchDistillationDataFromLocalStorage
   * @description Fetches distillationData from local storage and commits it to the state.
   * @param {Context} context - The Vuex context.
   * @param {string} key - The key to fetch from local storage.
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
      console.log("error", error);
      return;
    }
  },

  /**
   * @function fetchDistilledPlantFromLocalStorage
   * @description Fetches distilledPlant data from local storage and commits it to the state.
   * @param {Context} context - The Vuex context.
   * @param {string} key - The key to fetch from local storage.
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
      console.log("error", error);
      return;
    }
  },

  /**
   * @function fetchDistillationTimeFromLocalStorage
   * @description Fetches distillation time data from local storage and commits it to the state.
   * @param {Context} context - The Vuex context.
   * @param {string} key - The key to fetch from local storage.
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
      console.log("error", error);
      return;
    }
  },

  /**
   * @function setValue
   * @description Sets a value in the state.
   * @param {Context} context - The Vuex context.
   * @param {{ input: string; value: any }} payload - The payload containing the input and value.
   */
  setValue(context: Context, { input, value }: { input: string; value: any }): void {
    context.commit("changeValue", { input, value });
  },

  /**
   * @function setIntegerValue
   * @description Sets an integer value in the state.
   * @param {Context} context - The Vuex context.
   * @param {{ input: string; value: number; object?: string }} payload - The payload containing the input and value.
   */
  setIntegerValue(
    context: Context,
    { input, value, object }: { input: string; value: number; object?: string }
  ): void {
    context.commit("changeIntegerNumber", { input, value, object });
  },

  /**
   * @function setNumberFormat
   * @description Sets the number format in the state.
   * @param {Context} context - The Vuex context.
   * @param {{ input: string; value: number; decimals?: number }} payload - The payload containing the input and value.
   */
  setNumberFormat(
    context: Context,
    { input, value, decimals }: { input: string; value: number; decimals?: number }
  ): void {
    context.commit("changeNumberFormat", { input, value, decimals });
  },

  /**
   * @function setDistillationDataValue
   * @description Sets a value inside distillationData in the state.
   * @param {Context} context - The Vuex context.
   * @param {{ input: string; value: any }} payload - The payload containing the input and value.
   */
  setDistillationDataValue(
    context: Context,
    { input, value }: { input: string; value: any }
  ): void {
    context.commit("changeDistillationDataValue", { input, value });
  },

  /**
   * @function setPlantDataValue
   * @description Sets a value inside plantData in the state.
   * @param {Context} context - The Vuex context.
   * @param {{ input: string; value: any }} payload - The payload containing the input and value.
   */
  setPlantDataValue(
    context: Context,
    { input, value }: { input: string; value: any }
  ): void {
    context.commit("changePlantDataValue", { input, value });
  },

  /**
   * @function setDistillationTime
   * @description Sets a value inside distillationTime in the state.
   * @param {Context} context - The Vuex context.
   * @param {{ input: string; value: any }} payload - The payload containing the input and value.
   */
  setDistillationTime(
    context: Context,
    { input, value }: { input: string; value: any }
  ): void {
    context.commit("changeDistillationTimeValue", { input, value });
  },

  /**
   * @function setResultsForm
   * @description Sets the resultsForm in the state and localStorage.
   * @param {Context} context - The Vuex context.
   */
  setResultsForm(context: Context): void {
    context.commit("resetResultsForm");
  },
};
