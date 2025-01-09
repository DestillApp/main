/**
 * Vuex store configuration.
 * @module store
 */

import { createStore } from "vuex";

import plantModule from "../store/plant/index.js";
import authModule from "../store/auth/index.js";
import distillationModule from "./distillation/index.js";
import resultsModule from "./results/index.js";
import settingsModule from "./settings/index.js";

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
  state() {
    return {
      comingFromRoute: false,
      searchQuery: "",
    };
  },
  mutations: {
    changeComingFromRoute(state, value) {
      state.comingFromRoute = value;
    },
    setSearchQuery(state, value) {
      state.searchQuery = value;
      localStorage.setItem("searchQuery", value);
    },
  },
  actions: {
    setComingFromRoute(context, value) {
      context.commit("changeComingFromRoute", value);
    },
    updateSearchQuery(context, value) {
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
