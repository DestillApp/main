import { gql } from "@apollo/client/core";
import { apolloClient } from "@/main";

/**
 * Auth module actions for handling data fetching.
 * @module authActions
 */
export default {
  async fetchUserAuthenticationStatus(context) {
    console.log("userAuthQuery");
    const VERIFY_AUTH = gql`
      query VerifyAuth {
        verifyAuth {
          isAuthenticated
        }
      }
    `;
    try {
      const { data } = await apolloClient.query({
        query: VERIFY_AUTH,
      });
      context.commit(
        "setUserAuthenticationStatus",
        data.verifyAuth.isAuthenticated
      );
      console.log("GraphQL result:", data);
      return data.verifyAuth.isAuthenticated;
    } catch (error) {
      context.commit("setUserAuthenticationStatus", false);
      console.error("GraphQL error:", error);
      return false;
    }
  },

  async login({ commit }, { email, password }) {
    const LOGIN = gql`
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password)
      }
    `;
    try {
      const response = await apolloClient.mutate({
        mutation: LOGIN,
        variables: { email, password },
      });

      const token = response.data.login; // assuming the backend returns a token
      console.log("Login successful, token:", token);

      if (token) {
        commit("setUserAuthenticationStatus", true);
        return true;
      }
    } catch (error) {
      console.error("Login failed", error);
      throw new Error("Login failed");
    }
  },

  async logout(context) {
    const LOGOUT = gql`
      mutation Logout {
        logout
      }
    `;

    try {
      await apolloClient.mutate({ mutation: LOGOUT });
      context.commit("setUserAuthenticationStatus", false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  },
};
