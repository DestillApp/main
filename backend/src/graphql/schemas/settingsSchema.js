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

  type ListSorting {
    plantListSorting: String!
    distillationListSorting: String!
    archiveDistillationListSorting: String!
  }

  type UserSettings {
    userId: ID!
    listSettings: ListSettings!
    listSorting: ListSorting!
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
    createSettings(userId: ID!): UserSettings!
    updateListSettings(input: UpdateListSettingsInput!): UserSettings!
  }
`;

module.exports = settingsSchema;