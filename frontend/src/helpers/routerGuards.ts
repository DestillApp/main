import store from "@/store/index";
import { RouteLocationNormalized, NavigationGuardNext } from "vue-router";

/**
 * Navigation guard that sets a flag in the store indicating whether the user is coming from another route.
 * @param {RouteLocationNormalized} to - The target Route object being navigated to.
 * @param {RouteLocationNormalized} from - The current Route object being navigated away from.
 * @param {NavigationGuardNext} next - The function to resolve the navigation.
 * @returns {void}
 */
export function comingFromRouteGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  if (from && from.name) {
    store.dispatch("setComingFromRoute", true);
  } else {
    store.dispatch("setComingFromRoute", false);
  }
  next();
}
