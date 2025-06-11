import type { AuthState } from "./index";
import { apolloClient } from "@/main";
import { VERIFY_AUTH } from "@/graphql/queries/auth";
import { LOGIN, LOGOUT, CHANGE_PASSWORD } from "@/graphql/mutations/auth";
import * as Sentry from "@sentry/vue";

/**
 * Auth module actions for handling data fetching.
 * @module authActions
 */

/**
 * Vuex action context for the auth module.
 * @interface
 * @property {AuthState} state - The Vuex state object.
 * @property {(mutation: string, value: any) => void} commit - Commits a mutation.
 * @property {(action: string, payload?: any) => void} dispatch - Dispatches an action.
 */
interface Context {
  state: AuthState;
  commit: (mutation: string, value: any) => void;
  dispatch: (action: string, payload?: any) => void;
}

export default {
  /**
   * Fetches the user's authentication status from the backend.
   * @param {Context} context - The Vuex action context.
   * @returns {Promise<boolean>} Resolves to true if authenticated, otherwise false.
   */
  async fetchUserAuthenticationStatus(context: Context): Promise<boolean> {
    try {
      const { data } = await apolloClient.query({
        query: VERIFY_AUTH,
      });
      context.commit(
        "changeUserAuthenticationStatus",
        data.verifyAuth.isAuthenticated
      );
      return data.verifyAuth.isAuthenticated;
    } catch (error) {
      Sentry.captureException(error);
      context.commit("changeUserAuthenticationStatus", false);
      console.error("GraphQL error:", error);
      return false;
    }
  },

  /**
   * Logs in the user with the provided credentials.
   * @param {Context} context - The Vuex action context.
   * @param {{ email: string; password: string }} param1 - The user's email and password.
   * @returns {Promise<boolean | string | undefined>} Resolves to true if successful, "Invalid credentials" if failed, or throws an error.
   */
  async login(
    context: Context,
    { email, password }: { email: string; password: string }
  ): Promise<boolean | string | undefined> {
    try {
      const response = await apolloClient.mutate({
        mutation: LOGIN,
        variables: { email, password },
      });

      const token = response.data.login; // assuming the backend returns a token

      if (token) {
        context.commit("changeUserAuthenticationStatus", true);
        return true;
      }
    } catch (error: any) {
      Sentry.captureException(error);
      if (error.message === "Invalid credentials") {
        return "Invalid credentials";
      }
      throw new Error("Login failed");
    }
  },

  /**
   * Logs out the user and clears relevant local storage.
   * @param {Context} context - The Vuex action context.
   * @returns {Promise<void>} Resolves when logout is complete.
   */
  async logout(context: Context): Promise<void> {
    try {
      await apolloClient.mutate({ mutation: LOGOUT });
      context.commit("changeUserAuthenticationStatus", false);

      // Clear local storage from settings keys
      localStorage.removeItem("plantListLength");
      localStorage.removeItem("distillationListLength");
      localStorage.removeItem("distillationArchivesListLength");

      localStorage.removeItem("plantListSorting");
      localStorage.removeItem("distillationListSorting");
      localStorage.removeItem("archiveDistillationListSorting");

      localStorage.removeItem("distillerList");

      localStorage.removeItem("searchQuery");

      localStorage.removeItem("isDarkTheme");
    } catch (error) {
      Sentry.captureException(error);
      console.error("Logout failed", error);
    }
  },

  /**
   * Sets the loading status for authentication actions.
   * @param {Context} context - The Vuex action context.
   * @param {boolean} value - The loading status value.
   * @returns {void}
   */
  setLoadingAuthStatus(context: Context, value: boolean): void {
    context.commit("changeLoadingAuthStatus", value);
  },

  /**
   * Changes the user's password.
   * @param {Context} context - The Vuex action context.
   * @param {{ oldPassword: string; newPassword: string }} param1 - The old and new passwords.
   * @returns {Promise<boolean | string>} Resolves to true if successful, "Invalid old password" if failed, or throws an error.
   */
  async changePassword(
    context: Context,
    { oldPassword, newPassword }: { oldPassword: string; newPassword: string }
  ): Promise<boolean | string> {
    try {
      const response = await apolloClient.mutate({
        mutation: CHANGE_PASSWORD,
        variables: { input: { oldPassword, newPassword } },
      });

      console.log(
        "Password changed successfully:",
        response.data.changePassword
      );
      return true;
    } catch (error: any) {
      Sentry.captureException(error);
      console.error("Failed to change password:", error.message);
      if (error.message === "Invalid old password") {
        return "Invalid old password";
      }
      throw new Error("Failed to change password");
    }
  },
};
