/**
 * @module graphql/schemas/plantSchema
 * @description Defines the GraphQL schema for the Plant type.
 */

const gql = require("graphql-tag");

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
