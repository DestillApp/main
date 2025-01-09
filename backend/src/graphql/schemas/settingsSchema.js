/**
 * @module graphql/schemas/settingsSchema
 * @description Defines the GraphQL schema for the User Settings type.
 */

// Importing gql from apollo-server-express
const { gql } = require("apollo-server-express");

const settingsSchema = gql`
  type ListSettings {
    plantListLength: Int!
    distillationListLength: Int!
    distillationArchivesListLength: Int!
  }

  type UserSettings {
    userId: ID!
    listSettings: ListSettings!
    updatedAt: String!
  }

  type Query {
    getUserSettings: UserSettings
  }

  type Mutation {
    createSettings: UserSettings!
  }
`;

module.exports = settingsSchema;