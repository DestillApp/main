const { GraphQLError } = require("graphql");

/**
 * @function requireAuth
 * @description Checks if a user is authenticated and throws an error if not.
 * @param {Object} user - The authenticated user object from GraphQL context
 * @throws {GraphQLError} When user is not authenticated
 */
const requireAuth = (user) => {
  if (!user) {
    throw new GraphQLError("Unauthorized", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
};

module.exports = { requireAuth };