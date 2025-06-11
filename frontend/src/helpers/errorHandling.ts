import store from "@/store/index";
import router from "@/router";
import * as Sentry from "@sentry/vue";

/**
 * Handles user errors by reporting them to Sentry, logging out the user if unauthorized,
 * redirecting to the login page, or logging the error to the console.
 * @param {any} error - The error object to handle.
 * @returns {Promise<void>} A promise that resolves when the error has been handled.
 */
export const handleUserError = async (error: any): Promise<void> => {
  Sentry.captureException(error);
  if (
    error.message === "Unauthorized" ||
    error?.graphQLErrors?.[0]?.extensions?.code === "UNAUTHENTICATED"
  ) {
    await store.dispatch("auth/logout");
    router.push("/login");
  } else {
    console.error("An error occurred:", error);
  }
};
