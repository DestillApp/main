import { apolloClient } from "@/main";
import { CREATE_SETTINGS } from "@/graphql/mutations/settings";

/**
 * Settings module actions for handling settings form updates.
 * @module settingsActions
 */
export default {
//   setPlantListLength(context, length) {
//     context.commit("changePlantListLength", length);
//   },
//   setDistillationListLength(context, length) {
//     context.commit("changeDistillationListLength", length);
//   },
//   setDistillationArchivesListLength(context, length) {
//     context.commit("changeDistillationArchivesListLength", length);
//   },
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