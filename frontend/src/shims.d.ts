/**
 * TypeScript shim for importing .vue files as Vue components.
 * @module shims
 */

declare module "*.vue" {
  import { DefineComponent } from "vue";
  /**
   * The Vue component definition.
   * @type {DefineComponent<{}, {}, any>}
   */
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
