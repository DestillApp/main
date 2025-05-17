// store/types.ts
// import type { PlantState } from "./plant/types"; // <-- your module types
// import type { AuthState } from "./auth/types";
// import type { DistillationState } from "./distillation/types";
// import type { ResultsState } from "./results/types";
// import type { SettingsState } from "./settings/types";

export interface RootStateOnly {
  comingFromRoute: boolean;
  searchQuery: string;
}

/** Shape of the entire Vuex state tree */
export interface RootState extends RootStateOnly {
  plant: any;
  auth: any;
  distillation: any;
  results: any;
  settings: any;
}
