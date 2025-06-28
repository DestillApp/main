import { gql } from "@apollo/client/core";

/**
 * GraphQL mutation to register a new user.
 * @constant
 * @type {import("@apollo/client/core").DocumentNode}
 */
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

/**
 * GraphQL mutation to login the user.
 * @constant
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

/**
 * GraphQL mutation to logout the user.
 * @constant
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

/**
 * GraphQL mutation to change the user's password.
 * @constant
 * @type {import("@apollo/client/core").DocumentNode}
 */
export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`;