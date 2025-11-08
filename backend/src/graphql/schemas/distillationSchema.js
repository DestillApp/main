/**
 * @module graphql/schemas/distillationSchema
 * @description Defines the GraphQL schema for distillation operations.
 * Provides types, queries and mutations for managing distillation processes.
 */

const gql = require("graphql-tag");

/**
 * @typedef {Object} DistillationSchema
 * @description GraphQL schema definition for distillation operations.
 * 
 * @example
 * // Example mutation usage:
 * mutation CreateDistillation($input: DistillationInput!) {
 *   createDistillation(distillationInput: $input) {
 *     _id
 *     choosedPlant {
 *       id
 *       name
 *       part
 *       availableWeight
 *       harvestDate
 *       buyDate
 *     }
 *     weightForDistillation
 *     isPlantSoaked
 *     soakingTime
 *     weightAfterSoaking
 *     isPlantShredded
 *     distillationType
 *     distillationDate
 *     distillationApparatus
 *     waterForDistillation
 *     distillationTime {
 *       distillationHours
 *       distillationMinutes
 *     }
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