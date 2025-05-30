// const { AuthenticationError } = require("@apollo/server/errors");
// const { defaultFieldResolver } = require("graphql");
// const { SchemaDirectiveVisitor } = require('@graphql-tools/utils');


// class AuthDirective extends SchemaDirectiveVisitor {
//   visitFieldDefinition(field) {
//     const { resolve = defaultFieldResolver } = field;
//     field.resolve = async function (...args) {
//       const context = args[2];
//       if (!context.user) {
//         throw new AuthenticationError("Unauthorized");
//       }
//       return resolve.apply(this, args);
//     };
//   }
// }

// module.exports = AuthDirective;