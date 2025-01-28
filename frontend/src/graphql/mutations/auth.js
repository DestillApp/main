import { gql } from "@apollo/client/core";

// GraphQL mutation to register the new user
export const REGISTER_USER = gql`
mutation RegisterUser($userInput: UserInput!) {
  registerUser(userInput: $userInput) {
    _id
    username
    email
    password
  }
}
`;

// GraphQL mutation to login the user
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

// GraphQL mutation to logout the user
export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;