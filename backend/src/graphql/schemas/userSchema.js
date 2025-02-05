/**
 * @module graphql/schemas/userSchema
 * @description Defines the GraphQL schema for the User type.
 */

// Importing gql from apollo-server-express
const { gql } = require("apollo-server-express");

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
