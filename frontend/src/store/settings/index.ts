import settingsMutations from "./mutations";
import settingsActions from "./actions";
import settingsGetters from "./getters";

/**
 * Settings module for managing the state related to settings.
 * @module settingsStore
 */

/**
 * Represents a distiller object.
 * @interface
 * @property {string} material - The material of the distiller.
 * @property {number} capacity - The capacity of the distiller.
 * @property {string} heating - The heating type of the distiller.
 * @property {string} id - The unique identifier for the distiller.
 */
export interface Distiller {
  material: string;
  capacity: number;
  heating: string;
  id: string;
}

/**
 * Represents the settings form state.
 * @interface
 * @property {number} plantListLength - The length of the plant list.
 * @property {number} distillationListLength - The length of the distillation list.
 * @property {number} distillationArchivesListLength - The length of the distillation archives list.
 * @property {string} plantListSorting - The sorting method for the plant list.
 * @property {string} distillationListSorting - The sorting method for the distillation list.
 * @property {string} archiveDistillationListSorting - The sorting method for the distillation archives list.
 * @property {Distiller[]} distillerList - The list of distillers.
 * @property {boolean} isDarkTheme - Whether the dark theme is enabled.
 */
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
   * @returns {{ settingsForm: SettingsForm }} The initial state object.
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

  /**
   * Mutations for updating the settings state.
   */
  mutations: settingsMutations,
  /**
   * Actions for performing asynchronous tasks in the settings module.
   */
  actions: settingsActions,
  /**
   * Getters for accessing settings state data.
   */
  getters: settingsGetters,
};
