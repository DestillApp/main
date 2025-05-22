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

interface FetchLocalStorageDataPayload {
  key: string;
  isPlant?: boolean;
}

interface SetValuePayload {
  input: string;
  value: any;
}

interface SetChoosedPlantPayload {
  key: string;
  value: any;
}

interface SetDistillationTimePayload {
  key: string;
  value: any;
}

interface SetIntegerValuePayload {
  input: string;
  value: number;
}

interface SetNumberFormatPayload {
  input: string;
  value: number;
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
    { key, isPlant }: FetchLocalStorageDataPayload
  ): void {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      if (value === null) {
        return;
      } else {
        if (!isPlant) {
          context.commit("changeValue", { input: key, value });
        }
        if (isPlant) {
          context.commit("changeChoosedPlant", { key: key, value });
        }
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
      const value = JSON.parse(localStorage.getItem(key));
      if (value === null) {
        return;
      } else {
        context.commit("changeDistillationTime", { key: key, value });
      }
    } catch (error) {
      console.log("error", error);
      return;
    }
  },

  /**
   * @function setValue
   * @description Sets a value in the state.
   * @param {Context} context - The Vuex context.
   * @param {SetValuePayload} param1 - The payload containing the input and value.
   */
  setValue(context: Context, { input, value }: SetValuePayload): void {
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
    { key, value }: SetChoosedPlantPayload
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
    { key, value }: SetDistillationTimePayload
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
    { input, value }: SetIntegerValuePayload
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
    { input, value }: SetNumberFormatPayload
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
