/**
 * @module graphql/schemas/countrySchema
 * @description Defines the GraphQL schema for the country.
 */

const gql = require("graphql-tag");

const countrySchema = gql`
  type Query {
    getCountryNames(name: String!): [String]
  }
`;

// Exporting the country schema
module.exports = countrySchema;
