import type { SettingsForm, Distiller } from "./index";

/**
 * Settings module getters for getting the settings form state.
 * @module settingsGetters
 */

/**
 * Represents the state for the settings module.
 * @interface
 * @property {SettingsForm} settingsForm - The settings form state.
 */
interface State {
  settingsForm: SettingsForm;
}

export default {
  /**
   * Gets the settings form data from the state.
   * @param {State} state - The Vuex state.
   * @returns {SettingsForm} The settings form data.
   */
  settingsForm(state: State): SettingsForm {
    return state.settingsForm;
  },

  /**
   * Gets the distiller list from the settings form data.
   * @param {State} state - The Vuex state.
   * @returns {Distiller[]} The distiller list.
   */
  distillerList(state: State): Distiller[] {
    return state.settingsForm.distillerList;
  },

  /**
   * Gets the dark theme status from the settings form data.
   * @param {State} state - The Vuex state.
   * @returns {boolean} Whether dark theme is enabled.
   */
  isDarkTheme(state: State): boolean {
    return state.settingsForm.isDarkTheme;
  },
};
