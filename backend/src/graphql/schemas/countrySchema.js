/**
 * @module graphql/schemas/countrySchema
 * @description Defines the GraphQL schema for country-related operations.
 * Provides queries for fetching country names from external REST API.
 */

const gql = require("graphql-tag");

/**
 * @typedef {Object} CountrySchema
 * @description GraphQL schema definition for country-related queries.
 * 
 * @example
 * // Example query usage:
 * query GetCountryNames($name: String!) {
 *   getCountryNames(name: $name)
 * }
 */
const countrySchema = gql`
  type Query {
    getCountryNames(name: String!): [String]
  }
`;

// Exporting the country schema
module.exports = countrySchema;
