import type { AuthState } from "./index";
import { apolloClient } from "@/main";
import { VERIFY_AUTH } from "@/graphql/queries/auth";
import { LOGIN, LOGOUT, CHANGE_PASSWORD } from "@/graphql/mutations/auth";

/**
 * Auth module actions for handling data fetching.
 * @module authActions
 */

interface Context {
  state: AuthState;
  commit: (mutation: string, value: any) => void;
  dispatch: (action: string, payload?: any) => void;
}

export default {
  async fetchUserAuthenticationStatus(context: Context): boolean {
    try {
      const { data } = await apolloClient.query({
        query: VERIFY_AUTH,
      });
      context.commit(
        "changeUserAuthenticationStatus",
        data.verifyAuth.isAuthenticated
      );
      console.log("GraphQL result:", data);
      return data.verifyAuth.isAuthenticated;
    } catch (error) {
      context.commit("changeUserAuthenticationStatus", false);
      console.error("GraphQL error:", error);
      return false;
    }
  },

  async login(
    context: Context,
    { email, password }: { email: string; password: string }
  ): Promise<boolean | string> {
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
    } catch (error) {
      console.error("Login failed", error);
      if (error.message === "Invalid credentials") {
        return "Invalid credentials";
      }
      throw new Error("Login failed");
    }
  },

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
      console.error("Logout failed", error);
    }
  },

  setLoadingAuthStatus(context: Context, value: boolean): void {
    context.commit("changeLoadingAuthStatus", value);
  },

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
    } catch (error) {
      console.error("Failed to change password:", error.message);
      if (error.message === "Invalid old password") {
        return "Invalid old password";
      }
      throw new Error("Failed to change password");
    }
  },
};
