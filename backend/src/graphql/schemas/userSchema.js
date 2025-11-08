/**
 * @module graphql/schemas/userSchema
 * @description Defines the GraphQL schema for user-related operations.
 * Provides types, queries and mutations for user authentication, registration, and account management.
 */

const gql = require("graphql-tag");

/**
 * @typedef {Object} UserSchema
 * @description GraphQL schema definition for user operations.
 * Contains user types for authentication, registration, and account management.
 * 
 * @example
 * // Example query usage:
 * query VerifyAuth {
 *   verifyAuth {
 *     isAuthenticated
 *   }
 * }
 * 
 * @example
 * // Example mutation usage:
 * mutation RegisterUser($userInput: UserInput!) {
 *   registerUser(userInput: $userInput) {
 *     _id
 *     username
 *     email
 *     password
 *   }
 * }
 */
const userSchema = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  input ChangePasswordInput {
  oldPassword: String!
  newPassword: String!
}

  type AuthStatus {
    isAuthenticated: Boolean
  }

  type Query {
    verifyAuth: AuthStatus!
    checkUsernameExistence(username: String!): Boolean!
    getUserDetails: User! 
  }

  type Mutation {
    registerUser(userInput: UserInput!): User!
    login(email: String!, password: String!): String!
    logout: Boolean!
    changePassword(input: ChangePasswordInput!): Boolean!
  }
`;

// Exporting the user schema
module.exports = userSchema;
