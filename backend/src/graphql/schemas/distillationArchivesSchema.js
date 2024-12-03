/**
 * @module graphql/schemas/distillationArchivesSchema
 * @description Defines the GraphQL schema for the Distillation Archives type.
 */

// Importing gql from apollo-server-express
const { gql } = require("apollo-server-express");

const distillationArchivesSchema = gql`
  type DistilledPlant {
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
    plantState: String!
    dryingTime: Int
    plantAge: Int
  }

  type DistillationTime {
    distillationHours: Int
    distillationMinutes: Int
  }

  type DistillationData {
    weightForDistillation: Float!
    isPlantSoaked: Boolean!
    soakingTime: Int
    weightAfterSoaking: Float
    isPlantShredded: Boolean!
    distillationType: String!
    distillationDate: String!
    distillationApparatus: String!
    waterForDistillation: Float!
    distillationTime: DistillationTime!
  }

  type DistillationArchive {
    _id: ID!
    oilAmount: Float!
    hydrosolAmount: Float!
    hydrosolpH: Float!
    oilDescription: String!
    hydrosolDescription: String!
    distillationData: DistillationData!
    distilledPlant: DistilledPlant!
  }

  input DistilledPlantInput {
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
    plantState: String!
    dryingTime: Int
    plantAge: Int
  }

  input DistillationTimeInput {
    distillationHours: Int
    distillationMinutes: Int
  }

  input DistillationDataInput {
    weightForDistillation: Float!
    isPlantSoaked: Boolean!
    soakingTime: Int
    weightAfterSoaking: Float
    isPlantShredded: Boolean!
    distillationType: String!
    distillationDate: String!
    distillationApparatus: String!
    waterForDistillation: Float!
    distillationTime: DistillationTimeInput!
  }

  input DistillationArchiveInput {
    oilAmount: Float!
    hydrosolAmount: Float!
    hydrosolpH: Float!
    oilDescription: String!
    hydrosolDescription: String!
    distillationData: DistillationDataInput!
    distilledPlant: DistilledPlantInput!
  }

  type Query {
    getDistillationArchives(
      fields: [String]!
      name: String
    ): [DistillationArchive]
    getArchiveDistillationById(
      id: ID!
      formatDates: Boolean!
    ): DistillationArchive
  }

  type Mutation {
    createDistillationArchive(
      distillationArchiveInput: DistillationArchiveInput!
    ): DistillationArchive!
    deleteDistillationArchive(id: ID!): Boolean
  }
`;

// Exporting the distillation archives schema
module.exports = distillationArchivesSchema;
