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
