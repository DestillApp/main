/**
 * Settings module getters for getting the settings form state.
 * @module settingsGetters
 */
export default {
  settingsForm(state) {
    return state.settingsForm;
  },

  distillerList(state) {
    return state.settingsForm.distillerList;
  },

  isDarkTheme(state) {
    return state.settingsForm.isDarkTheme;
  }
};