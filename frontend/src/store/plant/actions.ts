import type { PlantForm } from "@/types/forms/plantForm";

/**
 * Plant module actions for handling data fetching, local storage management, and form value setting.
 * @module plantActions
 */

interface State {
  plantForm: PlantForm;
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
   * @function setValue
   * @description Sets a value in the state.
   * @param {Context} context - The Vuex context.
   * @param {{ input: string; value: any }} payload - The payload containing the input and value.
   */
  setValue(context: Context, { input, value }: { input: string; value: any }): void {
    context.commit("changeValue", { input, value });
  },

  // Functions used in plant origin
  /**
   * @function setIntegerValue
   * @description Sets an integer value in the state.
   * @param {Context} context - The Vuex context.
   * @param {{ input: string; value: number }} payload - The payload containing the input and value.
   */
  setIntegerValue(context: Context, { input, value }: { input: string; value: number }): void {
    context.commit("changeIntegerNumber", { input, value });
  },

  /**
   * @function setStartTime
   * @description Commits the start time format change.
   * @param {Context} context - The Vuex context.
   */
  setStartTime(context: Context): void {
    context.commit("changeStartTimeFormat");
  },

  /**
   * @function setEndTime
   * @description Commits the end time format change.
   * @param {Context} context - The Vuex context.
   */
  setEndTime(context: Context): void {
    context.commit("changeEndTimeFormat");
  },

  /**
   * @function setHarvestRange
   * @description Commits the harvest range change.
   * @param {Context} context - The Vuex context.
   */
  setHarvestRange(context: Context): void {
    context.commit("changeHarvestRange");
  },

  // Functions used in plant data
  /**
   * @function setNumberFormat
   * @description Sets the number format in the state.
   * @param {Context} context - The Vuex context.
   * @param {{ input: string; value: number }} payload - The payload containing the input and value.
   */
  setNumberFormat(context: Context, { input, value }: { input: string; value: number }): void {
    context.commit("changeNumberFormat", { input, value });
  },

  /**
   * @function setPlantForm
   * @description Sets the plantForm in the state and localStorage.
   * @param {Context} context - The Vuex context.
   */
  setPlantForm(context: Context): void {
    context.commit("resetPlantForm");
  },
};
