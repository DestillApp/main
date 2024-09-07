/**
 * Destillation module mutations for updating the state.
 * @module distillationMutations
 */
export default {
  /**
   * Mutation to change the value of a field in the plant form.
   * @function changeValue
   * @param {Object} state - The current state object.
   * @param {Object} payload - Payload containing the input field name and its new value.
   * @param {string} payload.input - The name of the input field to be updated.
   * @param {any} payload.value - The new value for the input field.
   */
  changeValue(state, { input, value }) {
    state.distillationForm[input] = value;
    localStorage.setItem(input, JSON.stringify(value));
  },

  /**
   * Mutation to set an integer value in the distillation form.
   * @function setIntegerNumber
   * @param {Object} state - The current state object.
   * @param {Object} payload - Payload containing the input field name and its new integer value.
   * @param {string} payload.input - The name of the input field to be updated.
   * @param {number} payload.value - The new integer value for the input field.
   */
  setIntegerNumber(state, { input, value }) {
    const integerNumber = parseInt(value);
    state.distillationForm[input] = integerNumber;
    localStorage.setItem(input, JSON.stringify(integerNumber));
  },

  /**
   * Mutation to change the format of a number value in the plant form.
   * @function changeNumberFormat
   * @param {Object} state - The current state object.
   * @param {Object} payload - Payload containing the input field name and its new formatted number value.
   * @param {string} payload.input - The name of the input field to be updated.
   * @param {number} payload.value - The new number value for the input field.
   */
  changeNumberFormat(state, { input, value }) {
    const formatedNumber = parseFloat(parseFloat(value).toFixed(1));
    state.distillationForm[input] = formatedNumber;
    localStorage.setItem(input, JSON.stringify(formatedNumber));
  },
};
