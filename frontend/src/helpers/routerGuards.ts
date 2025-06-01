import store from "@/store/index";
import { RouteLocationNormalized, NavigationGuardNext } from "vue-router";

export function comingFromRouteGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  if (from && from.name) {
    store.dispatch("setComingFromRoute", true);
  } else {
    store.dispatch("setComingFromRoute", false);
  }
  next();
}
