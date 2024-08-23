/**
 * Vuex store configuration.
 * @module store
 */

import { createStore } from "vuex";

import plantModule from "../store/plant/index.js";
import authModule from "../store/auth/index.js";

/**
 * Creates the Vuex store with modules.
 * @returns {object} The Vuex store instance.
 */
const store = createStore({
  modules: {
    plant: plantModule,
    auth: authModule,
  },
  state() {},
});

export default store;
