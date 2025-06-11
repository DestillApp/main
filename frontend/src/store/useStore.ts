import { useStore as _useStore } from "vuex";
import type { RootState } from "@/types/store/index";

/**
 * Composable for accessing the Vuex store with typed root state.
 * @returns {import("vuex").Store<RootState>} The Vuex store instance with typed root state.
 */
export const useStore = () => _useStore<RootState>();
