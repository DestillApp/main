import { gql } from "@apollo/client/core";

/**
 * GraphQL query to verify if the user is authenticated.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const VERIFY_AUTH = gql`
  query VerifyAuth {
    verifyAuth {
      isAuthenticated
    }
  }
`;

/**
 * GraphQL query to check if a username exists.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const CHECK_USERNAME_EXISTENCE = gql`
  query CheckUsernameExistence($username: String!) {
    checkUsernameExistence(username: $username)
  }
`;

/**
 * GraphQL query to get user details.
 *
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const GET_USER_DETAILS = gql`
  query GetUserDetails {
    getUserDetails {
      username
      email
    }
  }
`;
