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

// GraphQL query to login the user
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

// GraphQL query to logout the user
export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;
