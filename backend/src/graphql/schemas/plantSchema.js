/**
 * @module graphql/schemas/plantSchema
 * @description Defines the GraphQL schema for plant-related operations.
 * Provides types, queries and mutations for managing plant records.
 */

const gql = require("graphql-tag");

/**
 * @typedef {Object} PlantSchema
 * @description GraphQL schema definition for plant operations.
 * Contains plant types with complete plant information and CRUD operations.
 * 
 * @example
 * // Example query usage:
 * query GetPlants($fields: [String]!, $formatDates: Boolean!) {
 *   getPlants(fields: $fields, formatDates: $formatDates) {
 *     _id
 *     plantName
 *     plantPart
 *     availableWeight
 *     harvestDate
 *   }
 * }
 * 
 * @example
 * // Example mutation usage:
 * mutation CreatePlant($input: PlantInput!) {
 *   createPlant(plantInput: $input) {
 *     _id
 *     plantName
 *     plantPart
 *     availableWeight
 *   }
 * }
 */
const plantSchema = gql`
  type Plant {
    _id: ID!
    plantName: String!
    plantPart: String!
    plantOrigin: String!
    plantBuyDate: String
    plantProducer: String
    countryOfOrigin: String
    harvestDate: String
    harvestTemperature: Int
    harvestStartTime: String
    harvestEndTime: String
    plantWeight: Float!
    availableWeight: Float!
    plantState: String!
    dryingTime: Int
    plantAge: Int
    date: String!
    userId: ID!
    createdAt: String!
  }

  input PlantInput {
    plantName: String!
    plantPart: String!
    plantOrigin: String!
    plantBuyDate: String
    plantProducer: String
    countryOfOrigin: String
    harvestDate: String
    harvestTemperature: Int
    harvestStartTime: String
    harvestEndTime: String
    plantWeight: Float!
    availableWeight: Float!
    plantState: String!
    dryingTime: Int
    plantAge: Int
  }

  input UpdateAvailableWeightInput {
    id: ID!
    availableWeight: Float!
  }

  input ChangeAvailableWeightInput {
    id: ID!
    availableWeight: Float!
  }

  type Query {
    getPlants(fields: [String]!, formatDates: Boolean!, name: String, sorting: String): [Plant]
    getPlantById(id: ID!, formatDates: Boolean!): Plant
  }

  type Mutation {
    createPlant(plantInput: PlantInput!): Plant!
    updatePlant(id: ID!, plantInput: PlantInput!): Plant!
    deletePlant(id: ID!): Boolean
    updateAvailableWeight(input: UpdateAvailableWeightInput!): Plant!
    changeAvailableWeight(input: ChangeAvailableWeightInput!): Plant!
  }
`;

// Exporting the plant schema
module.exports = plantSchema;
