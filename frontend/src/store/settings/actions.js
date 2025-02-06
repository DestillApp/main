import { apolloClient } from "@/main";
import {
  CREATE_SETTINGS,
  DELETE_DISTILLER,
  ADD_DISTILLER,
} from "@/graphql/mutations/settings";
import { GET_USER_SETTINGS } from "@/graphql/queries/settings";

/**
 * Settings module actions for handling settings form updates.
 * @module settingsActions
 */
export default {
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
   * @function setInitialSettings
   * @description Creates initial settings in the database.
   */
  async setInitialSettings(context, userId) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_SETTINGS,
        variables: { userId },
      });
      console.log("Initial settings created:", data.createSettings);
    } catch (error) {
      console.error("Error creating settings:", error);
    }
  },

  /**
   * @function fetchSettings
   * @description Fetches user settings from the database.
   */
  async fetchSettings(context) {
    try {
      const { data } = await apolloClient.query({
        query: GET_USER_SETTINGS,
        fetchPolicy: "network-only",
      });
      const settings = data.getUserSettings.listSettings;
      const sorting = data.getUserSettings.listSorting;
      const distillers = data.getUserSettings.distillerList;
      const isDarkTheme = data.getUserSettings.isDarkTheme;

      console.log("fetchSettings, isDarkTheme", isDarkTheme);

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
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  },

  /**
   * @function fetchLocalStorageData
   * @description Fetches data from local storage and commits it to the state.
   * @param {Object} context - The Vuex context.
   * @param {Object} payload - The payload containing the key.
   * @param {string} payload.key - The key to fetch from local storage.
   */
  fetchLocalStorageData(context, { key }) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      if (value === null) {
        return;
      } else {
        context.commit("changeValue", { input: key, value });
      }
    } catch (error) {
      console.log("Error fetching data from local storage:", error);
    }
  },

  /**
   * @function addDistiller
   * @description Adds a distiller to the distillerList.
   * @param {Object} context - The Vuex context.
   * @param {Object} distiller - The distiller object to add.
   */
  async addDistiller(context, distiller) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: ADD_DISTILLER,
        variables: { distiller },
      });
      console.log("Distiller added:", data.addDistiller);
    } catch (error) {
      console.error("Error adding distiller:", error);
    }
  },

  /**
   * @function deleteDistillerById
   * @description Deletes a distiller from the distillerList by its ID.
   * @param {Object} context - The Vuex context.
   * @param {string} id - The ID of the distiller to delete.
   */
  async deleteDistillerById(context, id) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: DELETE_DISTILLER,
        variables: { distillerId: id },
      });
      context.commit("removeDistillerById", id);
      console.log("Distiller deleted:", data.deleteDistiller);
    } catch (error) {
      console.error("Error deleting distiller:", error);
    }
  },
};
