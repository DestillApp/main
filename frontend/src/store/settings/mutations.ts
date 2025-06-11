import type { SettingsForm } from "./index";
/**
 * Settings module mutations for updating the state.
 * @module settingsMutations
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
   * Mutation to change the value of a field in the settings form.
   * @param {State} state - The current state object.
   * @param {{ input: K; value: SettingsForm[K] }} payload - Payload containing the input field name and its new value.
   * @returns {void}
   */
  changeValue<K extends keyof SettingsForm>(
    state: State,
    { input, value }: { input: K; value: SettingsForm[K] }
  ): void {
    state.settingsForm[input] = value;
    localStorage.setItem(input as string, JSON.stringify(value));
  },

  /**
   * Mutation to remove a distiller from the distillerList by its ID.
   * @param {State} state - The current state object.
   * @param {string} id - The ID of the distiller to remove.
   * @returns {void}
   */
  removeDistillerById(state: State, id: string): void {
    state.settingsForm.distillerList = state.settingsForm.distillerList.filter(
      (distiller) => distiller.id !== id
    );
    localStorage.setItem(
      "distillerList",
      JSON.stringify(state.settingsForm.distillerList)
    );
  },
};
