/**
 * Interface representing the root state properties used only in the root.
 * @interface
 * @property {boolean} comingFromRoute - Indicates if navigation came from a route change.
 * @property {string} searchQuery - The current search query string.
 */
export interface RootStateOnly {
  comingFromRoute: boolean;
  searchQuery: string;
}

/**
 * Shape of the entire Vuex state tree.
 * @interface
 * @augments RootStateOnly
 * @property {any} plant - The plant module state.
 * @property {any} auth - The auth module state.
 * @property {any} distillation - The distillation module state.
 * @property {any} results - The results module state.
 * @property {any} settings - The settings module state.
 */
export interface RootState extends RootStateOnly {
  plant: any;
  auth: any;
  distillation: any;
  results: any;
  settings: any;
}
