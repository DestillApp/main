/**
 * @module graphql/index
 * @description Combines and exports GraphQL schema definitions and resolvers.
 */

// Importing GraphQL schema definitions
const typeDefs = require("./schemas/index.js");
// Importing GraphQL resolvers
const resolvers = require("./resolvers/index.js");

// Exporting type definitions and resolvers
module.exports = {
  typeDefs,
  resolvers,
};
