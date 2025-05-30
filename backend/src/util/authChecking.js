const { GraphQLError } = require("graphql");

const requireAuth = (user) => {
  if (!user) {
    throw new GraphQLError("Unauthorized", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
};

module.exports = { requireAuth }