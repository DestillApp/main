/**
 * @module graphql/resolvers/plantResolvers
 * @description Plant resolvers for GraphQL queries and mutations.
 * Handles fetching and creating plants.
 */

// Importing the Plant model
const Plant = require("../../database/plant");

// Importing required modules
const { formatDate } = require("../../util/dateformater");
const { requireAuth } = require("../../util/authChecking");
const { GraphQLError } = require("graphql");
const { trim } = require("validator");

const {
  sanitizePlantInput,
} = require("../../util/sanitization/plantSanitizator");

// Utility function to filter data
function filterPlantData(data) {
  const filteredData = {};

  if (data.plantOrigin === "kupno") {
    data.harvestEndTime = "";
    data.harvestStartTime = "";
  }

  for (const key in data) {
    if (data[key] !== null && data[key] !== "") {
      filteredData[key] = data[key];
    }
  }
  return filteredData;
}

const plantResolver = {
  Query: {
    /**
     * @async
     * @function getPlants
     * @description Fetches all plants from the database with optional filtering, sorting, and date formatting.
     * @param {Object} _ - Unused parent parameter.
     * @param {Object} args - Query arguments.
     * @param {string[]} args.fields - Array of fields to include in the response.
     * @param {boolean} args.formatDates - Whether to format date fields for display.
     * @param {string} [args.name] - Optional plant name filter for case-insensitive search.
     * @param {string} [args.sorting] - Optional sorting parameter (plantName, youngDate, oldDate, createdAt).
     * @param {Object} context - GraphQL context object.
     * @param {Object} context.user - The authenticated user.
     * @returns {Promise<Array>} Array of plant objects with optional formatted dates.
     * @throws {GraphQLError} When authentication fails or database operation fails.
     */
    getPlants: async (_, { fields, formatDates, name, sorting }, { user }) => {
      requireAuth(user);

      try {
        // Build a projection object based on the fields argument
        const projection = {};
        fields.forEach((field) => {
          projection[field] = 1;
        });

        // Build a query object for filtering
        const filter = { userId: user.id }; // Filter by user ID
        if (name) {
          filter.plantName = { $regex: new RegExp(name, "i") }; // Case-insensitive search
        }

        // Build a sort object based on sortingProps
        let sort = null;
        if (sorting === "plantName") {
          sort = { plantName: 1 };
        } else if (sorting === "youngDate") {
          sort = { date: -1 };
        } else if (sorting === "oldDate") {
          sort = { date: 1 };
        } else if (sorting === "createdAt") {
          sort = { createdAt: 1 };
        }

        // Fetch plants with the specified fields from database
        const plants = sort
          ? await Plant.find(filter, projection).sort(sort)
          : await Plant.find(filter, projection);

        // Format date fields before returning the result
        return plants.map((plant) => {
          const formattedPlant = plant.toObject(); // Convert Mongoose document to plain JavaScript object

          // Format specific date fields
          if (formatDates) {
            if (formattedPlant.harvestDate) {
              formattedPlant.harvestDate = formatDate(
                formattedPlant.harvestDate
              );
            }
            if (formattedPlant.plantBuyDate) {
              formattedPlant.plantBuyDate = formatDate(
                formattedPlant.plantBuyDate
              );
            }
          }

          return formattedPlant;
        });
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error("Failed to fetch plants: " + error.message);
      }
    },

    /**
     * @async
     * @function getPlantById
     * @description Fetches a specific plant by its ID with optional date formatting.
     * @param {Object} _ - Unused parent parameter.
     * @param {Object} args - Query arguments.
     * @param {string} args.id - The ID of the plant to fetch.
     * @param {boolean} args.formatDates - Whether to format date fields for display.
     * @param {Object} context - GraphQL context object.
     * @param {Object} context.user - The authenticated user.
     * @returns {Promise<Object>} The plant object with optional formatted dates.
     * @throws {GraphQLError} When authentication fails or plant is not found.
     */
    getPlantById: async (_, { id, formatDates }, { user }) => {
      requireAuth(user);

      try {
        const plant = await Plant.findOne({ _id: id, userId: user.id });
        if (!plant) {
          throw new Error("Plant not found");
        }

        // Format specific date fields
        if (formatDates) {
          if (plant.plantBuyDate) {
            plant.plantBuyDate = formatDate(plant.plantBuyDate);
          }
          if (plant.harvestDate) {
            plant.harvestDate = formatDate(plant.harvestDate);
          }
        }
        return plant;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error("Failed to fetch plant by ID: " + error.message);
      }
    },
  },

  Mutation: {
    /**
     * @async
     * @function createPlant
     * @description Creates a new plant and saves it to the database.
     * @param {Object} _ - Unused parent parameter.
     * @param {Object} args - Mutation arguments.
     * @param {Object} args.plantInput - Input data for the new plant.
     * @param {Object} context - GraphQL context object.
     * @param {Object} context.user - The authenticated user creating the plant.
     * @returns {Promise<Object>} The created plant object.
     * @throws {GraphQLError} When authentication fails or creation fails.
     */
    createPlant: async (_, { plantInput }, { user }) => {
      requireAuth(user);

      // Sanitize all input fields
      const sanitizedPlant = sanitizePlantInput(plantInput);

      // Add backend-only fields, including the required date
      const sanitizedData = {
        ...sanitizedPlant,
        date: sanitizedPlant.plantBuyDate
          ? new Date(sanitizedPlant.plantBuyDate)
          : new Date(sanitizedPlant.harvestDate),
        userId: user.id,
        createdAt: Date.now(),
      };

      // Optionally filter out null/empty values
      const filteredData = filterPlantData(sanitizedData);

      try {
        const plant = new Plant(filteredData);
        const result = await plant.save();
        return result;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error("Failed to create plant: " + error.message);
      }
    },

    /**
     * @async
     * @function updatePlant
     * @description Updates an existing plant and saves it to the database.
     * @param {Object} _ - Unused parent parameter.
     * @param {Object} args - Mutation arguments.
     * @param {string} args.id - ID of the plant to update.
     * @param {Object} args.plantInput - Input data for the plant update.
     * @param {Object} context - GraphQL context object.
     * @param {Object} context.user - The authenticated user updating the plant.
     * @returns {Promise<Object>} The updated plant object.
     * @throws {GraphQLError} When authentication fails or update fails.
     */
    updatePlant: async (_, { id, plantInput }, { user }) => {
      requireAuth(user);

      // Sanitize all input fields
      const sanitizedPlant = sanitizePlantInput(plantInput);

      // Add backend-only fields, including the required date
      const sanitizedData = {
        ...sanitizedPlant,
        date: sanitizedPlant.plantBuyDate
          ? new Date(sanitizedPlant.plantBuyDate)
          : new Date(sanitizedPlant.harvestDate),
        userId: user.id,
      };

      // Filtering out null or empty string values
      const filteredData = filterPlantData(sanitizedData);

      try {
        const { createdAt, ...updateData } = filteredData;

        const updatedPlant = await Plant.findByIdAndUpdate(id, updateData, {
          new: true,
        });
        return updatedPlant;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error("Failed to update plant: " + error.message);
      }
    },

    /**
     * @async
     * @function deletePlant
     * @description Deletes a plant from the database.
     * @param {Object} _ - Unused parent parameter.
     * @param {Object} args - Mutation arguments.
     * @param {string} args.id - ID of the plant to delete.
     * @param {Object} context - GraphQL context object.
     * @param {Object} context.user - The authenticated user deleting the plant.
     * @returns {Promise<boolean>} True if deletion was successful, false otherwise.
     * @throws {GraphQLError} When authentication fails.
     */
    deletePlant: async (_, { id }, { user }) => {
      requireAuth(user);

      try {
        await Plant.findOneAndDelete({ _id: id, userId: user.id });
        return true;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        console.error("Failed to delete plant:", error);
        return false;
      }
    },

    /**
     * @async
     * @function updateAvailableWeight
     * @description Updates the available weight of a specific plant.
     * @param {Object} _ - Unused parent parameter.
     * @param {Object} args - Mutation arguments.
     * @param {Object} args.input - Input object containing plant ID and new available weight.
     * @param {string} args.input.id - ID of the plant to update.
     * @param {number} args.input.availableWeight - New available weight value.
     * @param {Object} context - GraphQL context object.
     * @param {Object} context.user - The authenticated user updating the plant.
     * @returns {Promise<Object>} The updated plant object.
     * @throws {GraphQLError} When authentication fails or update fails.
     */
    updateAvailableWeight: async (_, { input }, { user }) => {
      requireAuth(user);

      // Sanitize input fields using validator (no error throwing here)
      const sanitizedId = trim(input.id || "");
      const sanitizedAvailableWeight = trim(String(input.availableWeight));

      // Convert to number after sanitization
      const availableWeightNumber = parseFloat(sanitizedAvailableWeight);

      try {
        // Find plant by ID and update availableWeight
        const updatedPlant = await Plant.findOneAndUpdate(
          { _id: sanitizedId, userId: user.id },
          { availableWeight: availableWeightNumber },
          { new: true } // Returns the updated document
        );
        return updatedPlant;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error(
          "Failed to update plant's available weight: " + error.message
        );
      }
    },

    /**
     * @async
     * @function changeAvailableWeight
     * @description Changes the available weight of a plant by adding/subtracting from current weight.
     * @param {Object} _ - Unused parent parameter.
     * @param {Object} args - Mutation arguments.
     * @param {Object} args.input - Input object containing plant ID and weight change amount.
     * @param {string} args.input.id - ID of the plant to update.
     * @param {number} args.input.availableWeight - Amount to add to current available weight.
     * @param {Object} context - GraphQL context object.
     * @param {Object} context.user - The authenticated user updating the plant.
     * @returns {Promise<Object>} The updated plant object.
     * @throws {GraphQLError} When authentication fails, plant not found, or update fails.
     */
    changeAvailableWeight: async (_, { input }, { user }) => {
      requireAuth(user);

      try {
        // Sanitize and validate input fields using validator
        const sanitizedId = trim(input.id || "");
        const sanitizedAvailableWeight = trim(String(input.availableWeight));

        const availableWeightNumber = parseFloat(sanitizedAvailableWeight);

        // Find the plant by its ID
        const plant = await Plant.findOne({
          _id: sanitizedId,
          userId: user.id,
        });

        if (!plant) {
          throw new GraphQLError("Plant not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        plant.availableWeight = parseFloat(
          (plant.availableWeight + availableWeightNumber).toFixed(1)
        );

        // Save the updated plant document
        const updatedPlant = await plant.save();

        return updatedPlant;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new Error(
          "Failed to change plant's available weight: " + error.message
        );
      }
    },
  },
};

// Exporting the plant resolvers
module.exports = plantResolver;
