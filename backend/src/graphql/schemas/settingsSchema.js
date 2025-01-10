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

  input UpdateListSettingsInput {
    settingKey: String!
    settingValue: Int!
  }

  type Query {
    getUserSettings: UserSettings
  }

  type Mutation {
    createSettings: UserSettings!
    updateListSettings(input: UpdateListSettingsInput!): UserSettings!
  }
`;

module.exports = settingsSchema;