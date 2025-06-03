import store from "@/store/index";
import router from "@/router";
import * as Sentry from "@sentry/vue";

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
