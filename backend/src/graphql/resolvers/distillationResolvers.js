/**
 * @module graphql/resolvers/distillationResolvers
 * @description Distillation resolvers for GraphQL queries and mutations.
 * Handles fetching and creating distillations.
 */

// Importing the Distillation model
const Distillation = require("../../database/distillation");

// Importing required modules
const DOMPurify = require("../../util/sanitizer");

// Utility function to filter data
function filterDistillationData(data) {
  const filteredData = {};

  for (const key in data) {
    if (data[key] !== null && data[key] !== "") {
      filteredData[key] = data[key];
    }
  }
  return filteredData;
}

const distillationResolvers = {
  Mutation: {
    /**
     * @async
     * @function createDistillation
     * @description Creates a new distillation and saves it to the database.
     * @param {Object} _ - Unused.
     * @param {Object} distillationInput - Input data for the new distillation.
     * @returns {Promise<Object>} The created distillation.
     */
    createDistillation: async (_, { distillationInput }) => {
      // Sanitizing the input data
      const sanitizedData = {
        weightForDistillation: distillationInput.weightForDistillation
          ? Number(DOMPurify.sanitize(distillationInput.weightForDistillation))
          : null,
        isPlantSoaked: Boolean(
          DOMPurify.sanitize(distillationInput.isPlantSoaked)
        ),
        soakingTime: distillationInput.soakingTime
          ? Number(DOMPurify.sanitize(distillationInput.soakingTime))
          : null,
        weightAfterSoaking: distillationInput.weightAfterSoaking
          ? Number(DOMPurify.sanitize(distillationInput.weightAfterSoaking))
          : null,
        isPlantShredded: Boolean(
          DOMPurify.sanitize(distillationInput.isPlantShredded)
        ),
      };
      // Filtering out null or empty string values
      const filteredData = filterDistillationData(sanitizedData);

      try {
        // Creating a new Distillation instance
        const distillation = new Distillation(filteredData);
        // Saving the distillation to the database
        const result = await distillation.save();
        return result;
      } catch (err) {
        throw new Error("Failed to create plant");
      }
    },
  },
};

// Exporting the distillation resolvers
module.exports = distillationResolvers;
