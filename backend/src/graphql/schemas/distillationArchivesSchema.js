/**
 * @module graphql/schemas/distillationArchivesSchema
 * @description Defines the GraphQL schema for the Distillation Archives type.
 */

const gql = require("graphql-tag");

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
    date: String!
    userId: ID!
    createdAt: String!
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
      sorting: String
      formatDates: Boolean!
    ): [DistillationArchive]
    getArchiveDistillationById(
      id: ID!
      formatDistillDate: Boolean!
    ): DistillationArchive
  }

  type Mutation {
    createDistillationArchive(
      distillationArchiveInput: DistillationArchiveInput!
    ): DistillationArchive!
    updateDistillationArchive(
      id: ID!
      distillationArchiveInput: DistillationArchiveInput!
    ): DistillationArchive!
    deleteDistillationArchive(id: ID!): Boolean
  }
`;

// Exporting the distillation archives schema
module.exports = distillationArchivesSchema;
