/**
 * @module graphql/schemas/settingsSchema
 * @description Defines the GraphQL schema for user settings operations.
 * Provides types, queries and mutations for managing user settings, list configurations, and distillers.
 */

const gql = require("graphql-tag");

/**
 * @typedef {Object} SettingsSchema
 * @description GraphQL schema definition for user settings operations.
 * Contains settings types for list configurations, sorting preferences, and distiller management.
 * 
 * @example
 * // Example query usage:
 * query GetUserSettings {
 *   getUserSettings {
 *     listSettings {
 *       plantListLength
 *       distillationListLength
 *     }
 *     listSorting {
 *       plantListSorting
 *       distillationListSorting
 *     }
 *     distillerList {
 *       id
 *       material
 *       capacity
 *       heating
 *     }
 *     isDarkTheme
 *   }
 * }
 *
 * @example
 * // Example mutation usage:
 * mutation UpdateListSettings($input: UpdateListSettingsInput!) {
 *   updateListSettings(input: $input) {
 *     listSettings {
 *       plantListLength
 *     }
 *   }
 * }
 */
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

  type Distiller {
   id: ID! 
    material: String!
    capacity: Float!
    heating: String!
  }

  type UserSettings {
    userId: ID!
    listSettings: ListSettings!
    listSorting: ListSorting!
    distillerList: [Distiller!]! 
    isDarkTheme: Boolean! 
    updatedAt: String!
  }

  input UpdateListSettingsInput {
    settingKey: String!
    settingValue: Int!
  }

  input UpdateListSortingInput {
    settingKey: String!
    settingValue: String!
  }

  input DistillerInput {
    material: String!
    capacity: Float!
    heating: String!
  }

  type Query {
    getUserSettings: UserSettings
  }

  type Mutation {
    createSettings(userId: ID!): UserSettings!
    updateListSettings(input: UpdateListSettingsInput!): UserSettings!
    updateListSorting(input: UpdateListSortingInput!): UserSettings!
    addDistiller(distiller: DistillerInput!): UserSettings! 
    deleteDistiller(distillerId: ID!): UserSettings!
    updateDarkTheme(isDarkTheme: Boolean!): UserSettings!
  }
`;

// Exporting the settings schema
module.exports = settingsSchema;