/**
 * Destillation module actions for handling data fetching, local storage management, and form value setting.
 * @module distillationActions
 */
export default {
  /**
   * @function fetchLocalStorageData
   * @description Fetches data from local storage and commits it to the state.
   * @param {Object} context - The Vuex context.
   * @param {string} key - The key to fetch from local storage.
   */
  fetchLocalStorageData(context, { key, isPlant }) {
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
   * @param {Object} context - The Vuex context.
   * @param {string} key - The key to fetch from local storage.
   */
  fetchTimeFromLocalStorageData(context, key) {
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
   * @param {Object} context - The Vuex context.
   * @param {Object} payload - The payload containing the input and value.
   * @param {string} payload.input - The input field to set.
   * @param {any} payload.value - The value to set.
   */
  setValue(context, { input, value }) {
    context.commit("changeValue", { input, value });
  },

  /**
   * @function setChoosedPlant
   * @description Sets a value in the state.
   * @param {Object} context - The Vuex context.
   * @param {Object} payload - The payload containing the input and value.
   * @param {string} payload.key - The input field to set.
   * @param {any} payload.value - The value to set.
   */
  setChoosedPlant(context, { key, value }) {
    context.commit("changeChoosedPlant", { key, value });
  },

  /**
   * @function setDistillationTime
   * @description Sets a value in the state.
   * @param {Object} context - The Vuex context.
   * @param {Object} payload - The payload containing the input and value.
   * @param {string} payload.key - The input field to set.
   * @param {any} payload.value - The value to set.
   */
  setDistillationTime(context, { key, value }) {
    context.commit("changeDistillationTime", { key, value });
  },

  /**
   * @function setIntegerValue
   * @description Sets an integer value in the state.
   * @param {Object} context - The Vuex context.
   * @param {Object} payload - The payload containing the input and value.
   * @param {string} payload.input - The input field to set.
   * @param {number} payload.value - The integer value to set.
   */
  setIntegerValue(context, { input, value }) {
    context.commit("changeIntegerNumber", { input, value });
  },

  /**
   * @function setNumberFormat
   * @description Sets the number format in the state.
   * @param {Object} context - The Vuex context.
   * @param {Object} payload - The payload containing the input and value.
   * @param {string} payload.input - The input field to set.
   * @param {number} payload.value - The number value to set.
   */
  setNumberFormat(context, { input, value }) {
    context.commit("changeNumberFormat", { input, value });
  },
};
