/**
 * Results module actions for handling data fetching, local storage management, and form value setting.
 * @module resultsActions
 */
export default {
  /**
   * @function fetchLocalStorageData
   * @description Fetches data from local storage and commits it to the state.
   * @param {Object} context - The Vuex context.
   * @param {string} key - The key to fetch from local storage.
   */
  fetchLocalStorageData(context, key) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      if (value === null) {
        return;
      } else {
        context.commit("changeValue", { input: key, value });
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
   * @function setNumberFormat
   * @description Sets the number format in the state.
   * @param {Object} context - The Vuex context.
   * @param {Object} payload - The payload containing the input and value.
   * @param {string} payload.input - The input field to set.
   * @param {number} payload.value - The number value to set.
   */
  setNumberFormat(context, { input, value, decimals }) {
    context.commit("changeNumberFormat", { input, value, decimals });
  },

  /**
   * @function setResultsForm
   * @description Sets the resultsForm in the state and localStorage.
   * @param {Object} context - The Vuex context.
   */
  setResultsForm(context) {
    context.commit("resetResultsForm");
  },
};
