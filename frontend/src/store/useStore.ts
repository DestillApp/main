import { useStore as _useStore } from "vuex";
import type { RootState } from "@/types/store/index";

export const useStore = () => _useStore<RootState>();
