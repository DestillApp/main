/**
 * @module graphql/schemas/plantSchema
 * @description Defines the GraphQL schema for the Plant type.
 */

// Importing gql from apollo-server-express
const { gql } = require("apollo-server-express");

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
    plantState: String!
    dryingTime: Int
    plantAge: Int
    isPlantSoaked: Boolean!
    soakingTime: Int
    weightAfterSoaking: Float
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
    plantState: String!
    dryingTime: Int
    plantAge: Int
    isPlantSoaked: Boolean!
    soakingTime: Int
    weightAfterSoaking: Float
  }

  type Query {
    getPlants: [Plant!]!
    # plant(id: ID!): Plant
  }

  type Mutation {
    createPlant(plantInput: PlantInput!): Plant!
    # updatePlant(id: ID!, plantInput: PlantInput!): Plant!
    # deletePlant(id: ID!): Plant!
  }
`;

// Exporting the plant schema
module.exports = plantSchema;
