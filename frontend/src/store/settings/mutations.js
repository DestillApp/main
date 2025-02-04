/**
 * Settings module mutations for updating the state.
 * @module settingsMutations
 */
export default {
  /**
   * @function changeValue
   * @description Mutation to change the value of a field in the settings form.
   * @param {Object} state - The current state object.
   * @param {Object} payload - Payload containing the input field name and its new value.
   * @param {string} payload.input - The name of the input field to be updated.
   * @param {any} payload.value - The new value for the input field.
   */
  changeValue(state, { input, value }) {
    state.settingsForm[input] = value;
    localStorage.setItem(input, JSON.stringify(value));
  },

  /**
   * @function removeDistillerById
   * @description Mutation to remove a distiller from the distillerList by its ID.
   * @param {Object} state - The current state object.
   * @param {string} id - The ID of the distiller to remove.
   */
  removeDistillerById(state, id) {
    state.settingsForm.distillerList = state.settingsForm.distillerList.filter(
      (distiller) => distiller.id !== id
    );
    localStorage.setItem(
      "distillerList",
      JSON.stringify(state.settingsForm.distillerList)
    );
  },
};
