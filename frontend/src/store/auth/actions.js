import { apolloClient } from "@/main";
import { VERIFY_AUTH, LOGIN, LOGOUT } from "@/graphql/queries/auth.js";

/**
 * Auth module actions for handling data fetching.
 * @module authActions
 */
export default {
  async fetchUserAuthenticationStatus(context) {
    console.log("userAuthQuery");
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

  async login({ commit }, { email, password }) {
    try {
      const response = await apolloClient.mutate({
        mutation: LOGIN,
        variables: { email, password },
      });

      const token = response.data.login; // assuming the backend returns a token
      console.log("Login successful, token:", token);

      if (token) {
        commit("changeUserAuthenticationStatus", true);
        return true;
      }
    } catch (error) {
      console.error("Login failed", error);
      throw new Error("Login failed");
    }
  },

  async logout(context) {
    try {
      await apolloClient.mutate({ mutation: LOGOUT });
      context.commit("changeUserAuthenticationStatus", false);

      // Clear local storage from settings keys
      localStorage.removeItem("plantListLength");
      localStorage.removeItem("distillationListLength");
      localStorage.removeItem("distillationArchivesListLength");

      localStorage.removeItem("searchQuery");
    } catch (error) {
      console.error("Logout failed", error);
    }
  },

  setLoadingAuthStatus(context, value) {
    context.commit("changeLoadingAuthStatus", value);
  }
};
