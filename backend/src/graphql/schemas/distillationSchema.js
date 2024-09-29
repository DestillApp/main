/**
 * @module graphql/schemas/distillationSchema
 * @description Defines the GraphQL schema for the Distillation type.
 */

// Importing gql from apollo-server-express
const { gql } = require("apollo-server-express");

const distillationSchema = gql`
  type Distillation {
    _id: ID!
    weightForDistillation: Float!
    isPlantSoaked: Boolean!
    soakingTime: Int
    weightAfterSoaking: Float
    isPlantShredded: Boolean!
    distillationType: String!
    distillationDate: String!
    distillationApparatus: String!
    waterForDistillation: Int!
  }

  input DistillationInput {
    weightForDistillation: Float!
    isPlantSoaked: Boolean!
    soakingTime: Int
    weightAfterSoaking: Float
    isPlantShredded: Boolean!
    distillationType: String!
    distillationDate: String!
    distillationApparatus: String!
    waterForDistillation: Int!
  }

  type Mutation {
    createDistillation(distillationInput: DistillationInput!): Distillation!
    # updateDistillation(id: ID!, distillationInput: DistillationInput!): Distillation!
    # deleteDistillation(id: ID!): Boolean
  }
`;

// Exporting the distillation schema
module.exports = distillationSchema;

//   type Query {
//     # getDistillations(fields: [String]!): [Distillation]
//     # getDistillationById(id: ID!): Distillation
//   }
