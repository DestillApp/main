import { initialResultsForm } from "@/helpers/formsInitialState";

/**
 * Results module mutations for updating the state.
 * @module resultsMutations
 */
export default {
  /**
   * @function changeValue
   * @description Mutation to change the value of a field in the results form.
   * @param {Object} state - The current state object.
   * @param {Object} payload - Payload containing the input field name and its new value.
   * @param {string} payload.input - The name of the input field to be updated.
   * @param {any} payload.value - The new value for the input field.
   */
  changeValue(state, { input, value }) {
    state.resultsForm[input] = value;
    localStorage.setItem(input, JSON.stringify(value));
  },

  /**
   * @function changeIntegerNumber
   * @description Mutation to change a value to an integer value in the results form.
   * @param {Object} state - The current state object.
   * @param {Object} payload - Payload containing the input field name and its new integer value.
   * @param {string} payload.input - The name of the input field to be updated.
   * @param {number} payload.value - The new integer value for the input field.
   */
  changeIntegerNumber(state, { input, value }) {
    const integerNumber = parseInt(value);
    state.resultsForm[input] = integerNumber;
    localStorage.setItem(input, JSON.stringify(integerNumber));
  },

  /**
   * @function changeNumberFormat
   * @description Mutation to change the format of a number value in the results form.
   * @param {Object} state - The current state object.
   * @param {Object} payload - Payload containing the input field name and its new formatted number value.
   * @param {string} payload.input - The name of the input field to be updated.
   * @param {number} payload.value - The new number value for the input field.
   */
  changeNumberFormat(state, { input, value }) {
    const formatedNumber = parseFloat(parseFloat(value).toFixed(1));
    state.resultsForm[input] = formatedNumber;
    localStorage.setItem(input, JSON.stringify(formatedNumber));
  },

  /**
   * @function resetResultsForm
   * @description Mutation to reset the resultsForm and remove resultsForm from localStorage.
   * @param {Object} state - The current state object.
   */
  resetResultsForm(state) {
    state.resultsForm = { ...initialResultsForm };
  },
};
