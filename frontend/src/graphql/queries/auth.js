// no docs
import { gql } from "@apollo/client/core";

// GraphQL query to verify if user is authenticated
export const VERIFY_AUTH = gql`
  query VerifyAuth {
    verifyAuth {
      isAuthenticated
    }
  }
`;

export const CHECK_USERNAME_EXISTENCE = gql`
  query CheckUsernameExistence($username: String!) {
    checkUsernameExistence(username: $username)
  }
`;

export const GET_USER_DETAILS = gql`
  query GetUserDetails {
    getUserDetails {
      username
      email
    }
  }
`;