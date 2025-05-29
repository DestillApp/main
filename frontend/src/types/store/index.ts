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
