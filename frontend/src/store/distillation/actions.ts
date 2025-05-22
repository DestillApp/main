import type { DistillationForm } from "@/types/forms/distillationForm";

/**
 * Destillation module actions for handling data fetching, local storage management, and form value setting.
 * @module distillationActions
 */

interface State {
  distillationForm: DistillationForm;
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
   * @param {FetchLocalStorageDataPayload} param1 - The payload with key and isPlant.
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
      console.log("error", error);
      return;
    }
  },

  /**
   * @function fetchTimeFromLocalStorageData
   * @description Fetches time data from local storage and commits it to the state.
   * @param {Context} context - The Vuex context.
   * @param {string} key - The key to fetch from local storage.
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
      console.log("error", error);
      return;
    }
  },

  /**
   * @function setValue
   * @description Sets a value in the state.
   * @param {Context} context - The Vuex context.
   */
  setValue(
    context: Context,
    { input, value }: { input: string; value: any }
  ): void {
    context.commit("changeValue", { input, value });
  },

  /**
   * @function setChoosedPlant
   * @description Sets a value in the state.
   * @param {Context} context - The Vuex context.
   * @param {SetChoosedPlantPayload} param1 - The payload containing the key and value.
   */
  setChoosedPlant(
    context: Context,
    { key, value }: { key: string; value: any }
  ): void {
    context.commit("changeChoosedPlant", { key, value });
  },

  /**
   * @function setDistillationTime
   * @description Sets a value in the state.
   * @param {Context} context - The Vuex context.
   * @param {SetDistillationTimePayload} param1 - The payload containing the key and value.
   */
  setDistillationTime(
    context: Context,
    { key, value }: { key: string; value: number | null }
  ): void {
    context.commit("changeDistillationTime", { key, value });
  },

  /**
   * @function setIntegerValue
   * @description Sets an integer value in the state.
   * @param {Context} context - The Vuex context.
   * @param {SetIntegerValuePayload} param1 - The payload containing the input and value.
   */
  setIntegerValue(
    context: Context,
    { input, value }: { input: string; value: number }
  ): void {
    context.commit("changeIntegerNumber", { input, value });
  },

  /**
   * @function setNumberFormat
   * @description Sets the number format in the state.
   * @param {Context} context - The Vuex context.
   * @param {SetNumberFormatPayload} param1 - The payload containing the input and value.
   */
  setNumberFormat(
    context: Context,
    { input, value }: { input: string; value: number }
  ): void {
    context.commit("changeNumberFormat", { input, value });
  },

  /**
   * @function setDistillationForm
   * @description Sets the distillationForm in the state and localStorage.
   * @param {Context} context - The Vuex context.
   */
  setDistillationForm(context: Context): void {
    context.commit("resetDistillationForm");
  },
};
