/**
 * @module graphql/schemas/index
 * @description Combines and exports all individual GraphQL schemas.
 */

// Importing required modules
const { mergeTypeDefs } = require("@graphql-tools/merge");
const plantSchema = require("./plantSchema");
const userSchema = require("./userSchema");
const countrySchema = require("./countrySchema");
const distillationSchema = require("./distillationSchema");

// Merging all individual schemas into a single schema
const typeDefs = mergeTypeDefs([
  plantSchema,
  userSchema,
  countrySchema,
  distillationSchema,
]);

// Exporting the merged type definitions
module.exports = typeDefs;
