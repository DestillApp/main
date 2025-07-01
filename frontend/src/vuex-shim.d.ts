declare module "vuex" {
  // Generic types for documentation generation
  type Store<S = any> = any;
  type ActionContext<S = any, R = any> = any;
  function createStore<S = any>(...args: any[]): any;
  function useStore<S = any>(...args: any[]): any;
  export { Store, ActionContext, createStore, useStore };
  export default {};
}
