import { Store } from "vuex";
import type { RootState } from "@/types/store/index";
import { useStore as _useStore } from "vuex";

/**
 * Composable for accessing the Vuex store with typed root state.
 * @returns {import("vuex").Store<RootState>} The Vuex store instance with typed root state.
 */

export const useStore = (): Store<RootState> => _useStore();
