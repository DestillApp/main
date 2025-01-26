/**
 * @module graphql/schemas/distillationSchema
 * @description Defines the GraphQL schema for the Distillation type.
 */

// Importing gql from apollo-server-express
const { gql } = require("apollo-server-express");

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
