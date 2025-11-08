/**
 * @module graphql/resolvers/distillationArchivesResolvers
 * @description Distillation Archives resolvers for GraphQL queries and mutations.
 * Handles creating and fetching distillation archives.
 */

// Importing the DistillationArchives model
const DistillationArchives = require("../../database/distillationArchives");

const { filterData } = require("../../util/dataformating");
const {
  formatDate,
  formatDateToString,
  parseDDMMYYYYtoDate,
} = require("../../util/dateformater");

// Importing required modules
const { GraphQLError } = require("graphql");
const { requireAuth } = require("../../util/authChecking");
const {
  sanitizeDistillationArchiveInput,
} = require("../../util/sanitization/distillationArchiveSanitizer");

const distillationArchivesResolvers = {
  Query: {
    /**
     * @async
     * @function getDistillationArchives
     * @description Fetches all distillation archives from the database with optional filtering and sorting.
     * @param {Object} _ - Unused parent parameter.
     * @param {Object} args - Query arguments.
     * @param {string[]} args.fields - Array of fields to include in the response.
     * @param {string} [args.name] - Optional plant name filter for case-insensitive search.
     * @param {string} [args.sorting] - Optional sorting parameter (plantName, createdAt, youngDate, oldDate).
     * @param {boolean} args.formatDates - Whether to format date fields for display.
     * @param {Object} context - GraphQL context object.
     * @param {Object} context.user - The authenticated user.
     * @returns {Promise<Array>} Array of distillation archive objects with optional formatted dates.
     * @throws {GraphQLError} When authentication fails or database operation fails.
     */
    getDistillationArchives: async (
      _,
      { fields, name, sorting, formatDates },
      { user }
    ) => {
      requireAuth(user);

      try {
        // Build a projection object based on the fields argument
        const projection = {};
        fields.forEach((field) => {
          projection[field] = 1;
        });

        const filter = { userId: user.id };

        // If a name is provided, add it to the filter
        if (name) {
          filter["distilledPlant.plantName"] = {
            $regex: new RegExp(name, "i"),
          }; // Case-insensitive search
        }

        // Build a sort object based on sortingProps
        let sort = null;
        if (sorting === "plantName") {
          sort = { "distilledPlant.plantName": 1 };
        } else if (sorting === "createdAt") {
          sort = { createdAt: 1 };
        } else if (sorting === "youngDate") {
          sort = { date: -1 };
        } else if (sorting === "oldDate") {
          sort = { date: 1 };
        }

        // Fetch distillation archives with the specified fields and filters from the database
        const distillationArchives = sort
          ? await DistillationArchives.find(filter, projection).sort(sort)
          : await DistillationArchives.find(filter, projection);

        // Return the formatted result
        return distillationArchives.map((archive) => {
          const formattedArchive = { ...archive._doc }; // For Mongoose

          // Format specific date fields if needed
          if (formatDates) {
            if (formattedArchive.distillationData.distillationDate) {
              formattedArchive.distillationData.distillationDate = formatDate(
                formattedArchive.distillationData.distillationDate
              );
            }
            if (formattedArchive.distilledPlant.plantBuyDate) {
              formattedArchive.distilledPlant.plantBuyDate = formatDate(
                formattedArchive.distilledPlant.plantBuyDate
              );
            }
            if (formattedArchive.distilledPlant.harvestDate) {
              formattedArchive.distilledPlant.harvestDate = formatDate(
                formattedArchive.distilledPlant.harvestDate
              );
            }
          }

          return formattedArchive;
        });
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error(
          "Failed to fetch distillation archives: " + error.message
        );
      }
    },

    /**
     * @async
     * @function getArchiveDistillationById
     * @description Fetches a specific distillation archive by its ID with optional date formatting.
     * @param {Object} _ - Unused parent parameter.
     * @param {Object} args - Query arguments.
     * @param {string} args.id - The ID of the distillation archive to fetch.
     * @param {boolean} args.formatDistillDate - Whether to format distillation date fields for display.
     * @param {Object} context - GraphQL context object.
     * @param {Object} context.user - The authenticated user.
     * @returns {Promise<Object>} The distillation archive object with optional formatted dates.
     * @throws {GraphQLError} When authentication fails or archive is not found.
     */
    getArchiveDistillationById: async (
      _,
      { id, formatDistillDate },
      { user }
    ) => {
      requireAuth(user);
      try {
        const archive = await DistillationArchives.findOne({
          _id: id,
          userId: user.id,
        });
        if (!archive) {
          throw new Error("Distillation archive not found");
        }

        if (archive.distilledPlant.plantBuyDate) {
          archive.distilledPlant.plantBuyDate = formatDate(
            archive.distilledPlant.plantBuyDate
          );
        }
        if (archive.distilledPlant.harvestDate) {
          archive.distilledPlant.harvestDate = formatDate(
            archive.distilledPlant.harvestDate
          );
        }

        // Format specific date fields if needed
        if (formatDistillDate) {
          if (archive.distillationData.distillationDate) {
            archive.distillationData.distillationDate = formatDate(
              archive.distillationData.distillationDate
            );
          }
        }

        return archive;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error(
          "Failed to fetch distillation archive by ID: " + error.message
        );
      }
    },
  },

  Mutation: {
    /**
     * @async
     * @function createDistillationArchive
     * @description Creates a new distillation archive and saves it to the database.
     * @param {Object} _ - Unused parent parameter.
     * @param {Object} args - Mutation arguments.
     * @param {Object} args.distillationArchiveInput - Input data for the new distillation archive.
     * @param {Object} context - GraphQL context object.
     * @param {Object} context.user - The authenticated user creating the distillation archive.
     * @returns {Promise<Object>} The created distillation archive object.
     * @throws {GraphQLError} When authentication fails or creation fails.
     */
    createDistillationArchive: async (
      _,
      { distillationArchiveInput },
      { user }
    ) => {
      requireAuth(user);

      // Sanitize all input fields
      const sanitizedInput = sanitizeDistillationArchiveInput(
        distillationArchiveInput
      );

      // Parse date for backend (from distillationData.distillationDate)
      const sanitizedDate = sanitizedInput.distillationData?.distillationDate;
      const validDate = sanitizedDate
        ? parseDDMMYYYYtoDate(sanitizedDate)
        : new Date();

      const sanitizedData = {
        ...sanitizedInput,
        date: validDate,
        userId: user.id,
        createdAt: Date.now(),
      };

      // Filtering out null or empty string values
      const filteredData = filterData(sanitizedData);

      try {
        // Creating a new DistillationArchives instance
        const distillationArchive = new DistillationArchives(filteredData);
        // Saving the distillation archive to the database
        const result = await distillationArchive.save();
        return result;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        console.error("Error details:", err);
        throw new Error("Failed to create distillation archive");
      }
    },

    /**
     * @async
     * @function updateDistillationArchive
     * @description Updates an existing distillation archive and saves it to the database.
     * @param {Object} _ - Unused parent parameter.
     * @param {Object} args - Mutation arguments.
     * @param {string} args.id - ID of the distillation archive to update.
     * @param {Object} args.distillationArchiveInput - Input data for the distillation archive update.
     * @param {Object} context - GraphQL context object.
     * @param {Object} context.user - The authenticated user updating the distillation archive.
     * @returns {Promise<Object>} The updated distillation archive object.
     * @throws {GraphQLError} When authentication fails or update fails.
     */
    updateDistillationArchive: async (
      _,
      { id, distillationArchiveInput },
      { user }
    ) => {
      requireAuth(user);

      // Sanitize all input fields
      const sanitizedInput = sanitizeDistillationArchiveInput(
        distillationArchiveInput
      );

      // Parse date for backend (from distillationData.distillationDate)
      const sanitizedDate = sanitizedInput.distillationData?.distillationDate;
      const validDate = sanitizedDate
        ? parseDDMMYYYYtoDate(sanitizedDate)
        : new Date();

      const sanitizedData = {
        ...sanitizedInput,
        date: validDate,
        userId: user.id,
      };

      // Filtering out null or empty string values
      const filteredData = filterData(sanitizedData);

      try {
        const { createdAt, ...updateData } = filteredData;

        const updatedDistillationArchive =
          await DistillationArchives.findByIdAndUpdate(id, updateData, {
            new: true,
          });
        return updatedDistillationArchive;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error("Failed to update distillation archive");
      }
    },

    /**
     * @async
     * @function deleteDistillationArchive
     * @description Deletes a distillation archive from the database.
     * @param {Object} _ - Unused parent parameter.
     * @param {Object} args - Mutation arguments.
     * @param {string} args.id - ID of the distillation archive to delete.
     * @param {Object} context - GraphQL context object.
     * @param {Object} context.user - The authenticated user deleting the distillation archive.
     * @returns {Promise<boolean>} True if deletion was successful, false otherwise.
     * @throws {GraphQLError} When authentication fails.
     */
    deleteDistillationArchive: async (_, { id }, { user }) => {
      requireAuth(user);

      try {
        await DistillationArchives.findOneAndDelete({
          _id: id,
          userId: user.id,
        });
        return true;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        console.error("Failed to delete distillation archive:", error);
        return false;
      }
    },
  },
};

// Exporting the distillation archives resolvers
module.exports = distillationArchivesResolvers;
