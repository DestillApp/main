/**
 * Vuex store configuration.
 * @module store
 */

import { createStore, Store } from "vuex";
import type { RootStateOnly } from "@/types/store/index";

import plantModule from "./plant/index";
import authModule from "./auth/index";
import distillationModule from "./distillation/index";
import resultsModule from "./results/index";
import settingsModule from "./settings/index";

/**
 * Creates the Vuex store with modules.
 * @returns {Store<RootStateOnly>} The Vuex store instance.
 */
const store = createStore({
  modules: {
    plant: plantModule,
    auth: authModule,
    distillation: distillationModule,
    results: resultsModule,
    settings: settingsModule,
  },
  state: (): RootStateOnly => ({
    comingFromRoute: false,
    searchQuery: "",
  }),
  mutations: {
    /**
     * Mutation to change the comingFromRoute state.
     * @param {RootStateOnly} state - The root state object.
     * @param {boolean} value - The new value for comingFromRoute.
     * @returns {void}
     */
    changeComingFromRoute(state, value: boolean): void {
      state.comingFromRoute = value;
    },
    /**
     * Mutation to set the search query.
     * @param {RootStateOnly} state - The root state object.
     * @param {string} value - The new search query.
     * @returns {void}
     */
    setSearchQuery(state, value: string): void {
      state.searchQuery = value;
      localStorage.setItem("searchQuery", value);
    },
  },
  actions: {
    /**
     * Action to set comingFromRoute.
     * @param {object} context - The Vuex context.
     * @param {boolean} value - The new value for comingFromRoute.
     * @returns {void}
     */
    setComingFromRoute(context, value: boolean): void {
      context.commit("changeComingFromRoute", value);
    },
    /**
     * Action to update the search query.
     * @param {object} context - The Vuex context.
     * @param {string} value - The new search query.
     * @returns {void}
     */
    updateSearchQuery(context, value: string): void {
      context.commit("setSearchQuery", value);
    },
    /**
     * Action to fetch the search query from local storage and commit it to the state.
     * @param {object} context - The Vuex context.
     * @returns {void}
     */
    fetchSearchQueryFromLocalStorage(context): void {
      const value = localStorage.getItem("searchQuery");
      if (value) {
        context.commit("setSearchQuery", value);
      } else {
        context.commit("setSearchQuery", "");
      }
    },
  },
  getters: {
    /**
     * Gets the comingFromRoute state.
     * @param {RootStateOnly} state - The root state object.
     * @returns {boolean} The comingFromRoute value.
     */
    comingFromRoute: (state: RootStateOnly): boolean => state.comingFromRoute,
    /**
     * Gets the search query.
     * @param {RootStateOnly} state - The root state object.
     * @returns {string} The search query.
     */
    searchQuery: (state: RootStateOnly): string => state.searchQuery,
  },
});

export default store;
