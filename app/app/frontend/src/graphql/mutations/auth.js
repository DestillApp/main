import { gql } from "@apollo/client/core";

// GraphQL mutation to register the new user
export const REGISTER_USER = gql`
  mutation registerUser($input: UserInput!) {
    registerUser(userInput: $input) {
      _id
      username
      email
      password
    }
  }
`;
