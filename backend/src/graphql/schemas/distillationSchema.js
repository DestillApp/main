/**
 * @module graphql/schemas/distillationArchivesSchema
 * @description Defines the GraphQL schema for distillation archives operations.
 * Provides types, queries and mutations for managing distillation archive records.
 */

const gql = require("graphql-tag");

/**
 * @typedef {Object} DistillationArchivesSchema
 * @description GraphQL schema definition for distillation archives operations.
 * Contains complete distillation archive types with results data, process data, and plant information.
 * 
 * @example
 * // Example query usage:
 * query GetDistillationArchives($fields: [String]!, $formatDates: Boolean!) {
 *   getDistillationArchives(fields: $fields, formatDates: $formatDates) {
 *     _id
 *     oilAmount
 *     hydrosolAmount
 *     distillationData {
 *       distillationType
 *       distillationDate
 *     }
 *     distilledPlant {
 *       plantName
 *       plantPart
 *     }
 *   }
 * }
 * 
 * @example
 * // Example mutation usage:
 * mutation CreateDistillationArchive($input: DistillationArchiveInput!) {
 *   createDistillationArchive(distillationArchiveInput: $input) {
 *     _id
 *     oilAmount
 *     hydrosolAmount
 *   }
 * }
 */
const distillationSchema = gql`
  type ChoosedPlant {
    id: ID!
    name: String!
    part: String!
    availableWeight: Float!
    harvestDate: String
    buyDate: String
  }

  input ChoosedPlantInput {
    id: ID!
    name: String!
    part: String!
    availableWeight: Float!
    harvestDate: String
    buyDate: String
  }

  type DistillationTime {
    distillationHours: Int
    distillationMinutes: Int
  }

  input DistillationTimeInput {
    distillationHours: Int
    distillationMinutes: Int
  }

  type Distillation {
    _id: ID!
    choosedPlant: ChoosedPlant!
    weightForDistillation: Float!
    isPlantSoaked: Boolean!
    soakingTime: Int
    weightAfterSoaking: Float
    isPlantShredded: Boolean!
    distillationType: String!
    distillationDate: String!
    distillationApparatus: String!
    waterForDistillation: Int!
    distillationTime: DistillationTime!
    date: String!
    userId: ID!
    createdAt: String!
  }

  input DistillationInput {
    choosedPlant: ChoosedPlantInput!
    weightForDistillation: Float!
    isPlantSoaked: Boolean!
    soakingTime: Int
    weightAfterSoaking: Float
    isPlantShredded: Boolean!
    distillationType: String!
    distillationDate: String!
    distillationApparatus: String!
    waterForDistillation: Int!
    distillationTime: DistillationTimeInput!
  }

  type Query {
    getDistillations(fields: [String]!, name: String, sorting: String): [Distillation]
    getDistillationById(id: ID!, formatDates: Boolean!): Distillation
  }

  type Mutation {
    createDistillation(distillationInput: DistillationInput!): Distillation!
    updateDistillation(
      id: ID!
      distillationInput: DistillationInput!
    ): Distillation!
    deleteDistillation(id: ID!): Boolean
  }
`;

// Exporting the distillation schema
module.exports = distillationSchema;
