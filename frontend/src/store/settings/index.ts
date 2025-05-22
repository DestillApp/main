import settingsMutations from "./mutations";
import settingsActions from "./actions";
import settingsGetters from "./getters";

/**
 * Settings module for managing the state related to settings.
 * @module settingsStore
 */

export interface Distiller {
  material: string;
  capacity: number;
  heating: string;
  id: string;
}

export interface SettingsForm {
  plantListLength: number;
  distillationListLength: number;
  distillationArchivesListLength: number;
  plantListSorting: string;
  distillationListSorting: string;
  archiveDistillationListSorting: string;
  distillerList: Distiller[];
  isDarkTheme: boolean;
}

export default {
  namespaced: true,

  /**
   * State object representing the settings form data.
   * @function state
   * @returns {Object} The initial state object.
   */
  state(): { settingsForm: SettingsForm } {
    return {
      settingsForm: {
        plantListLength: 10,
        distillationListLength: 10,
        distillationArchivesListLength: 10,
        plantListSorting: "createdAt",
        distillationListSorting: "createdAt",
        archiveDistillationListSorting: "createdAt",
        distillerList: [],
        isDarkTheme: false,
      },
    };
  },

  // Mutations for updating the state.
  mutations: settingsMutations,
  // Actions for performing asynchronous tasks.
  actions: settingsActions,
  // Getters for accessing state data.
  getters: settingsGetters,
};
