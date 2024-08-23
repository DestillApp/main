/**
 * @module graphql/resolvers/index
 * @description Combines and exports all GraphQL resolvers.
 */

// Importing the mergeResolvers function from @graphql-tools/merge
const { mergeResolvers } = require("@graphql-tools/merge");

// Importing the individual resolver modules
const plantResolver = require("./plantResolvers");
const userResolver = require("./userResolvers");
const countryResolver = require("./countryResolvers");

// Merging the individual resolvers into a single resolvers object
const resolvers = mergeResolvers([
  plantResolver,
  userResolver,
  countryResolver,
]);

// Exporting the merged resolvers object
module.exports = resolvers;
