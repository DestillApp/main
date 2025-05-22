import type { SettingsForm, Distiller } from "./index";

/**
 * Settings module getters for getting the settings form state.
 * @module settingsGetters
 */
interface State {
  settingsForm: SettingsForm;
}

export default {
  settingsForm(state: State): SettingsForm {
    return state.settingsForm;
  },

  distillerList(state: State): Distiller[] {
    return state.settingsForm.distillerList;
  },

  isDarkTheme(state: State): boolean {
    return state.settingsForm.isDarkTheme;
  },
};
