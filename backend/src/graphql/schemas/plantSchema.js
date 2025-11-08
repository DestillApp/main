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
 * export const GET_BASIC_PLANT_BY_ID = gql`
 *   query GetPlantById($id: ID!, $formatDates: Boolean!) {
 *     getPlantById(id: $id, formatDates: $formatDates) {
 *       _id
 *       plantName
 *       plantPart
 *       availableWeight
 *       plantBuyDate
 *       harvestDate
 *     }
 *   }
 * `;
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
