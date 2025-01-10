import { apolloClient } from "@/main";
import { CREATE_SETTINGS } from "@/graphql/mutations/settings";

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
  async setInitialSettings() {
    try {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_SETTINGS,
      });
      console.log("Settings created:", data.createSettings);
    } catch (error) {
      console.error("Error creating settings:", error);
    }
  },
};