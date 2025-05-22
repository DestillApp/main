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
 * @returns {object} The Vuex store instance.
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
    changeComingFromRoute(state, value: boolean) {
      state.comingFromRoute = value;
    },
    setSearchQuery(state, value: string) {
      state.searchQuery = value;
      localStorage.setItem("searchQuery", value);
    },
  },
  actions: {
    setComingFromRoute(context, value: boolean) {
      context.commit("changeComingFromRoute", value);
    },
    updateSearchQuery(context, value: string) {
      context.commit("setSearchQuery", value);
    },
    fetchSearchQueryFromLocalStorage(context) {
      const value = localStorage.getItem("searchQuery");
      if (value) {
        context.commit("setSearchQuery", value);
      } else {
        context.commit("setSearchQuery", "");
      }
    },
  },
  getters: {
    comingFromRoute: (state) => state.comingFromRoute,
    searchQuery: (state) => state.searchQuery,
  },
});

export default store;
