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
    login(email: String!, password: String!): String! # Assuming login returns a JWT token
    logout: Boolean!
  }
`;

// Exporting the user schema
module.exports = userSchema;
