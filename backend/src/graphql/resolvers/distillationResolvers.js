/**
 * @module graphql/resolvers/distillationResolvers
 * @description Distillation resolvers for GraphQL queries and mutations.
 * Handles fetching and creating distillations.
 */

// Importing the Distillation model
const Distillation = require("../../database/distillation");

// Importing required modules
const { GraphQLError } = require("graphql");
const { formatDate, formatDateToString } = require("../../util/dateformater");
const { filterData } = require("../../util/dataformating");
const { requireAuth } = require("../../util/authChecking");

const {
  sanitizeDistillationInput,
} = require("../../util/sanitization/distillationSanitizer");

const distillationResolvers = {
  Query: {
    /**
     * @async
     * @function getDistillations
     * @description Fetches all distillations from the database with optional filtering and sorting.
     * @param {Object} _ - Unused parent parameter.
     * @param {Object} args - Query arguments.
     * @param {string[]} args.fields - Array of fields to include in the response.
     * @param {string} [args.name] - Optional plant name filter for case-insensitive search.
     * @param {string} [args.sorting] - Optional sorting parameter (plantName, createdAt, youngDate, oldDate).
     * @param {Object} context - GraphQL context object.
     * @param {Object} context.user - The authenticated user.
     * @returns {Promise<Array>} Array of distillation objects with formatted dates.
     * @throws {GraphQLError} When authentication fails or database operation fails.
     */
    getDistillations: async (_, { fields, name, sorting }, { user }) => {
      requireAuth(user);

      try {
        // Build a projection object based on the fields argument
        const projection = {};
        fields.forEach((field) => {
          projection[field] = 1;
        });

        // Build a filter object for potential filtering
        const filter = { userId: user.id }; // Filter by user ID

        // If a name is provided, add it to the filter
        if (name) {
          filter["choosedPlant.name"] = { $regex: new RegExp(name, "i") }; // Case-insensitive search
        }

        // Build a sort object based on sortingProps
        let sort = null;
        if (sorting === "plantName") {
          sort = { "choosedPlant.name": 1 };
        } else if (sorting === "createdAt") {
          sort = { createdAt: 1 };
        } else if (sorting === "youngDate") {
          sort = { date: -1 };
        } else if (sorting === "oldDate") {
          sort = { date: 1 };
        }

        // Fetch distillations with the specified fields from database
        const distillations = sort
          ? await Distillation.find(filter, projection).sort(sort)
          : await Distillation.find(filter, projection);

        // Return the formatted result
        return distillations.map((distillation) => {
          const formattedDistillation = { ...distillation._doc }; // For Mongoose

          // Format specific date field
          if (formattedDistillation.distillationDate) {
            formattedDistillation.distillationDate = formatDate(
              formattedDistillation.distillationDate
            );
          }

          return formattedDistillation;
        });
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error("Failed to fetch distillations: " + error.message);
      }
    },

    /**
     * @async
     * @function getDistillationById
     * @description Fetches a specific distillation by its ID with optional date formatting.
     * @param {Object} _ - Unused parent parameter.
     * @param {Object} args - Query arguments.
     * @param {string} args.id - The ID of the distillation to fetch.
     * @param {boolean} args.formatDates - Whether to format date fields for display.
     * @param {Object} context - GraphQL context object.
     * @param {Object} context.user - The authenticated user.
     * @returns {Promise<Object>} The distillation object with optional formatted dates.
     * @throws {GraphQLError} When authentication fails or distillation is not found.
     */
    getDistillationById: async (_, { id, formatDates }, { user }) => {
      requireAuth(user);

      try {
        const distillation = await Distillation.findOne({
          _id: id,
          userId: user.id,
        });
        if (!distillation) {
          throw new Error("Distillation not found");
        }

        // Format specific date fields
        if (formatDates) {
          if (distillation.distillationDate) {
            distillation.distillationDate = formatDate(
              distillation.distillationDate
            );
          }
        }
        return distillation;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error("Failed to fetch distillation by ID: " + error.message);
      }
    },
  },

  Mutation: {
    /**
     * @async
     * @function createDistillation
     * @description Creates a new distillation and saves it to the database.
     * @param {Object} _ - Unused parent parameter.
     * @param {Object} args - Mutation arguments.
     * @param {Object} args.distillationInput - Input data for the new distillation.
     * @param {Object} context - GraphQL context object.
     * @param {Object} context.user - The authenticated user creating the distillation.
     * @returns {Promise<Object>} The created distillation object.
     * @throws {GraphQLError} When authentication fails or creation fails.
     */
    createDistillation: async (_, { distillationInput }, { user }) => {
      requireAuth(user);

      const sanitizedDistillation =
        sanitizeDistillationInput(distillationInput);

      // Parse date for backend
      const sanitizedDate = sanitizedDistillation.distillationDate;
      const validDate = new Date(sanitizedDate);

      // Prepare sanitized data for DB
      const sanitizedData = {
        ...sanitizedDistillation,
        date: validDate.toISOString(),
        userId: user.id,
        createdAt: Date.now(),
      };

      // Filtering out null or empty string values
      const filteredData = filterData(sanitizedData);

      try {
        // Creating a new Distillation instance
        const distillation = new Distillation(filteredData);
        // Saving the distillation to the database
        const result = await distillation.save();
        return result;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error("Failed to create distillation: " + error.message);
      }
    },

    /**
     * @async
     * @function updateDistillation
     * @description Updates an existing distillation and saves it to the database.
     * @param {Object} _ - Unused parent parameter.
     * @param {Object} args - Mutation arguments.
     * @param {string} args.id - ID of the distillation to update.
     * @param {Object} args.distillationInput - Input data for the distillation update.
     * @param {Object} context - GraphQL context object.
     * @param {Object} context.user - The authenticated user updating the distillation.
     * @returns {Promise<Object>} The updated distillation object.
     * @throws {GraphQLError} When authentication fails or update fails.
     */
    updateDistillation: async (_, { id, distillationInput }, { user }) => {
      requireAuth(user);

      // Sanitize all input fields using your sanitizer
      const sanitizedDistillation =
        sanitizeDistillationInput(distillationInput);

      // Parse date for backend
      const sanitizedDate = sanitizedDistillation.distillationDate;
      const validDate = new Date(sanitizedDate);

      // Prepare sanitized data for DB
      const sanitizedData = {
        ...sanitizedDistillation,
        date: validDate.toISOString(),
        userId: user.id,
      };

      // Filtering out null or empty string values
      const filteredData = filterData(sanitizedData);

      try {
        // Exclude the createdAt field from the update data
        const { createdAt, ...updateData } = filteredData;

        const updatedDistillation = await Distillation.findByIdAndUpdate(
          id,
          updateData,
          {
            new: true,
          }
        );

        if (!updatedDistillation) {
          throw new Error("Distillation not found");
        }

        return updatedDistillation;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error("Failed to update distillation: " + error.message);
      }
    },

    /**
     * @async
     * @function deleteDistillation
     * @description Deletes a distillation from the database.
     * @param {Object} _ - Unused parent parameter.
     * @param {Object} args - Mutation arguments.
     * @param {string} args.id - ID of the distillation to delete.
     * @param {Object} context - GraphQL context object.
     * @param {Object} context.user - The authenticated user deleting the distillation.
     * @returns {Promise<boolean>} True if deletion was successful, false otherwise.
     * @throws {GraphQLError} When authentication fails.
     */
    deleteDistillation: async (_, { id }, { user }) => {
      requireAuth(user);

      try {
        await Distillation.findOneAndDelete({ _id: id, userId: user.id });
        return true;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        console.error("Failed to delete distillation:", error);
        return false;
      }
    },
  },
};

module.exports = distillationResolvers;
