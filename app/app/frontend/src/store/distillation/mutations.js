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
   * Mutation to change the value of a field in the plant form choosedPlant.
   * @function changeValue
   * @param {Object} state - The current state object.
   * @param {Object} payload - Payload containing the input field name and its new value.
   * @param {string} payload.key - The name of the key in the choosedPlant object to be updated.
   * @param {any} payload.value - The new value for the key field.
   */
  changeChoosedPlant(state, { key, value }) {
    state.distillationForm.choosedPlant[key] = value;
    localStorage.setItem(key, JSON.stringify(value));
  },

  /**
   * @function changeIntegerNumber
   * @description Mutation to change a value to an integer value in the distillation form.
   * @param {Object} state - The current state object.
   * @param {Object} payload - Payload containing the input field name and its new integer value.
   * @param {string} payload.input - The name of the input field to be updated.
   * @param {number} payload.value - The new integer value for the input field.
   */
  changeIntegerNumber(state, { input, value }) {
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
