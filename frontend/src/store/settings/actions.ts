import type { SettingsForm, Distiller } from "./index";
import { apolloClient } from "@/main";
import {
  CREATE_SETTINGS,
  DELETE_DISTILLER,
  ADD_DISTILLER,
} from "@/graphql/mutations/settings";
import { GET_USER_SETTINGS } from "@/graphql/queries/settings";
import * as Sentry from "@sentry/vue";

/**
 * Settings module actions for handling settings form updates.
 * @module settingsActions
 */

/**
 * Represents the state for the settings module.
 * @interface
 * @property {SettingsForm} settingsForm - The settings form state.
 */
interface State {
  settingsForm: SettingsForm;
}

/**
 * Vuex action context for the settings module.
 * @interface
 * @property {State} state - The Vuex state object.
 * @property {(mutation: string, payload?: any) => void} commit - Commits a mutation.
 * @property {(action: string, payload?: any) => void} dispatch - Dispatches an action.
 */
interface Context {
  state: State;
  commit: (mutation: string, payload?: any) => void;
  dispatch: (action: string, payload?: any) => void;
}

export default {
  /**
   * Sets a value in the state.
   * @param {Context} context - The Vuex context.
   * @param {{ input: string; value: string | number | boolean | Array<any> }} payload - The payload containing the input and value.
   * @returns {void}
   */
  setValue(
    context: Context,
    {
      input,
      value,
    }: { input: string; value: string | number | boolean | Array<any> }
  ): void {
    context.commit("changeValue", { input, value });
  },

  /**
   * Creates initial settings in the database.
   * @param {Context} context - The Vuex context.
   * @param {string} userId - The user ID for which to create settings.
   * @returns {Promise<void>}
   */
  async setInitialSettings(context: Context, userId: string): Promise<void> {
    try {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_SETTINGS,
        variables: { userId },
      });
    } catch (error) {
      Sentry.captureException(error);
      console.error("Error creating settings:", error);
    }
  },

  /**
   * Fetches user settings from the database.
   * @param {Context} context - The Vuex context.
   * @returns {Promise<void | string>}
   */
  async fetchSettings(context: Context): Promise<void | string> {
    try {
      const { data } = await apolloClient.query({
        query: GET_USER_SETTINGS,
        fetchPolicy: "network-only",
      });
      const settings = data.getUserSettings.listSettings;
      const sorting = data.getUserSettings.listSorting;
      const distillers = data.getUserSettings.distillerList;
      const isDarkTheme = data.getUserSettings.isDarkTheme;

      // Update the Vuex store with the fetched settings
      context.dispatch("setValue", {
        input: "plantListLength",
        value: settings.plantListLength,
      });
      context.dispatch("setValue", {
        input: "distillationListLength",
        value: settings.distillationListLength,
      });
      context.dispatch("setValue", {
        input: "distillationArchivesListLength",
        value: settings.distillationArchivesListLength,
      });

      context.dispatch("setValue", {
        input: "plantListSorting",
        value: sorting.plantListSorting,
      });
      context.dispatch("setValue", {
        input: "distillationListSorting",
        value: sorting.distillationListSorting,
      });
      context.dispatch("setValue", {
        input: "archiveDistillationListSorting",
        value: sorting.archiveDistillationListSorting,
      });

      context.dispatch("setValue", {
        input: "distillerList",
        value: distillers,
      });

      context.dispatch("setValue", {
        input: "isDarkTheme",
        value: isDarkTheme,
      });
    } catch (error: any) {
      Sentry.captureException(error);
      if (error.message === "Unauthorized") {
        return "Unauthorized";
      }
      console.error("Error fetching settings:", error);
    }
  },

  /**
   * Fetches data from local storage and commits it to the state.
   * @param {Context} context - The Vuex context.
   * @param {{ key: keyof SettingsForm }} payload - The payload containing the key.
   * @returns {void}
   */
  fetchLocalStorageData(
    context: Context,
    { key }: { key: keyof SettingsForm }
  ): void {
    try {
      const rawValue = localStorage.getItem(key as string);
      if (rawValue === null) {
        return;
      }
      const value = JSON.parse(rawValue);
      context.commit("changeValue", { input: key, value });
    } catch (error) {
      Sentry.captureException(error);
      console.log("Error fetching data from local storage:", error);
    }
  },

  /**
   * Adds a distiller to the distillerList.
   * @param {Context} context - The Vuex context.
   * @param {Distiller} distiller - The distiller object to add.
   * @returns {Promise<void | string>}
   */
  async addDistiller(
    context: Context,
    distiller: Distiller
  ): Promise<void | string> {
    try {
      const { data } = await apolloClient.mutate({
        mutation: ADD_DISTILLER,
        variables: { distiller },
      });
    } catch (error: any) {
      Sentry.captureException(error);
      if (error.message === "Unauthorized") {
        return "Unauthorized";
      }
      console.error("Error adding distiller:", error);
    }
  },

  /**
   * Deletes a distiller from the distillerList by its ID.
   * @param {Context} context - The Vuex context.
   * @param {string} id - The ID of the distiller to delete.
   * @returns {Promise<void | string>}
   */
  async deleteDistillerById(
    context: Context,
    id: string
  ): Promise<void | string> {
    try {
      const { data } = await apolloClient.mutate({
        mutation: DELETE_DISTILLER,
        variables: { distillerId: id },
      });
      context.commit("removeDistillerById", id);
    } catch (error: any) {
      Sentry.captureException(error);
      if (error.message === "Unauthorized") {
        return "Unauthorized";
      }
      console.error("Error deleting distiller:", error);
    }
  },
};
