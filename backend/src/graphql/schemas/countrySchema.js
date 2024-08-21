/**
 * @module graphql/schemas/countrySchema
 * @description Defines the GraphQL schema for the country.
 */

// Importing gql from apollo-server-express
const { gql } = require("apollo-server-express");

const countrySchema = gql`
  type Query {
    getCountryNames(name: String!): [String]
  }
`;

// Exporting the country schema
module.exports = countrySchema;
